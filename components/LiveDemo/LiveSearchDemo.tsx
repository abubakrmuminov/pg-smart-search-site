'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch, SimulatorState } from '../../context/SearchContext';
import { useI18n } from '../../context/I18nContext';
import styles from './LiveSearchDemo.module.css';

// ─── Canvas Pipeline ──────────────────────────────────────────────────────────
// Nodes for the "inline" pipeline visualization (horizontal layout)
interface Node { id: string; label: string; xr: number; yr: number; colorRgb: string; }
const NODES: Node[] = [
  { id: 'input',   label: 'INPUT',           xr: 0.08, yr: 0.5,  colorRgb: '34,211,238'  },
  { id: 'fts',     label: 'FTS TURBO ⚡',    xr: 0.42, yr: 0.28, colorRgb: '34,211,238'  },
  { id: 'trigram', label: 'TRIGRAM',          xr: 0.42, yr: 0.72, colorRgb: '42,89,255'   },
  { id: 'output',  label: 'RESULT',           xr: 0.88, yr: 0.5,  colorRgb: '16,185,129'  },
];

type Particle = {
  id: number; path: 'fts' | 'trigram';
  t: number; speed: number;
  aborted: boolean; abortAt: number;
};

function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4); }

function bezier(sx: number, sy: number, ex: number, ey: number, t: number, mid: 'up'|'down') {
  const cy = mid === 'up' ? sy - 60 : sy + 60;
  const cx1 = sx + (ex - sx) * 0.35;
  const cx2 = ex - (ex - sx) * 0.35;
  return {
    x: (1-t)**3*sx + 3*(1-t)**2*t*cx1 + 3*(1-t)*t**2*cx2 + t**3*ex,
    y: (1-t)**3*sy + 3*(1-t)**2*t*(sy+cy)/2 + 3*(1-t)*t**2*(ey+cy)/2 + t**3*ey,
  };
}

