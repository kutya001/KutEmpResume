import { loc, ymToIndex, nowIndex, formatRange } from '../shared/site';
import { useInView } from '../shared/hooks';
import Logo from '../shared/Logo';

/*
 * Карьера как диаграмма Ганта: каждая роль — полоса на шкале времени.
 * Полосы «вырастают» слева направо, когда блок появляется на экране.
 */
export default function CareerGantt({ jobs, lang, labels, careerStart, imgSrc, highlight, selected, onSelect }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  const startYear = Number(String(careerStart).slice(0, 4));
  const axisStart = startYear * 12;
  const now = nowIndex();
  const axisEnd = now + 4;
  const span = axisEnd - axisStart;
  const pct = (i) => ((i - axisStart) / span) * 100;
  const years = [];
  for (let y = startYear; y * 12 <= now; y++) years.push(y);
  const todayPct = pct(now + 0.5);

  return (
    <div ref={ref} className={`gantt ${inView ? 'gantt-in' : ''}`}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-xs text-slate-400">
        <span className="flex items-center gap-2"><span className="gantt-swatch gantt-main" aria-hidden="true" />{labels.legendMain}</span>
        <span className="flex items-center gap-2"><span className="gantt-swatch gantt-teaching" aria-hidden="true" />{labels.legendTeaching}</span>
      </div>

      <div className="relative">
        {/* Шкала лет */}
        <div className="gantt-grid grid grid-cols-1 md:grid-cols-[minmax(0,16rem)_1fr] gap-x-4">
          <div className="hidden md:block" />
          <div className="relative h-6 text-[10px] sm:text-[11px] font-mono text-slate-500">
            {years.map((y) => (
              <span key={y} className="absolute -translate-x-1/2 top-0" style={{ left: `${pct(y * 12)}%` }}>
                <span className="hidden sm:inline">{y}</span>
                <span className="sm:hidden">’{String(y).slice(2)}</span>
              </span>
            ))}
          </div>
        </div>

        <ol className="relative space-y-2.5 md:space-y-2">
          {jobs.map((job, i) => {
            const s = ymToIndex(job.start);
            const e = (job.end ? ymToIndex(job.end) : now) + 1;
            const left = pct(s);
            const width = Math.max(1.2, pct(e) - left);
            const dim = highlight && !highlight.has(job.id);
            const isSel = selected === job.id;
            const role = loc(job.role, lang);
            const company = loc(job.company, lang);
            const dates = formatRange(job.start, job.end, lang);
            return (
              <li key={job.id} className={`transition-opacity duration-300 ${dim ? 'opacity-25' : 'opacity-100'}`}>
                <button
                  type="button"
                  onClick={() => onSelect(job.id)}
                  aria-label={`${role}, ${company}, ${dates}`}
                  className={`gantt-row w-full grid grid-cols-1 md:grid-cols-[minmax(0,16rem)_1fr] gap-x-4 gap-y-1.5 items-center text-left rounded-lg px-2 py-1.5 -mx-2 transition-colors ${isSel ? 'gantt-row-selected' : 'hover:bg-slate-800/40'}`}
                >
                  <span className="flex items-center gap-2.5 min-w-0 gantt-label" style={{ transitionDelay: `${i * 70}ms` }}>
                    <span className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0">
                      <Logo src={imgSrc(job.img)} name={company} className="w-full h-full" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-white truncate">{role}</span>
                      <span className="block text-[11px] text-slate-500 truncate">
                        {company}
                        <span className="md:hidden"> · {dates}</span>
                      </span>
                    </span>
                  </span>
                  <span className="relative block h-3.5 md:h-4 rounded-full bg-slate-800/60">
                    {years.map((y) => (
                      <span key={y} className="gantt-tick absolute top-0 bottom-0 w-px" style={{ left: `${pct(y * 12)}%` }} aria-hidden="true" />
                    ))}
                    <span
                      className={`gantt-bar absolute top-0 bottom-0 rounded-full ${job.type === 'teaching' ? 'gantt-teaching' : 'gantt-main'} ${!job.end ? 'gantt-current' : ''}`}
                      style={{ left: `${left}%`, width: `${width}%`, transitionDelay: `${150 + i * 90}ms` }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Линия «сегодня» */}
        <div className="pointer-events-none absolute inset-0 hidden md:grid md:grid-cols-[minmax(0,16rem)_1fr] gap-x-4" aria-hidden="true">
          <div />
          <div className="relative">
            <span className="gantt-today absolute top-6 bottom-0 w-px" style={{ left: `${todayPct}%` }} />
            <span className="absolute -top-0.5 text-[10px] font-mono gantt-today-label -translate-x-1/2" style={{ left: `${todayPct}%` }}>
              {labels.today}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
