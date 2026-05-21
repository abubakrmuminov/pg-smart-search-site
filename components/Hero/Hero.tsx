'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from '../../context/I18nContext';
import styles from './Hero.module.css';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  href?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, variant = 'primary', href }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (e.clientX - centerX) * 0.25;
    const y = (e.clientY - centerY) * 0.25;
    
    // Max 10px vector
    const dist = Math.sqrt(x * x + y * y);
    const limit = 10;
    if (dist > limit) {
      const angle = Math.atan2(y, x);
      setPosition({ x: Math.cos(angle) * limit, y: Math.sin(angle) * limit });
    } else {
      setPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const ButtonContent = (
    <motion.button
      ref={btnRef}
      className={`${styles.button} ${styles[variant]} ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.buttonContent}>{children}</span>
    </motion.button>
  );

  if (href) {
    return <Link href={href}>{ButtonContent}</Link>;
  }

  return ButtonContent;
};

const Typewriter: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < text.length) {
          setDisplayedText(text.substring(0, currentIdx + 1));
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 28);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export const Hero: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.content}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        <motion.span
          className={styles.eyebrow}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {t.hero.eyebrow}
        </motion.span>

        <motion.h1
          className={styles.headline}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {t.hero.headline} <br />
          <span className={styles.shimmer}>{t.hero.shimmer}</span>
        </motion.h1>

        <motion.p
          className={styles.subheadline}
          key={t.hero.subheadline} // Key forces re-mount of typewriter on lang change
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          <Typewriter 
            text={t.hero.subheadline} 
            delay={200} 
          />
        </motion.p>

        <motion.div
          className={styles.actions}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ delay: 0.6 }}
        >
          <MagneticButton href="/get-started">{t.common.getStarted}</MagneticButton>
          <MagneticButton variant="secondary" href="https://github.com/abubakrmuminov/pg-smart-search">{t.common.github}</MagneticButton>
        </motion.div>

        <motion.div
          className={styles.stats}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          transition={{ delay: 0.9 }}
        >
          <div className={styles.statItem}>
            <span className={styles.statValue}>&lt;40ms</span>
            <span className={styles.statLabel}>{t.hero.p99}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>{t.hero.typeSafety}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>847</span>
            <span className={styles.statLabel}>{t.hero.avgQps}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
