import { loc } from '../shared/site';
import { Reveal, RevealGroup, scatter } from '../shared/Reveal';

const LEVEL_STYLE = {
  advanced: 'border-blue-500/50 text-blue-400',
  intermediate: 'border-purple-500/50 text-purple-400',
  basic: 'border-slate-600 text-slate-400',
};
const LEVELS = ['advanced', 'intermediate', 'basic'];
const DOTS = { advanced: 3, intermediate: 2, basic: 1 };

export default function Skills({ skills, lang, labels, uses, selected, onSelect, onGoTo }) {
  const current = selected ? skills.find((s) => s.id === selected) : null;
  const found = selected ? uses[selected] : null;

  return (
    <div>
      <Reveal variant="up" as="p" className="text-center text-sm text-slate-400 -mt-6 mb-10">
        <i className="fa-solid fa-hand-pointer mr-2 text-blue-400" aria-hidden="true" />
        {labels.hint}
      </Reveal>
      <div className="space-y-8">
        {LEVELS.map((level) => (
          <div key={level}>
            <Reveal variant="left" as="h3" className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
              <span className="level-dots" aria-hidden="true">
                {[1, 2, 3].map((n) => <i key={n} className={n <= DOTS[level] ? 'on' : ''} />)}
              </span>
              {labels.levels[level]}
            </Reveal>
            {/* Навыки «слетаются» из хаоса в ровный ряд */}
            <RevealGroup step={55} className="flex flex-wrap gap-3">
              {skills.filter((s) => s.level === level).map((s, i) => {
                const count = (uses[s.id]?.jobs.length || 0) + (uses[s.id]?.projects.length || 0);
                const active = selected === s.id;
                return (
                  <span key={s.id} className="rv-item rv-scatter inline-flex" style={scatter(i + DOTS[level] * 7)}>
                    <button
                      type="button"
                      onClick={() => onSelect(active ? null : s.id)}
                      aria-pressed={active}
                      className={`skill-chip px-4 py-2 rounded-lg text-sm font-medium border backdrop-blur-sm bg-slate-800/30 shadow-sm flex items-center gap-2 ${LEVEL_STYLE[level]} ${active ? 'skill-chip-active' : ''} ${selected && !active ? 'opacity-50 hover:opacity-100' : ''}`}
                    >
                      {loc(s.name, lang)}
                      {count > 0 && (
                        <span className="skill-count text-[10px] font-bold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center">{count}</span>
                      )}
                    </button>
                  </span>
                );
              })}
            </RevealGroup>
          </div>
        ))}
      </div>

      <div className={`skill-panel mt-8 rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5 transition-all duration-300 ${current ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 p-0 mt-0 border-0 overflow-hidden'}`} aria-live="polite">
        {current && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h4 className="font-bold text-white">
                {loc(current.name, lang)} — <span className="text-slate-400 font-medium">{labels.usedIn}</span>
              </h4>
              <button type="button" onClick={() => onSelect(null)} className="text-sm text-blue-400 hover:text-blue-300 font-semibold">
                <i className="fa-solid fa-rotate-left mr-1.5" aria-hidden="true" />
                {labels.reset}
              </button>
            </div>
            {found && found.jobs.length + found.projects.length > 0 ? (
              <RevealGroup key={current.id} step={70} className="flex flex-wrap gap-2">
                {found.jobs.map((j, i) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => onGoTo('job', j.id)}
                    style={{ '--i': i }}
                    className="rv-item rv-pop text-left text-sm px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-blue-500/60"
                  >
                    <i className="fa-solid fa-briefcase text-blue-400 mr-2" aria-hidden="true" />
                    <span className="text-white font-medium">{loc(j.company, lang)}</span>
                    <span className="text-slate-500"> · {loc(j.role, lang)}</span>
                  </button>
                ))}
                {found.projects.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onGoTo('project', p.id)}
                    style={{ '--i': found.jobs.length + i }}
                    className="rv-item rv-pop text-left text-sm px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-blue-500/60"
                  >
                    <i className={`fa-solid ${p.icon} text-cyan-400 mr-2`} aria-hidden="true" />
                    <span className="text-white font-medium">{loc(p.title, lang)}</span>
                    <span className="text-slate-500"> · {labels.projectLabel}</span>
                  </button>
                ))}
              </RevealGroup>
            ) : (
              <p className="text-sm text-slate-400">{labels.noUses}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
