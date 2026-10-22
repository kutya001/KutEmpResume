import TiltCard from './TiltCard';
import Logo from '../shared/Logo';
import { RevealGroup } from '../shared/Reveal';
import { loc, formatRange, formatDuration, monthsInRole, fill } from '../shared/site';

export const INITIAL_JOBS = 6;

export default function ExperienceList({ jobs, lang, labels, imgSrc, highlight, selected, expanded, onToggle }) {
  const visible = expanded ? jobs : jobs.slice(0, INITIAL_JOBS);
  const hidden = jobs.length - INITIAL_JOBS;

  return (
    <div>
      <RevealGroup step={110} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((job, i) => {
          const dim = highlight && !highlight.has(job.id);
          const company = loc(job.company, lang);
          return (
            <div key={job.id} id={`job-${job.id}`} className={`rv-item ${i % 3 === 0 ? 'rv-left' : i % 3 === 2 ? 'rv-right' : 'rv-up'} scroll-mt-24`} style={{ '--i': i % INITIAL_JOBS }}>
              <div className={`h-full transition-all duration-300 ${dim ? 'opacity-30' : ''} ${selected === job.id ? 'card-selected' : ''}`}>
                <TiltCard className="flex flex-col h-full" innerClassName="flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden flex-shrink-0">
                      <Logo src={imgSrc(job.img)} name={company} className="w-full h-full" />
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {!job.end && (
                        <span className="badge-now text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{labels.current}</span>
                      )}
                      {job.type === 'teaching' && (
                        <span className="badge-teaching text-[10px] font-semibold px-2 py-0.5 rounded-full">{labels.legendTeaching}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <span className="text-xs font-mono text-slate-500 block mb-1">
                      {formatRange(job.start, job.end, lang)} · {formatDuration(monthsInRole(job.start, job.end), lang)}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1">{loc(job.role, lang)}</h3>
                    <h4 className="text-sm text-blue-400 font-medium mb-3">{company}</h4>
                    <p className="text-sm text-slate-400">{loc(job.desc, lang)}</p>
                  </div>
                </TiltCard>
              </div>
            </div>
          );
        })}
      </RevealGroup>
      {hidden > 0 && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="px-6 py-2.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:border-blue-500/60 text-slate-300 hover:text-white text-sm font-semibold transition-all inline-flex items-center gap-2"
          >
            {expanded ? labels.showLess : fill(labels.showMore, { n: hidden })}
            <i className={`fa-solid fa-chevron-down text-xs transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
