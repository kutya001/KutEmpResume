import { LINKS, PERSON, SITE_URLS, loc, formatRange } from '../shared/site';
import Logo from '../shared/Logo';

const LABELS = {
  ru: { location: 'Бишкек, Кыргызстан', page: '1 / 1' },
  kg: { location: 'Бишкек, Кыргызстан', page: '1 / 1' },
  en: { location: 'Bishkek, Kyrgyzstan', page: '1 / 1' },
};

const LEVELS = ['advanced', 'intermediate', 'basic'];

/** Резюме на одном листе A4 — для окна предпросмотра, печати и генерации PDF. */
export default function ResumeSheet({ data, lang, career, projects, photo, imgSrc = (p) => p }) {
  const l = LABELS[lang] || LABELS.ru;
  const mainJobs = career.jobs.filter((j) => j.type !== 'teaching');
  const teaching = career.jobs.filter((j) => j.type === 'teaching');
  const siteLabel = SITE_URLS.resume.replace(/^https:\/\//, '');

  return (
    <div className="resume-page flex flex-col justify-between select-text">
      <div>
        <div className="border-b border-slate-200 pb-3 mb-3 flex justify-between items-start">
          <div className="flex-1 text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">{data.hero.name}</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex flex-wrap gap-2 items-center">
              {data.hero.roles.map((r, i) => (
                <span key={r} className="flex items-center gap-2">
                  {i > 0 && <span className="text-slate-300">|</span>}
                  {r}
                </span>
              ))}
            </p>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 mt-3 text-[9px] text-slate-600 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-blue-500 w-3 text-center" aria-hidden="true" />
                {l.location}
              </span>
              <a href={LINKS.phone} className="flex items-center gap-1.5 hover:text-blue-600">
                <i className="fa-solid fa-phone text-blue-500 w-3 text-center" aria-hidden="true" />
                {PERSON.phoneDisplay}
              </a>
              <a href={LINKS.email} className="flex items-center gap-1.5 hover:text-blue-600 truncate">
                <i className="fa-solid fa-envelope text-blue-500 w-3 text-center" aria-hidden="true" />
                <span className="truncate">{PERSON.email}</span>
              </a>
              <a href={LINKS.telegram} className="flex items-center gap-1.5 hover:text-blue-600">
                <i className="fa-brands fa-telegram text-blue-500 w-3 text-center" aria-hidden="true" />
                @{PERSON.telegram}
              </a>
              <a href={LINKS.github} className="flex items-center gap-1.5 hover:text-blue-600">
                <i className="fa-brands fa-github text-blue-500 w-3 text-center" aria-hidden="true" />
                github.com/{PERSON.github}
              </a>
              <a href={SITE_URLS.resume} className="flex items-center gap-1.5 hover:text-blue-600 truncate">
                <i className="fa-solid fa-globe text-blue-500 w-3 text-center" aria-hidden="true" />
                <span className="truncate">{siteLabel}</span>
              </a>
            </div>
          </div>
          <div className="w-[88px] h-[88px] rounded-full border-2 border-blue-100 p-0.5 overflow-hidden ml-6 shrink-0">
            <img src={photo} alt={data.hero.name} className="w-full h-full rounded-full object-cover" />
          </div>
        </div>

        <div className="flex flex-row gap-5">
          {/* Левая колонка */}
          <div className="w-[31%] shrink-0 flex flex-col gap-3.5 border-r border-slate-100 pr-4 text-left">
            <section className="flex flex-col gap-1.5">
              <h3 className="sheet-h">{data.hero.missionTitle}</h3>
              <p className="text-[9.5px] leading-normal text-slate-600 italic">{data.hero.missionDesc}</p>
            </section>

            <section className="flex flex-col gap-2.5">
              <h3 className="sheet-h">{data.skills.sectionTag}</h3>
              {LEVELS.map((level) => (
                <div key={level} className="flex flex-col gap-1">
                  <h4 className="text-[8px] font-bold text-slate-500 uppercase tracking-wider leading-none">{data.skills.levels[level]}</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.filter((s) => s.level === level).map((s) => (
                      <span key={s.id} className="px-1.5 py-0.5 bg-slate-100 rounded text-[8.5px] font-medium text-slate-700 border border-slate-200/50 leading-none">
                        {loc(s.name, lang)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="sheet-h">{data.education.academicTitle}</h3>
              {data.education.academic.map((item) => (
                <div key={item.name} className="flex flex-col gap-0.5">
                  <h4 className="font-bold text-slate-800 leading-tight text-[9.5px]">{item.name}</h4>
                  <p className="text-[8.5px] text-slate-500 font-medium leading-tight">{item.speciality}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="bg-slate-100 text-slate-600 font-bold px-1 py-0.5 rounded text-[7.5px] leading-none">{item.year}</span>
                    <span className="text-[7.5px] text-slate-400 italic font-mono leading-none">{item.note}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="sheet-h">{data.education.coursesTitle}</h3>
              {data.education.courses.map((item) => (
                <div key={item.name} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-slate-800 text-[9.5px] truncate">{item.name}</h4>
                    <span className="text-[8px] font-mono text-slate-400 font-semibold shrink-0">{item.year}</span>
                  </div>
                  <p className="text-[8.5px] text-slate-500 font-medium leading-none">{item.school}</p>
                </div>
              ))}
            </section>
          </div>

          {/* Правая колонка */}
          <div className="flex-1 min-w-0 flex flex-col gap-3 text-left">
            <h3 className="sheet-h flex items-center gap-1.5">
              <i className="fa-solid fa-briefcase text-blue-500 text-[8px]" aria-hidden="true" />
              {data.experience.sectionTitle}
            </h3>
            <div className="flex flex-col gap-2.5">
              {mainJobs.map((job) => (
                <div key={job.id} className="flex gap-2.5">
                  <span className="sheet-logo mt-0.5"><Logo src={imgSrc(job.img)} name={loc(job.company, lang)} className="w-full h-full" /></span>
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-[10.5px] font-bold text-slate-900 leading-tight">{loc(job.role, lang)}</h4>
                      <span className="text-[8.5px] font-mono text-slate-400 font-semibold shrink-0">{formatRange(job.start, job.end, lang)}</span>
                    </div>
                    <div className="text-[9.5px] font-semibold text-blue-600 leading-none">{loc(job.company, lang)}</div>
                    <p className="text-[9.5px] text-slate-600 leading-snug pl-2 border-l border-slate-200 mt-0.5">{loc(job.desc, lang)}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="sheet-h mt-1">{data.experience.legendTeaching}</h3>
            <div className="flex flex-col gap-1">
              {teaching.map((job) => (
                <div key={job.id} className="flex justify-between items-center gap-2 text-[9.5px]">
                  <span className="text-slate-800 flex items-center gap-2 min-w-0">
                    <span className="sheet-logo sheet-logo-sm"><Logo src={imgSrc(job.img)} name={loc(job.company, lang)} className="w-full h-full" /></span>
                    <span><b>{loc(job.role, lang)}</b> · <span className="text-blue-600 font-semibold">{loc(job.company, lang)}</span></span>
                  </span>
                  <span className="text-[8.5px] font-mono text-slate-400 font-semibold shrink-0">{formatRange(job.start, job.end, lang)}</span>
                </div>
              ))}
            </div>

            <h3 className="sheet-h mt-1">{data.projects.sectionTitle}</h3>
            <div className="flex flex-col gap-1.5">
              {projects.map((p) => (
                <p key={p.id} className="text-[9.5px] text-slate-600 leading-snug">
                  <b className="text-slate-900">{loc(p.title, lang)}</b>
                  <span className="text-slate-400"> ({loc(p.context, lang)})</span> — {loc(p.solution, lang)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-[7.5px] text-slate-400 flex justify-between border-t border-slate-100 pt-1.5 mt-3 print:mt-0 leading-none select-none">
        <span>{data.hero.name} — {data.hero.missionTitle}</span>
        <span>{l.page}</span>
      </div>
    </div>
  );
}
