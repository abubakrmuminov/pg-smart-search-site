'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../context/I18nContext';
import styles from './PipelineSimulator.module.css';

type NodeStatus = 'idle' | 'processing' | 'success' | 'empty' | 'aborted';

interface NodeDef {
  id: string;
  type: 'rect' | 'diamond' | 'terminator';
  label: string;
  x: number; // percentage (desktop)
  y: number; // percentage (desktop)
  mx?: number; // percentage (mobile)
  my?: number; // percentage (mobile)
}

interface Connection {
  from: string;
  to: string;
}

export const PipelineSimulator: React.FC = () => {
  const { t } = useI18n();
  const [isRunning, setIsRunning] = useState(false);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
  const [activePaths, setActivePaths] = useState<string[]>([]);
  const [currentScenario, setCurrentScenario] = useState<'success' | 'wait' | 'fallback'>('success');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nodes: NodeDef[] = useMemo(() => [
    { id: 'start', type: 'terminator', label: t.simulator.userRequest, x: 80, y: 10, mx: 50, my: 4 },
    { id: 'handler', type: 'rect', label: t.simulator.handler, x: 80, y: 22, mx: 50, my: 10 },
    { id: 'norm', type: 'rect', label: t.simulator.norm, x: 80, y: 34, mx: 50, my: 16 },
    { id: 'parallel', type: 'diamond', label: t.simulator.parallel, x: 80, y: 50, mx: 50, my: 24 },
    { id: 'branchA', type: 'rect', label: t.simulator.branchA, x: 60, y: 65, mx: 30, my: 32 },
    { id: 'branchB', type: 'rect', label: t.simulator.branchB, x: 90, y: 65, mx: 70, my: 32 },
    { id: 'priority', type: 'diamond', label: t.simulator.priorityCheck, x: 35, y: 20, mx: 30, my: 42 },
    { id: 'yesResults', type: 'rect', label: t.simulator.yesResults, x: 15, y: 20, mx: 15, my: 50 },
    { id: 'abortB', type: 'rect', label: t.simulator.abortB, x: 15, y: 40, mx: 15, my: 58 },
    { id: 'waitB', type: 'diamond', label: t.simulator.waitB, x: 35, y: 40, mx: 50, my: 50 },
    { id: 'resFound', type: 'diamond', label: t.simulator.resultsFound, x: 35, y: 60, mx: 50, my: 58 },
    { id: 'fallback', type: 'rect', label: t.simulator.fuzzyFallback, x: 55, y: 75, mx: 75, my: 61 },
    { id: 'hasResults', type: 'diamond', label: t.simulator.hasResults, x: 35, y: 75, mx: 50, my: 66 },
    { id: 'autoLayout', type: 'rect', label: t.simulator.autoLayout, x: 15, y: 75, mx: 35, my: 74 },
    { id: 'final', type: 'terminator', label: t.simulator.finalResult, x: 15, y: 92, mx: 50, my: 92 },
  ], [t]);

  const connections: Connection[] = [
    { from: 'start', to: 'handler' },
    { from: 'handler', to: 'norm' },
    { from: 'norm', to: 'parallel' },
    { from: 'parallel', to: 'branchA' },
    { from: 'parallel', to: 'branchB' },
    { from: 'branchA', to: 'priority' },
    { from: 'priority', to: 'yesResults' },
    { from: 'priority', to: 'waitB' },
    { from: 'yesResults', to: 'abortB' },
    { from: 'yesResults', to: 'final' },
    { from: 'waitB', to: 'resFound' },
    { from: 'resFound', to: 'final' },
    { from: 'resFound', to: 'fallback' },
    { from: 'fallback', to: 'hasResults' },
    { from: 'hasResults', to: 'final' },
    { from: 'hasResults', to: 'autoLayout' },
    { from: 'autoLayout', to: 'final' },
    { from: 'branchB', to: 'priority' }, // Real logic: Priority check considers both
  ];

  const updateStatus = (id: string, status: NodeStatus) => {
    setNodeStatuses(prev => ({ ...prev, [id]: status }));
  };

  const activatePath = (from: string, to: string) => {
    setActivePaths(prev => [...prev, `${from}->${to}`]);
  };

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setNodeStatuses({});
    setActivePaths([]);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // Step 1: Pre-processing
      updateStatus('start', 'processing');
      await sleep(600);
      activatePath('start', 'handler');
      updateStatus('start', 'success');
      updateStatus('handler', 'processing');
      await sleep(600);
      activatePath('handler', 'norm');
      updateStatus('handler', 'success');
      updateStatus('norm', 'processing');
      await sleep(600);
      activatePath('norm', 'parallel');
      updateStatus('norm', 'success');
      updateStatus('parallel', 'processing');
      await sleep(800);

      // Step 2: CONCURRENT START
      activatePath('parallel', 'branchA');
      activatePath('parallel', 'branchB');
      updateStatus('parallel', 'success');
      updateStatus('branchA', 'processing');
      updateStatus('branchB', 'processing');
      await sleep(1000);

      // Branch A finishes first (Turbo)
      activatePath('branchA', 'priority');
      updateStatus('branchA', 'success');
      updateStatus('priority', 'processing');
      await sleep(800);

      if (currentScenario === 'success') {
        // SCENARIO 1: FTS WINS
        updateStatus('priority', 'success');
        activatePath('priority', 'yesResults');
        updateStatus('yesResults', 'success');
        
        // KILL BRANCH B
        updateStatus('branchB', 'aborted');
        activatePath('yesResults', 'abortB');
        updateStatus('abortB', 'aborted');
        await sleep(800);
        
        activatePath('yesResults', 'final');
        updateStatus('final', 'success');
      } else {
        // SCENARIOS 2 & 3: FTS EMPTY
        updateStatus('priority', 'empty');
        activatePath('priority', 'waitB');
        updateStatus('waitB', 'processing');
        await sleep(400); // FTS is empty, wait for B to finish
        
        updateStatus('branchB', 'success');
        activatePath('branchB', 'priority');
        await sleep(400);
        
        activatePath('waitB', 'resFound');
        updateStatus('waitB', 'success');
        updateStatus('resFound', 'processing');
        await sleep(800);

        if (currentScenario === 'wait') {
          // SCENARIO 2: TRIGRAM FOUND
          updateStatus('resFound', 'success');
          activatePath('resFound', 'final');
          updateStatus('final', 'success');
        } else {
          // SCENARIO 3: BOTH EMPTY -> FALLBACK
          updateStatus('resFound', 'empty');
          activatePath('resFound', 'fallback');
          updateStatus('fallback', 'processing');
          await sleep(1000);
          
          updateStatus('fallback', 'success');
          activatePath('fallback', 'hasResults');
          updateStatus('hasResults', 'processing');
          await sleep(800);
          
          updateStatus('hasResults', 'success');
          activatePath('hasResults', 'autoLayout');
          updateStatus('autoLayout', 'success');
          activatePath('autoLayout', 'final');
          updateStatus('final', 'success');
        }
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className={styles.simulatorContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.simulator.title}</h2>
        <div className={styles.legend}>
            <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{color: 'var(--c-turbo)'}}></div>
                <span>CONCURRENT</span>
            </div>
            <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{color: 'var(--c-emerald)'}}></div>
                <span>RESOLVED</span>
            </div>
            <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{color: 'var(--c-violet)'}}></div>
                <span>ABORTED</span>
            </div>
        </div>
      </div>

      <div className={styles.flowWrapper}>
        <svg className={styles.svgLayer} viewBox="0 0 100 100" preserveAspectRatio="none">
          {connections.map(conn => {
            const from = nodes.find(n => n.id === conn.from);
            const to = nodes.find(n => n.id === conn.to);
            if (!from || !to) return null;
            
            const isActive = activePaths.includes(`${conn.from}->${conn.to}`);
            const fromStatus = nodeStatuses[conn.from];
            const toStatus = nodeStatuses[conn.to];
            
            let lineClass = styles.connector;
            if (isActive) lineClass += ` ${styles.connectorActive}`;
            if (fromStatus === 'success' && toStatus === 'success') lineClass += ` ${styles.connectorSuccess}`;
            if (fromStatus === 'aborted' || toStatus === 'aborted') lineClass += ` ${styles.connectorAborted}`;

            const getX = (n: NodeDef) => (isMobile ? (n.mx ?? n.x) : n.x);
            const getY = (n: NodeDef) => (isMobile ? (n.my ?? n.y) : n.y);

            const fx = getX(from);
            const fy = getY(from);
            const tx = getX(to);
            const ty = getY(to);

            // Simple Bezier for vertical-ish flow
            const path = `M${fx} ${fy}C${fx} ${(fy + ty) / 2},${tx} ${(fy + ty) / 2},${tx} ${ty}`;

            return (
              <g key={`${conn.from}-${conn.to}`}>
                <path
                  d={path}
                  className={lineClass}
                  fill="none"
                />

                {isActive && (
                  <ellipse 
                    rx={isMobile ? 0.3 : 0.7} 
                    ry={isMobile ? 0.1 : 0.7} 
                    className={styles.pulse} 
                    fill="currentColor"
                  >
                    <animateMotion
                      dur="1.6s"
                      repeatCount="indefinite"
                      path={path}
                    />
                  </ellipse>
                )}
              </g>
            );
          })}
        </svg>

        <div className={styles.nodesLayer}>
          {nodes.map(node => {
            const status = nodeStatuses[node.id] || 'idle';
            const nx = isMobile ? (node.mx ?? node.x) : node.x;
            const ny = isMobile ? (node.my ?? node.y) : node.y;

            return (
              <div 
                key={node.id} 
                className={`${styles.node} ${styles[node.type]} ${styles[`node${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}
                style={{ left: `${nx}%`, top: `${ny}%` }}
              >
                <div className={styles.nodeGlow}></div>

  <div className={styles.nodeInner}>
    <span className={styles.nodeTitle}>
      {node.label}
    </span>

    <span className={styles.nodeState}>
      {status.toUpperCase()}
    </span>
  </div>
</div>
            );
          })}
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.scenarioPills}>
          {([ 
            { key: 'success', label: 'FTS TURBO', sub: 'B ABORTED' },
            { key: 'wait',    label: 'TRIGRAM WAIT', sub: 'FTS EMPTY' },
            { key: 'fallback',label: 'DUAL FALLBACK', sub: 'FUZZY ON' },
          ] as const).map(({ key, label, sub }) => (
            <button
              key={key}
              onClick={() => !isRunning && setCurrentScenario(key)}
              disabled={isRunning}
              className={`${styles.scenarioPill} ${currentScenario === key ? styles.scenarioPillActive : ''}`}
            >
              <span className={styles.pillLabel}>{label}</span>
              <span className={styles.pillSub}>{sub}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={runSimulation} 
          disabled={isRunning} 
          className={styles.searchBtn}
        >
          {isRunning ? '...' : t.simulator.btnQuery}
        </button>
      </div>
    </div>
  );
};
