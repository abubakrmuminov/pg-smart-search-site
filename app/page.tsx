'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/UI/Navbar';
import { useI18n } from '../context/I18nContext';
import { AmbientBackground } from '../components/Ambient/AmbientBackground';
import { Hero } from '../components/Hero/Hero';
import { LiveSearchDemo } from '../components/LiveDemo/LiveSearchDemo';
import { PipelineSimulator } from '../components/Simulator/PipelineSimulator';
import { BentoGrid } from '../components/Bento/BentoGrid';
import { PerformanceDashboard } from '../components/Dashboard/PerformanceDashboard';
import { IndexGuide } from '../components/UI/IndexGuide';

const Reveal: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const { t } = useI18n();
  return (
    <main>
        <Navbar />
        <AmbientBackground />

        <Hero />

        {/* ── Live Interactive Demo: type → see pipeline react ── */}
        <Reveal id="demo">
          <LiveSearchDemo />
        </Reveal>

        <Reveal id="simulator">
          <PipelineSimulator />
        </Reveal>

        <Reveal>
          <IndexGuide />
        </Reveal>

        <Reveal id="features">
          <BentoGrid />
        </Reveal>

        <Reveal>
          <PerformanceDashboard />
        </Reveal>

        <footer style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'var(--s-0)'
        }}>
          <p style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em'
          }}>
            {t.footer}
          </p>
        </footer>
    </main>
  );
}
