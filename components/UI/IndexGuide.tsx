'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../context/I18nContext';
import styles from './IndexGuide.module.css';

const INDEX_DATA = {
  gin: {
    title: 'GIN (Generalized Inverted Index)',
    desc: 'Best for Full Text Search (FTS). It stores a list of document IDs for every unique word (lexeme).',
    sql: 'CREATE INDEX idx_fts ON products USING GIN (search_vector);',
    prisma: 'model Product {\n  search_vector Unsupported("tsvector")\n  @@index([search_vector], type: Gin)\n}',
    typeorm: '@Index({ fulltext: true })\n@Column("tsvector")\nsearch_vector: string;',
    color: '#22d3ee'
  },
  gist: {
    title: 'GiST (Generalized Search Tree)',
    desc: 'Best for Trigram similarity. It builds a tree-like structure for fast fuzzy matching with typos.',
    sql: 'CREATE INDEX idx_trgm ON products USING GIST (name gist_trgm_ops);',
    prisma: 'model Product {\n  name String\n  @@index([name], type: Gist, ops: "gist_trgm_ops")\n}',
    typeorm: '@Index({ spatial: true }) // Using GiST for trigrams\n@Column()\nname: string;',
    color: '#2a59ff'
  }
};

export const IndexGuide: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'gin' | 'gist'>('gin');
  const [codeLang, setCodeLang] = useState<'sql' | 'prisma' | 'typeorm'>('sql');

  const data = INDEX_DATA[activeTab];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>DATABASE INDEXING GUIDE</h2>
        <p className={styles.subtitle}>Optimize your PostgreSQL for hybrid search performance.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.selector}>
          <button 
            className={`${styles.selectBtn} ${activeTab === 'gin' ? styles.activeGin : ''}`}
            onClick={() => setActiveTab('gin')}
          >
            FTS (GIN)
          </button>
          <button 
            className={`${styles.selectBtn} ${activeTab === 'gist' ? styles.activeGist : ''}`}
            onClick={() => setActiveTab('gist')}
          >
            FUZZY (GiST)
          </button>
        </div>

        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle} style={{ color: data.color }}>{data.title}</h3>
            <p className={styles.cardDesc}>{data.desc}</p>
          </div>

          <div className={styles.codeTabs}>
            {(['sql', 'prisma', 'typeorm'] as const).map(lang => (
              <button 
                key={lang}
                className={`${styles.codeTab} ${codeLang === lang ? styles.activeCodeTab : ''}`}
                onClick={() => setCodeLang(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className={styles.codePanel}>
            <pre className={styles.pre}>
              <code>{data[codeLang]}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