const PipelineCanvas: React.FC<{ simState: SimulatorState; ftsLatency: number }> = ({ simState, ftsLatency }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pidRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Spawn particles when search starts
  useEffect(() => {
    if (simState === 'executing') {
      const speed = 1 / (ftsLatency / 16.67);
      particlesRef.current.push(
        { id: pidRef.current++, path:'fts', t:0, speed, aborted:false, abortAt:0.55 },
        { id: pidRef.current++, path:'trigram', t:0, speed: speed * 0.55, aborted:false, abortAt:999 },
      );
    }
    if (simState === 'aborted') {
      particlesRef.current = particlesRef.current.map(p =>
        p.path === 'fts' ? {...p, aborted: true} : p
      );
    }
  }, [simState, ftsLatency]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const parent = canvas.parentElement;
      if (!parent) { rafRef.current = requestAnimationFrame(render); return; }
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const n = (node: Node) => ({ x: node.xr * w, y: node.yr * h });

      // Draw guide tracks
      const drawTrack = (from: Node, to: Node, color: string, dir: 'up'|'down') => {
        ctx.beginPath();
        const f = n(from), t = n(to);
        // Simple cubic bezier through midpoints
        const cpx = (f.x + t.x) / 2;
        ctx.moveTo(f.x, f.y);
        ctx.bezierCurveTo(cpx, f.y, cpx, t.y, t.x, t.y);
        ctx.strokeStyle = `rgba(${color}, 0.12)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      const inputNode = NODES[0], ftsNode = NODES[1], trigramNode = NODES[2], outputNode = NODES[3];
      drawTrack(inputNode, ftsNode, '34,211,238', 'up');
      drawTrack(inputNode, trigramNode, '42,89,255', 'down');
      drawTrack(ftsNode, outputNode, '34,211,238', 'up');
      drawTrack(trigramNode, outputNode, '42,89,255', 'down');

      // Draw nodes
      NODES.forEach(node => {
        const { x, y } = n(node);
        const isActive = simState === 'executing' || simState === 'complete_fts';
        const col = node.colorRgb;

        // Glow ring when active
        if (isActive && (node.id === 'fts' || node.id === 'input')) {
          ctx.beginPath();
          ctx.arc(x, y, 18, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${col}, 0.06)`;
          ctx.fill();
        }

        // Win glow on output
        if (simState === 'complete_fts' && node.id === 'output') {
          ctx.beginPath();
          ctx.arc(x, y, 22, 0, Math.PI*2);
          ctx.fillStyle = `rgba(16,185,129, 0.12)`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${col}, ${simState === 'idle' ? 0.15 : 0.9})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${col}, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.font = `500 9px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(255,255,255, 0.45)`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, x, y + 21);
      });

      // Advance & draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.t = Math.min(p.t + p.speed, 1);

        const fromNode = p.path === 'fts' ? inputNode : inputNode;
        const toNode   = p.path === 'fts' ? ftsNode   : trigramNode;
        const col     = p.path === 'fts' ? '34,211,238' : '42,89,255';
        const dir     = p.path === 'fts' ? 'up' : 'down';

        const easedT = easeOutQuart(p.t);
        const fn = n(fromNode), tn = n(toNode);
        const cpx = (fn.x + tn.x) / 2;
        const px = (1-easedT)**3*fn.x + 3*(1-easedT)**2*easedT*cpx + 3*(1-easedT)*easedT**2*cpx + easedT**3*tn.x;
        const py = (1-easedT)**3*fn.y + 3*(1-easedT)**2*easedT*fn.y + 3*(1-easedT)*easedT**2*tn.y + easedT**3*tn.y;

        if (p.aborted && p.t > 0.45) {
          // Flash violet
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI*2);
          ctx.fillStyle = `rgba(124,58,237, ${1 - (p.t - 0.45) * 2})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#7c3aed';
          ctx.fill();
          ctx.shadowBlur = 0;
          return p.t < 0.8;
        }

        // Glow trail
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${col}, 0.9)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgb(${col})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        return p.t < 1;
      });

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [simState]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.pipelineCanvas}
      role="img"
      aria-label="Live search pipeline visualization"
    />
  );
};

// ─── Status Label ─────────────────────────────────────────────────────────────
const STATUS_MAP = (t: any): Record<SimulatorState, { label: string; color: string }> => ({
  idle:             { label: t.liveDemo.statusReady,                color: 'rgba(255,255,255,0.25)' },
  typing:           { label: t.liveDemo.statusTokenizing,    color: '#22d3ee' },
  executing:        { label: t.liveDemo.statusRouting, color: '#22d3ee' },
  complete_fts:     { label: t.liveDemo.statusFtsHit, color: '#10b981' },
  complete_trigram: { label: t.liveDemo.statusFallback, color: '#2a59ff' },
  aborted:          { label: t.liveDemo.statusAborted, color: '#7c3aed' },
});

// ─── Results Feed ─────────────────────────────────────────────────────────────
const MOCK_RESULTS = [
  { id: 1, text: 'Parallel Search Strategy', rank: 0.99, engine: 'FTS' },
  { id: 2, text: 'AbortSignal Orchestration', rank: 0.97, engine: 'FTS' },
  { id: 3, text: 'Trigram Similarity Score',  rank: 0.91, engine: 'FTS' },
  { id: 4, text: 'Zombie Query Prevention',   rank: 0.88, engine: 'FTS' },
];

// ─── Trace Panel ─────────────────────────────────────────────────────────────
const TracePanel: React.FC<{ query: string; state: SimulatorState; forceFail: boolean }> = ({ query, state, forceFail }) => {
  const { t } = useI18n();
  
  const trace = useMemo(() => {
    if (!query || state === 'idle') return null;
    
    // Mocking SDK logic
    const sanitized = query.replace(/[;'"\\]/g, '').substring(0, 64);
    const hasCyrillic = /[а-яА-Я]/.test(query);
    const translit = hasCyrillic ? 'N/A' : (query.includes('ghbdtn') ? 'привет' : 'N/A');
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    
    return { sanitized, translit, tokens };
  }, [query, state]);

  if (!trace || state === 'idle') return null;

  return (
    <motion.div 
      className={styles.traceContainer}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className={styles.traceHeader}>
        <span className={styles.traceTitle}>{t.liveDemo.traceTitle || 'TECHNICAL TRACE'}</span>
        <span className={styles.traceCode}>[HASH: 0x82FA]</span>
      </div>
      
      <div className={styles.traceGrid}>
        <div className={styles.traceItem}>
          <span className={styles.traceLabel}>SANITIZER</span>
          <span className={styles.traceVal}>{trace.sanitized || 'EMPTY'}</span>
        </div>
        <div className={styles.traceItem}>
          <span className={styles.traceLabel}>TRANSLIT</span>
          <span className={styles.traceVal} style={{ color: trace.translit !== 'N/A' ? '#10b981' : 'inherit' }}>
            {trace.translit}
          </span>
        </div>
        <div className={styles.traceItem}>
          <span className={styles.traceLabel}>TOKENS</span>
          <div className={styles.tokenList}>
            {trace.tokens.map((tk: string, i: number) => (
              <span key={i} className={styles.token}>{tk}</span>
            ))}
            {trace.tokens.length === 0 && <span className={styles.traceVal}>NONE</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const LiveSearchDemo: React.FC = () => {
  const { t } = useI18n();
  const { query, setQuery, state, setState, ftsLatency, setFtsLatency, forceFail, setForceFail, triggerSearch } = useSearch();
  const [results, setResults] = useState<typeof MOCK_RESULTS>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing → "warming" state
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setState('typing');
    } else {
      setState('idle');
    }
  };

  const handleExecute = useCallback(() => {
    if (!query.trim()) return;
    setResults([]);
    setIsStreaming(true);
    triggerSearch();

    // Snapshot allItems at call-time so the interval closure is stable
    const snapshot = forceFail
      ? []
      : MOCK_RESULTS.filter(r =>
          r.text.toLowerCase().includes(query.toLowerCase().split(' ')[0])
        );
    const allItems = snapshot.length ? snapshot : MOCK_RESULTS.slice(0, 3);
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < allItems.length) {
        const item = allItems[idx];
        if (item) setResults(prev => [...prev, item]);
        idx++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 120);
  }, [query, triggerSearch, forceFail]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleExecute();
  };

  const statusMap = STATUS_MAP(t);
  const { label: statusLabel, color: statusColor } = statusMap[state];

  return (
    <section className={styles.section}>
      {/* Background Pipeline Canvas */}
      <div className={styles.canvasLayer}>
        <PipelineCanvas simState={state} ftsLatency={ftsLatency} />
        {/* Dim overlay so text is readable */}
        <div className={styles.canvasOverlay} />
      </div>

      {/* Foreground UI */}
      <div className={styles.ui}>
        {/* Status badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            className={styles.statusBadge}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            style={{ color: statusColor, borderColor: statusColor }}
          >
            <span className={styles.statusDot} style={{ background: statusColor }} />
            {statusLabel}
          </motion.div>
        </AnimatePresence>

        {/* Query Input */}
        <div className={styles.inputWrapper}>
          <span className={styles.inputPrefix}>$</span>
          <input
            ref={inputRef}
            className={styles.queryInput}
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t.liveDemo.placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search query input"
          />
          <button
            className={`${styles.execBtn} ${state === 'executing' || isStreaming ? styles.execBtnRunning : ''}`}
            onClick={handleExecute}
            disabled={state === 'executing' || !query.trim()}
            aria-label="Execute search query"
          >
            {state === 'executing' ? (
              <span className={styles.spinner} />
            ) : (
              <span>EXECUTE</span>
            )}
          </button>
        </div>

        {/* Options row */}
        <div className={styles.optionsRow}>
          <label className={styles.option}>
            <input
              type="checkbox"
              checked={forceFail}
              onChange={e => setForceFail(e.target.checked)}
            />
            {t.liveDemo.abortLabel}
          </label>
          <label className={styles.option}>
            {t.liveDemo.latencyLabel}
            <input
              type="range"
              min="20"
              max="600"
              value={ftsLatency}
              onChange={e => setFtsLatency(Number(e.target.value))}
              className={styles.sliderInline}
            />
            <span className={styles.sliderVal}>{ftsLatency}ms</span>
          </label>
        </div>

        {/* Results stream */}
        <div className={styles.results} aria-live="polite" aria-label="Search results">
          <AnimatePresence>
            {results.filter(Boolean).map((r, i) => (
              <motion.div
                key={r.id ?? i}
                className={styles.resultRow}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <span className={styles.rEngine}>{r.engine ?? 'FTS'}</span>
                <span className={styles.rText}>{r.text ?? ''}</span>
                <span className={styles.rRank}>{typeof r.rank === 'number' ? r.rank.toFixed(2) : ''}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {state === 'aborted' && (
            <motion.p
              className={styles.abortMsg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t.liveDemo.abortMsg}
            </motion.p>
          )}
          {results.length === 0 && state === 'idle' && !isStreaming && (
            <p className={styles.placeholder}>
              {t.liveDemo.resultsPlaceholder}
            </p>
          )}
        </div>

        {/* Technical Trace Panel */}
        <AnimatePresence>
          <TracePanel query={query} state={state} forceFail={forceFail} />
        </AnimatePresence>
      </div>
    </section>
  );
};
