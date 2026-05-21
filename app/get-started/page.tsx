'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/UI/Navbar';
import { AmbientBackground } from '../../components/Ambient/AmbientBackground';
import { CodeHighlight } from '../../components/CodeHighlight/CodeHighlight';
import { useI18n } from '../../context/I18nContext';
import styles from './get-started.module.css';

export default function GetStarted() {
  const { t } = useI18n();
  const revealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
  };

  return (
    <div className={styles.getStarted}>
      <Navbar />
      <AmbientBackground />

      <main className={styles.main}>
        <motion.header 
          className={styles.header}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
        >
          <span className={styles.eyebrow}>{t.getStarted.eyebrow}</span>
          <h1 className={styles.title}>{t.getStarted.title} <br /> {t.getStarted.titleBr}</h1>
          <p className={styles.desc}>
            {t.getStarted.desc}
          </p>
        </motion.header>

        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
        >
          <h2 className={styles.sectionTitle}>{t.getStarted.section1}</h2>
          <p className={styles.text}>
            {t.getStarted.section1Text}
          </p>
          <CodeHighlight 
            code={`npm install pg-smart-search`} 
            language="bash" 
          />
        </motion.section>

        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
        >
          <h2 className={styles.sectionTitle}>{t.getStarted.section2}</h2>
          <p className={styles.text}>
            {t.getStarted.section2Text}
          </p>
          <CodeHighlight 
            filename="search-init.ts"
            code={`import { createSearchClient } from 'pg-smart-search';
import { Pool } from 'pg';

const db = new Pool({ /* ... */ });
const search = createSearchClient(db);

// ${t.getStarted.section2Text.split('.')[0]}
const results = await search.query({
  query: 'smart search',
  limit: 5
});`} 
          />
        </motion.section>

        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
        >
          <h2 className={styles.sectionTitle}>{t.getStarted.section3}</h2>
          <p className={styles.text}>
            {t.getStarted.section3Text}
          </p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>⚡</span>
              <span className={styles.featureName}>{t.getStarted.section3Fts}</span>
              <span className={styles.featureDesc}>{t.getStarted.section3FtsDesc}</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🌊</span>
              <span className={styles.featureName}>{t.getStarted.section3Trigram}</span>
              <span className={styles.featureDesc}>{t.getStarted.section3TrigramDesc}</span>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
        >
          <h2 className={styles.sectionTitle}>{t.getStarted.section4}</h2>
          <p className={styles.text}>
            {t.getStarted.section4Text}
          </p>
          <CodeHighlight 
            filename="abort-signal.ts"
            code={`const controller = new AbortController();

const results = await search.query({
  query: 'fast input',
  signal: controller.signal // Link to app lifecycle
});

// Abort on unmount or new input
controller.abort();`} 
          />
        </motion.section>

        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
        >
          <h2 className={styles.sectionTitle}>{t.getStarted.section5}</h2>
          <p className={styles.text}>
            {t.getStarted.section5Text}
          </p>
          <CodeHighlight 
            code={`// Automatically finds "Ramadan" if "ramadan" (Transliteration)
// or "hfvflfy" (Incorrect layout) is entered`} 
          />
        </motion.section>

        <footer className={styles.footer}>
          PG-SMART-SEARCH ENGINE · OPEN SOURCE · 2026
        </footer>
      </main>
    </div>
  );
}
