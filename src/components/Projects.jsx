import TiltCard from './TiltCard';
import MiniFlow from '../shared/MiniFlow';
import { RevealGroup } from '../shared/Reveal';
import { loc, IS_PREVIEW } from '../shared/site';

export default function Projects({ items, lang, labels, skillName, highlight }) {
  return (
    <RevealGroup step={130} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p, i) => {
        const dim = highlight && !highlight.has(p.id);
        const steps = [
          { key: 'task', label: labels.problem, text: loc(p.problem, lang), tone: 'task', icon: 'fa-circle-question' },
          { key: 'solution', label: labels.solution, text: loc(p.solution, lang), tone: 'solution', icon: 'fa-gears' },
          p.result ? { key: 'result', label: labels.result, text: loc(p.result, lang), tone: 'result', icon: 'fa-check' } : null,
        ].filter(Boolean);
        return (
          <div key={p.id} id={`project-${p.id}`} className="rv-item rv-flip scroll-mt-24" style={{ '--i': i }}>
            <div className={`h-full transition-opacity duration-300 ${dim ? 'opacity-30' : ''}`}>
              <TiltCard className="flex flex-col h-full" innerClassName="flex flex-col h-full gap-4">
                <div className="flex items-start gap-3">
                  <div className="project-icon w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${p.icon} text-blue-400 text-lg`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white leading-snug">{loc(p.title, lang)}</h3>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{loc(p.context, lang)}</p>
                  </div>
                </div>
                <MiniFlow steps={steps} />
                {IS_PREVIEW && p.todo && (
                  <p className="preview-todo text-xs rounded-lg px-3 py-2">
                    <i className="fa-solid fa-pen mr-1.5" aria-hidden="true" />
                    {p.todo}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                  {p.skills.map((id) => (
                    <span key={id} className="text-[11px] px-2 py-0.5 rounded-md border border-slate-700 text-slate-400 bg-slate-800/40">
                      {skillName(id)}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </div>
          </div>
        );
      })}
    </RevealGroup>
  );
}
