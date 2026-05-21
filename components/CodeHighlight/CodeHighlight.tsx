'use client';

import React from 'react';
import styles from './CodeHighlight.module.css';

interface CodeHighlightProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeHighlight: React.FC<CodeHighlightProps> = ({ code, language = 'typescript', filename }) => {
  // Simple syntax colorizer logic (similar to Sandbox but for static display)
  const tokenize = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const parts: { type: string; text: string }[] = [];
      const keywords = ['import', 'const', 'await', 'new', 'true', 'false', 'from', 'export', 'async', 'return'];
      const brandFns = ['createSearchClient', 'query', 'search', 'abort', 'pgSmartSearch'];
      
      let remaining = line;
      while (remaining.length > 0) {
        if (remaining.startsWith('//')) {
          parts.push({ type: 'comment', text: remaining });
          break;
        }
        
        const matchWord = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
        if (matchWord) {
          const word = matchWord[0];
          if (keywords.includes(word)) parts.push({ type: 'keyword', text: word });
          else if (brandFns.includes(word)) parts.push({ type: 'brandFn', text: word });
          else parts.push({ type: 'text', text: word });
          remaining = remaining.substring(word.length);
          continue;
        }

        const matchString = remaining.match(/^['"][^'"]*['"]/);
        if (matchString) {
          parts.push({ type: 'string', text: matchString[0] });
          remaining = remaining.substring(matchString[0].length);
          continue;
        }

        const matchNumber = remaining.match(/^[0-9]+/);
        if (matchNumber) {
          parts.push({ type: 'number', text: matchNumber[0] });
          remaining = remaining.substring(matchNumber[0].length);
          continue;
        }

        parts.push({ type: 'operator', text: remaining[0] });
        remaining = remaining.substring(1);
      }
      return (
        <div key={i} className={styles.line}>
          <span className={styles.lineNum}>{i + 1}</span>
          <span className={styles.lineContent}>
            {parts.map((p, j) => (
              <span key={j} className={styles[p.type]}>{p.text}</span>
            ))}
          </span>
        </div>
      );
    });
  };

  return (
    <div className={styles.wrapper}>
      {filename && <div className={styles.filename}>{filename}</div>}
      <pre className={styles.pre}>
        <code>{tokenize(code)}</code>
      </pre>
      <button 
        className={styles.copyBtn}
        onClick={() => navigator.clipboard.writeText(code)}
      >
        COPY
      </button>
    </div>
  );
};
