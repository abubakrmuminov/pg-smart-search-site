'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '../../context/I18nContext';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, locale, setLocale } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>{t.nav.logo}</span>
        </Link>
        
        <div className={`${styles.links} ${isMenuOpen ? styles.mobileLinksActive : ''}`}>
          <Link href="/#simulator" className={styles.link} onClick={closeMenu}>{t.nav.simulator}</Link>
          <Link href="/#features" className={styles.link} onClick={closeMenu}>{t.nav.features}</Link>
          <Link href="/#sandbox" className={styles.link} onClick={closeMenu}>{t.nav.sandbox}</Link>
          
          <div className={styles.mobileActions}>
            <button 
              className={styles.langToggle}
              onClick={() => setLocale(locale === 'en' ? 'ru' : 'en')}
            >
              {locale.toUpperCase()}
            </button>

            <Link href="/get-started" className={styles.cta} onClick={closeMenu}>{t.common.getStarted}</Link>
          </div>
        </div>

        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </nav>
  );
};
