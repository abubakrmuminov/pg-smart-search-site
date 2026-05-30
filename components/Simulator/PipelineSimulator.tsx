'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../context/I18nContext';
import styles from './PipelineSimulator.module.css';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'system';
}

export const PipelineSimulator: React.FC = () => {
  const { t } = useI18n();
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [scenario, setScenario] = useState<'success' | 'wait' | 'fallback'>('success');
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
    setLogs(prev => [...prev, entry]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      addLog('INITIALIZING SEARCH_PIPELINE_ENGINE v1.3.0...', 'system');
      await sleep(600);
      
      addLog(`[INCOMING] ${t.simulator.userRequest}`, 'info');
      await sleep(400);
      
      addLog(`[PIPELINE] ${t.simulator.handler} -> VALIDATING SCHEMA`, 'info');
      await sleep(500);
      
      addLog(`[ASSEMBLY] ${t.simulator.norm} -> APPLYING TRANSFORMATION`, 'info');
      await sleep(600);
      
      addLog(`[STRATEGY] ${t.simulator.parallel} -> STARTING CONCURRENT BRANCHES`, 'warn');
      await sleep(400);
      
      addLog(`-> SPAWNING ${t.simulator.branchA}`, 'system');
      addLog(`-> SPAWNING ${t.simulator.branchB}`, 'system');
      await sleep(1000);
      
      addLog(`[RESULT] ${t.simulator.branchA} COMPLETE`, 'success');
      addLog(`[ORCHESTRATOR] ${t.simulator.priorityCheck}`, 'info');
      await sleep(600);

      if (scenario === 'success') {
        addLog(`[DEBUG] ${t.simulator.yesResults} -> ${t.liveDemo.statusFtsHit}`, 'success');
        addLog(`[TERMINAL] ${t.simulator.abortB} -> SENDING SIGTERM`, 'error');
        await sleep(500);
        addLog(`[PIPELINE] ${t.simulator.finalResult} READY`, 'success');
      } else {
        addLog(`[DEBUG] ${t.simulator.branchA} -> ${t.simulator.noEmpty}`, 'warn');
        addLog(`[ORCHESTRATOR] ${t.simulator.waitB}`, 'info');
        await sleep(800);
        
        addLog(`[RESULT] ${t.simulator.branchB} COMPLETE`, 'success');
        addLog(`[DEBUG] ${t.simulator.resultsFound}`, 'info');
        await sleep(400);

        if (scenario === 'wait') {
          addLog(`[PIPELINE] ENGINE_RESOLUTION -> TRIGRAM_STRATEGY`, 'success');
          addLog(`[PIPELINE] ${t.simulator.finalResult} READY`, 'success');
        } else {
          addLog(`[WARN] ${t.simulator.resultsFound} -> 0 matches`, 'error');
          addLog(`[FALLBACK] ${t.simulator.fuzzyFallback} -> TRIGGERING FUZZY_V3`, 'warn');
          await sleep(1000);
          
          addLog(`[DEBUG] ${t.simulator.hasResults} -> DYNAMIC_SIMILARITY applied`, 'success');
          addLog(`[POST] ${t.simulator.autoLayout} -> FIXING KEYBOARD_LAYOUT`, 'info');
          await sleep(600);
          addLog(`[PIPELINE] ${t.simulator.finalResult} READY`, 'success');
        }
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h2 className={styles.title}>{t.simulator.title}</h2>
          <div className={styles.statusBadge}>
            <span className={styles.dot} />
            NODE_01: ONLINE
          </div>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.runBtn} 
            onClick={runSimulation}
            disabled={isRunning}
          >
            {isRunning ? 'EXECUTING...' : t.simulator.btnQuery}
          </button>
        </div>
      </div>

      <div className={styles.terminal} ref={scrollRef}>
        <div className={styles.terminalHeader}>
          <div className={styles.dots}>
            <span style={{ background: '#ff5f56' }} />
            <span style={{ background: '#ffbd2e' }} />
            <span style={{ background: '#27c93f' }} />
          </div>
          <div className={styles.terminalTitle}>pg-smart-search@bash — 80x24</div>
        </div>
        
        <div className={styles.terminalBody}>
          {logs.length === 0 && !isRunning && (
            <div className={styles.placeholder}>
              System ready. Click "{t.simulator.btnQuery}" to start pipeline trace...
            </div>
          )}
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${styles.logEntry} ${styles[log.type]}`}
              >
                <span className={styles.timestamp}>[{log.timestamp}]</span>
                <span className={styles.message}>{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {isRunning && (
            <motion.div 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className={styles.cursor}
            >
              _
            </motion.div>
          )}
        </div>
      </div>

      <div className={styles.scenarios}>
        <span className={styles.scenarioLabel}>PIPELINE_MODE:</span>
        <div className={styles.scenarioPills}>
          {(['success', 'wait', 'fallback'] as const).map((s) => (
            <button
              key={s}
              className={`${styles.scenarioPill} ${scenario === s ? styles.active : ''}`}
              onClick={() => setScenario(s)}
              disabled={isRunning}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
