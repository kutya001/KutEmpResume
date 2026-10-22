import { RevealGroup } from '../shared/Reveal';

/*
 * Образование и курсы на одной шкале лет:
 * линия прорисовывается слева направо, годы «вспыхивают», вузы выплывают сверху, курсы — снизу.
 * На телефоне — вертикальная шкала.
 */
function AcademicCard({ item }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm p-4 border-l-4 border-l-blue-500 text-left w-full">
      <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
        <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
        {item.year}
      </div>
      <h4 className="font-bold text-white leading-snug">{item.name}</h4>
      <p className="text-slate-400 text-xs mt-1">{item.speciality}</p>
      <p className="text-[11px] text-slate-500 mt-1.5">{item.note}</p>
    </div>
  );
}

function CourseCard({ item }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm p-3.5 text-left w-full flex items-start gap-3">
      <i className={`${item.icon} text-xl ${item.iconColor} mt-0.5`} aria-hidden="true" />
      <div className="min-w-0">
        <h4 className="font-bold text-white text-sm leading-snug">{item.name}</h4>
        <p className="text-[11px] text-slate-400 mt-0.5">{item.school} · {item.year}</p>
      </div>
    </div>
  );
}

export default function EducationTimeline({ academic, courses, labels }) {
  const years = [...new Set([...academic, ...courses].map((x) => x.year))].sort();
  const byYear = years.map((y) => ({
    year: y,
    academic: academic.filter((a) => a.year === y),
    courses: courses.filter((c) => c.year === y),
  }));

  return (
    <RevealGroup className="edu">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-xs text-slate-400">
        <span className="flex items-center gap-2"><i className="fa-solid fa-graduation-cap text-blue-400" aria-hidden="true" />{labels.academicTitle}</span>
        <span className="flex items-center gap-2"><i className="fa-solid fa-certificate text-cyan-400" aria-hidden="true" />{labels.coursesTitle}</span>
      </div>

      {/* Компьютер: горизонтальная шкала */}
      <div className="hidden md:grid gap-x-4" style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}>
        {byYear.map((col, c) => (
          <div key={`a-${col.year}`} className="flex flex-col justify-end items-center gap-0 min-h-[9rem]" style={{ '--c': c }}>
            {col.academic.map((a, k) => (
              <div key={a.name} className="edu-card edu-up w-full" style={{ '--k': k }}><AcademicCard item={a} /></div>
            ))}
            {col.academic.length > 0 && <span className="edu-stem edu-stem-a" aria-hidden="true" />}
          </div>
        ))}
        <div className="edu-axis" style={{ gridColumn: `1 / span ${years.length}` }}>
          <div className="absolute inset-0 grid gap-x-4" style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}>
            {byYear.map((col, c) => (
              <div key={`n-${col.year}`} className="flex flex-col items-center justify-center gap-1.5" style={{ '--c': c }}>
                <span className="edu-node relative z-10" />
              </div>
            ))}
          </div>
        </div>
        {byYear.map((col, c) => (
          <div key={`y-${col.year}`} className="flex justify-center -mt-1 mb-2" style={{ '--c': c }}>
            <span className="edu-year">{col.year}</span>
          </div>
        ))}
        {byYear.map((col, c) => (
          <div key={`c-${col.year}`} className="flex flex-col items-center gap-3 -mt-2" style={{ '--c': c }}>
            {col.courses.length > 0 && <span className="edu-stem" aria-hidden="true" />}
            {col.courses.map((it, k) => (
              <div key={it.name} className="edu-card edu-down w-full" style={{ '--k': k }}><CourseCard item={it} /></div>
            ))}
          </div>
        ))}
      </div>

      {/* Телефон: вертикальная шкала */}
      <div className="md:hidden relative pl-8">
        <span className="edu-vline" aria-hidden="true" />
        <ol className="space-y-6">
          {byYear.map((col, c) => (
            <li key={`m-${col.year}`} className="relative" style={{ '--c': c }}>
              <span className="edu-node absolute -left-8 top-0.5" aria-hidden="true" />
              <div className="edu-year mb-2">{col.year}</div>
              <div className="space-y-3">
                {col.academic.map((a, k) => (
                  <div key={a.name} className="edu-card edu-up" style={{ '--k': k }}><AcademicCard item={a} /></div>
                ))}
                {col.courses.map((it, k) => (
                  <div key={it.name} className="edu-card edu-up" style={{ '--k': k + col.academic.length }}><CourseCard item={it} /></div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </RevealGroup>
  );
}
