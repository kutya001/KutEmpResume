import { useEffect, useMemo, useState } from 'react';
import { useInView, useReducedMotion } from '../shared/hooks';

/*
 * Мини-терминал: печатает SQL-запрос к «базе карьеры» и показывает результат.
 * Данные берутся из career.json, поэтому ответ всегда актуален.
 */
const KEYWORDS = /^(SELECT|FROM|WHERE|IS|NULL|AND|AS|STRING_AGG|ORDER|BY|COUNT|LIMIT|TOP)$/;

function tokenize(sql) {
  const parts = sql.match(/'[^']*'|\w+|\s+|[^\w\s]/g) || [];
  return parts.map((text) => ({
    text,
    cls: text.startsWith("'") ? 'sql-str' : KEYWORDS.test(text) ? 'sql-kw' : /^[(),;=*]$/.test(text) ? 'sql-punct' : '',
  }));
}

function TypedSql({ tokens, count }) {
  let left = count;
  return tokens.map((t, i) => {
    if (left <= 0) return null;
    const piece = t.text.slice(0, left);
    left -= t.text.length;
    return t.cls ? <span key={i} className={t.cls}>{piece}</span> : <span key={i}>{piece}</span>;
  });
}

export default function SqlTerminal({ queries, title, rowsLabel }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.2, once: false });
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState('typing'); // typing → result → next

  const q = queries[qi % queries.length];
  const tokens = useMemo(() => tokenize(q.sql), [q.sql]);
  const total = q.sql.length;

  useEffect(() => {
    if (reduced) {
      setTyped(total);
      setPhase('result');
    }
  }, [reduced, total]);

  useEffect(() => {
    if (reduced || !inView) return undefined;
    let timer;
    if (phase === 'typing') {
      if (typed < total) {
        const ch = q.sql[typed];
        timer = setTimeout(() => setTyped((n) => n + 1), ch === '\n' ? 220 : 28 + Math.random() * 40);
      } else {
        timer = setTimeout(() => setPhase('result'), 380);
      }
    } else if (phase === 'result') {
      timer = setTimeout(() => setPhase('next'), 4200);
    } else {
      timer = setTimeout(() => {
        setQi((i) => (i + 1) % queries.length);
        setTyped(0);
        setPhase('typing');
      }, 250);
    }
    return () => clearTimeout(timer);
  }, [phase, typed, total, inView, reduced, q.sql, queries.length]);

  return (
    <div ref={ref} className="sql-terminal w-full max-w-2xl text-left rounded-xl backdrop-blur-md shadow-2xl overflow-hidden">
      <div className="sql-head flex items-center gap-2 px-4 py-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
        <span className="sql-title ml-2 text-[11px] font-mono truncate">{title}</span>
      </div>
      <div className="px-4 py-3 font-mono text-[12px] sm:text-[13px] leading-relaxed min-h-[13.5rem] sm:min-h-[12.5rem]" aria-live="off">
        <div className="sql-code whitespace-pre-wrap break-words">
          <span className="sql-prompt select-none">SQL&gt; </span>
          <TypedSql tokens={tokens} count={typed} />
          {phase === 'typing' && <span className="sql-caret" aria-hidden="true" />}
        </div>
        <div className={`mt-3 transition-opacity duration-300 ${phase !== 'typing' ? 'opacity-100' : 'opacity-0'}`}>
          {phase !== 'typing' && (
            <div className="overflow-x-auto">
              <table className="sql-result text-[11.5px] sm:text-[12.5px]">
                <thead>
                  <tr>{q.columns.map((c) => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {q.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              <div className="sql-meta text-[11px] mt-1.5">{rowsLabel}</div>
            </div>
          )}
        </div>
      </div>
      <span className="sr-only">{queries.map((x) => x.rows.map((r) => r.join(', ')).join('; ')).join(' | ')}</span>
    </div>
  );
}
