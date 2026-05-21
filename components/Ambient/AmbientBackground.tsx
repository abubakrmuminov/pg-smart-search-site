import React, { useEffect, useRef } from 'react';
import styles from './AmbientBackground.module.css';

const blobs = [
  { fx: 1, fy: 1.618, rx: 300, ry: 200, period: 40000, color: '34,211,238', op: 0.04 },
  { fx: 2, fy: 1, rx: 400, ry: 300, period: 55000, color: '42,89,255', op: 0.03 },
  { fx: 1, fy: 3, rx: 200, ry: 150, period: 70000, color: '16,185,129', op: 0.03 },
];

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = Date.now();

    let resizeTimeout: NodeJS.Timeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }, 150);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() - startTime;

      blobs.forEach((blob) => {
        const x = Math.sin(t * (2 * Math.PI / blob.period) * blob.fx) * blob.rx + window.innerWidth / 2;
        const y = Math.sin(t * (2 * Math.PI / blob.period) * blob.fy) * blob.ry + window.innerHeight / 2;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.rx * 1.5);
        gradient.addColorStop(0, `rgba(${blob.color}, ${blob.op})`);
        gradient.addColorStop(1, `rgba(${blob.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, blob.rx * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          grid.style.opacity = '0.12';
        } else {
          grid.style.opacity = '0.04';
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.container}>
      <svg ref={gridRef} className={styles.grid} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(42,89,255,0.12)" strokeWidth="0.5" />
          </pattern>
          <pattern id="largeGrid" width="240" height="240" patternUnits="userSpaceOnUse">
            <rect width="240" height="240" fill="url(#smallGrid)" />
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke="rgba(42,89,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#largeGrid)" />
      </svg>
      
      <canvas ref={canvasRef} className={styles.blobs} role="img" aria-label="Ambient background with Lissajous blobs" />
      
      <div className={styles.scanlines} />
      <div className={styles.noise} />

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feBlend mode="screen" in="SourceGraphic" opacity="0.04" />
        </filter>
      </svg>
    </div>
  );
};
