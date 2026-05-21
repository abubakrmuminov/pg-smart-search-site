'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../context/I18nContext';
import styles from './CodeSandbox.module.css';

const CODE_SAMPLES = {
  basic: `import { createSearchClient } from 'pg-smart-search';

const search = createSearchClient(db);

// Standard indexed search
const results = await search.query({
  engine: 'fts',
  query: 'postgres sdk',
  limit: 10
});`,
  prisma: `// Prisma Integration (Adapter Mode)
import { PrismaAdapter } from 'pg-smart-search/adapters';

const search = new TrigramSearchEngine(
  new PrismaAdapter(prisma.product),
  { tableName: 'Product' }
);

const results = await search.search({
  query: 'smart phne',
  limit: 20
});`,
  typeorm: `// TypeORM Decoration
@Entity()
export class Product {
  @PrimaryGeneratedColumn() id: number;
  
  @Column() name: string;

  @Index({ fulltext: true })
  @Column('tsvector') search_vector: string;
}

// usage: search.query({ engine: 'fts', ... })`,
  parallel: `// Parallel search orchestration
const results = await search.query({
  query: 'fuzzy terms',
  strategy: 'parallel', // Runs FTS + Trigram simultaneously
  engines: ['fts', 'trigram'],
  dedup: true,
  minSimilarity: 0.4
});`,
  abort: `// Zombie query prevention
const controller = new AbortController();

const results = await search.query({
  query: 'long running query',
  signal: controller.signal,
  timeout: 500 // Multi-layer timeout protection
});

// Cancel if user navigates away
controller.abort();`
};

const Token: React.FC<{ type: string; children: string }> = ({ type, children }) => {
  return <span className={styles[type]}>{children}</span>;
};

const HighlightingLine: React.FC<{ line: string }> = ({ line }) => {
  // Simple regex-based tokenizer for demo
  const tokens = useMemo(() => {
    const parts: { type: string; text: string }[] = [];
    const keywords = ['import', 'const', 'await', 'new', 'true', 'false', 'from'];
    const brandFns = ['createSearchClient', 'query', 'search', 'abort'];
    
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
    return parts;
  }, [line]);

  return (
    <div className={styles.line}>
      {tokens.map((t, i) => (
        <span key={i} className={styles[t.type]}>{t.text}</span>
      ))}
    </div>
  );
};

export const CodeSandbox: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<keyof typeof CODE_SAMPLES>('basic');
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runSimulation = () => {
    setIsExecuting(true);
    setResults([]);
    
    // Simulate streaming response
    const mockResults = [
      { id: 1, text: 'PostgreSQL Internals', rank: 0.98 },
      { id: 2, text: 'Smart Search V2', rank: 0.95 },
      { id: 3, text: 'Fast Fuzzy Logic', rank: 0.89 },
    ];

    let i = 0;
    const interval = setInterval(() => {
      const item = mockResults[i];
      if (item !== undefined) {
        setResults(prev => [...prev, item]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsExecuting(false), 500);
      }
    }, 150);
  };

  return (
    <section className={styles.sandboxSection}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'basic' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            {t.sandbox.tabBasic}
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'prisma' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('prisma')}
          >
            PRISMA
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'typeorm' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('typeorm')}
          >
            TYPEORM
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'parallel' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('parallel')}
          >
            {t.sandbox.tabParallel}
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'abort' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('abort')}
          >
            {t.sandbox.tabAbort}
          </button>
        </div>

        <div className={styles.editorContainer}>
          <div className={styles.editor}>
            <div className={styles.lines}>
              {CODE_SAMPLES[activeTab].split('\n').map((line, i) => (
                <HighlightingLine key={i} line={line} />
              ))}
            </div>
          </div>

          <div className={styles.output}>
            <div className={styles.outputHeader}>
              <span>{t.sandbox.header}</span>
              <button onClick={runSimulation} disabled={isExecuting} className={styles.runBtn}>
                {isExecuting ? t.sandbox.btnRunning : t.sandbox.btnExecute}
              </button>
            </div>
            
            <div className={styles.outputContent}>
              <AnimatePresence>
                {results.map((res, i) => (
                  <motion.div 
                    key={res.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={styles.resultItem}
                  >
                    <span className={styles.resId}>[{res.id}]</span>
                    <span className={styles.resText}>{res.text}</span>
                    <span className={styles.resRank}>{t.sandbox.resultRank}: {res.rank}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!isExecuting && results.length === 0 && (
                <div className={styles.emptyOutput}>{t.sandbox.ready}</div>
              )}
            </div>

            <div className={styles.statusBar}>
              <span>{t.sandbox.status}: {isExecuting ? t.sandbox.statusStreaming : t.sandbox.statusIdle}</span>
              <span>{t.sandbox.latency}: {isExecuting ? '34ms' : '0ms'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
