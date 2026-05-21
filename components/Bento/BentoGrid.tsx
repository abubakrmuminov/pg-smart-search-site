'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useI18n } from '../../context/I18nContext';
import styles from './BentoGrid.module.css';

interface CardProps {
  title: string;
  description: string;
  size?: 'small' | 'large' | 'tall';
  color?: string;
  children?: React.ReactNode;
}

const BentoCard: React.FC<CardProps> = ({ title, description, size = 'small', color = 'turbo', children }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-4deg', '4deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${styles[size]} ${styles[color]}`}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.borderBeam} />
      
      <div className={styles.cardInner} style={{ transform: 'translateZ(20px)' }}>
        <div className={styles.header}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDescription}>{description}</p>
        </div>
        
        <div className={styles.visualPlaceholder}>
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const BentoGrid: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className={styles.bentoSection}>
      <div className={styles.gridContainer}>
        {/* Card 1: Параллельное выполнение */}
        <BentoCard 
          title={t.bento.parallelTitle} 
          description={t.bento.parallelDesc}
          size="large"
          color="turbo"
        >
          <div className={styles.parallelViz}>
             <div className={styles.barLine} />
             <div className={styles.barLine} style={{ animationDelay: '0.2s' }} />
             <div className={styles.barLine} style={{ animationDelay: '0.4s' }} />
          </div>
        </BentoCard>

        {/* Card 2: AbortSignal Race */}
        <BentoCard 
          title={t.bento.zombieTitle} 
          description={t.bento.zombieDesc}
          size="tall"
          color="violet"
        >
          <div className={styles.abortViz}>
             <div className={styles.ring} />
             <div className={styles.ring} style={{ width: '40px', height: '40px', opacity: 0.3 }} />
          </div>
        </BentoCard>

        {/* Card 3: Zero Cold Start */}
        <BentoCard 
          title={t.bento.coldStartTitle} 
          description={t.bento.coldStartDesc}
          size="small"
          color="emerald"
        >
             <div className={styles.uptime}>100%</div>
        </BentoCard>

        {/* Card 4: Dedup Engine */}
        <BentoCard 
          title={t.bento.dedupTitle} 
          description={t.bento.dedupDesc}
          size="small"
          color="cobalt"
        >
             <div className={styles.dedupBar}>
               <div className={styles.dedupProgress} />
             </div>
        </BentoCard>

        {/* Card 5: Type-Safe API */}
        <BentoCard 
          title={t.bento.typeSafeTitle} 
          description={t.bento.typeSafeDesc}
          size="large"
          color="turbo"
        >
           <pre className={styles.codeSnippet}>
             <code>{`search<User>(db, query)`}</code>
           </pre>
        </BentoCard>

        {/* Card 6: p99 <40ms */}
        <BentoCard 
          title={t.bento.p99Title} 
          description={t.bento.p99Desc}
          size="small"
          color="turbo"
        >
             <div className={styles.metricPulse} />
        </BentoCard>
      </div>
    </section>
  );
};
