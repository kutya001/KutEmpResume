import { useCallback, useEffect, useMemo, useState } from 'react';
import RESUME_DATA from './data.json';
import CAREER from './shared/career.json';
import PROJECTS from './projects.json';
import InteractiveBackground from './components/InteractiveBackground';
import TiltCard from './components/TiltCard';
import SiteNav from './shared/SiteNav';
import SectionHeader from './shared/SectionHeader';
import { Reveal, RevealGroup } from './shared/Reveal';
import EducationTimeline from './components/EducationTimeline';
import SqlTerminal from './components/SqlTerminal';
import CareerGantt from './components/CareerGantt';
import ExperienceList, { INITIAL_JOBS } from './components/ExperienceList';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import ResumePDFModal, { pdfFileName, usePdfAvailable } from './components/ResumePDFModal';
import ResumeSheet from './components/ResumeSheet';
import CountUp from './shared/CountUp';
import { notifyResumeView } from './tracking';
import { initAnonymousAnalytics } from './shared/analytics';
import {
  LINKS, SITE_URLS, getInitialLang, syncLangToUrl, storage, loc, fill, careerStats,
  currentJob, formatYm, withViewTransition, centerOf, getParam, isExternal,
} from './shared/site';

const BASE = import.meta.env.BASE_URL;
const imgSrc = (p) => (!p ? '' : isExternal(p) ? p : `${BASE}${p}`);
const PHOTO = `${BASE}MyImage.jpeg`;
const THEMES = ['light', 'dark', 'warm'];
const THEME_KEY = 'resume_theme';
const PARTICLE_COLORS = { dark: '59, 130, 246', light: '37, 99, 235', warm: '217, 119, 6' };
const THEME_COLORS = { dark: '#020617', light: '#f8fafc', warm: '#f6efe4' };
const PRINT_MODE = getParam('print') === '1';

function plural(n, forms, lang) {
  if (!forms || !forms.length) return '';
  if (lang === 'ru') {
    const a = n % 10;
    const b = n % 100;
    if (a === 1 && b !== 11) return forms[0];
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return forms[1] ?? forms[0];
    return forms[2] ?? forms[forms.length - 1];
  }
  if (lang === 'en') return n === 1 ? forms[0] : forms[1] ?? forms[0];
  return forms[0];
}

export default function App() {
  const [lang, setLang] = useState(() => getInitialLang('lang'));
  const [theme, setTheme] = useState(() => {
    const saved = storage.get(THEME_KEY);
    return THEMES.includes(saved) ? saved : 'dark';
  });
  const data = RESUME_DATA[lang] || RESUME_DATA.ru;

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const closePdf = useCallback(() => setIsPdfOpen(false), []);
  const [expanded, setExpanded] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const pdfReady = usePdfAvailable(lang);

  /* ── Язык и тема ── */
  useEffect(() => {
    storage.set('lang', lang);
    syncLangToUrl(lang);
    document.documentElement.lang = lang === 'kg' ? 'ky' : lang;
    document.title = data.meta.title;
  }, [lang, data.meta.title]);

  useEffect(() => {
    storage.set(THEME_KEY, theme);
    document.documentElement.setAttribute('data-site-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  }, [theme]);

  const changeLang = (l) => {
    if (l === lang) return;
    withViewTransition(() => setLang(l));
  };
  const changeTheme = (t, el) => {
    if (t === theme) return;
    const { x, y } = el ? centerOf(el) : {};
    withViewTransition(() => setTheme(t), { kind: 'circle', x, y });
  };

  useEffect(() => {
    if (PRINT_MODE) return;
    notifyResumeView();
    initAnonymousAnalytics();
  }, []);

  /* ── Данные ── */
  const stats = useMemo(() => careerStats(CAREER), []);
  const current = currentJob(CAREER);
  const skillName = useCallback((id) => loc(CAREER.skills.find((s) => s.id === id)?.name ?? id, lang), [lang]);

  const uses = useMemo(() => {
    const map = {};
    CAREER.skills.forEach((s) => { map[s.id] = { jobs: [], projects: [] }; });
    CAREER.jobs.forEach((j) => (j.skills || []).forEach((id) => map[id]?.jobs.push(j)));
    PROJECTS.items.forEach((p) => (p.skills || []).forEach((id) => map[id]?.projects.push(p)));
    return map;
  }, []);

  const jobHighlight = selectedSkill ? new Set(uses[selectedSkill].jobs.map((j) => j.id)) : null;
  const projectHighlight = selectedSkill ? new Set(uses[selectedSkill].projects.map((p) => p.id)) : null;

  const queries = useMemo(() => [
    {
      sql: 'SELECT role, company, since\nFROM career\nWHERE end_date IS NULL;',
      columns: ['role', 'company', 'since'],
      rows: [current ? [loc(current.role, lang), loc(current.company, lang), formatYm(current.start, lang)] : ['—', '—', '—']],
    },
    {
      sql: "SELECT STRING_AGG(name, ', ') AS advanced\nFROM skills\nWHERE level = 'advanced';",
      columns: ['advanced'],
      rows: [[CAREER.skills.filter((s) => s.level === 'advanced').map((s) => loc(s.name, lang)).join(', ')]],
    },
    {
      sql: 'SELECT mission\nFROM about;',
      columns: ['mission'],
      rows: [[data.hero.missionDesc]],
    },
  ], [lang, current, data.hero.missionDesc]);

  const goTo = (kind, id) => {
    if (kind === 'job') {
      const idx = CAREER.jobs.findIndex((j) => j.id === id);
      if (idx >= INITIAL_JOBS) setExpanded(true);
      setSelectedJob(id);
    }
    setTimeout(() => {
      document.getElementById(`${kind}-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  useEffect(() => {
    if (!selectedJob) return undefined;
    const t = setTimeout(() => setSelectedJob(null), 2600);
    return () => clearTimeout(t);
  }, [selectedJob]);

  /* ── Режим печати: ?print=1 — только лист A4 (из него GitHub Actions делает PDF) ── */
  if (PRINT_MODE) {
    return (
      <div className="print-root">
        <ResumeSheet data={data} lang={lang} career={CAREER} projects={PROJECTS.items} photo={PHOTO} imgSrc={imgSrc} />
      </div>
    );
  }

  const statusText = current ? fill(data.hero.status, { role: loc(current.role, lang), company: loc(current.company, lang) }) : null;

  return (
    <div className="relative w-full">
      <div className="no-print site">
        <InteractiveBackground mode="free" color={PARTICLE_COLORS[theme]} />

        <a href="#experience" className="skip-link">{data.nav.experience}</a>
        <SiteNav
          brand="KO."
          brandHref="#about"
          links={[
            { id: 'about', label: data.nav.about },
            { id: 'experience', label: data.nav.experience },
            { id: 'projects', label: data.nav.projects },
            { id: 'skills', label: data.nav.skills },
            { id: 'education', label: data.nav.education },
            { id: 'contact', label: data.nav.contact },
          ]}
          desktopCount={5}
          external={[{ href: SITE_URLS.services, label: data.nav.services }]}
          action={{ label: 'PDF', icon: 'fa-file-pdf', onClick: () => setIsPdfOpen(true) }}
          labels={{ theme: data.theme, themeGroup: data.nav.theme, language: data.nav.language, menu: data.nav.menu }}
          theme={theme}
          onTheme={changeTheme}
          lang={lang}
          onLang={changeLang}
          breakpoint="lg"
        />

        <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 flex flex-col gap-28 md:gap-32">
          {/* ═══ Hero ═══ */}
          <section id="about" className="scroll-mt-24">
            {/* Первый экран собирается по очереди: фото, имя, роли, терминал, кнопки */}
            <RevealGroup step={130} threshold={0} className="flex flex-col items-center text-center pt-6 md:pt-10">
              <div className="rv-item rv-pop relative mb-8" style={{ '--i': 0 }}>
                <div className="hero-photo w-40 h-40 md:w-52 md:h-52 rounded-full border-2 border-blue-500/50 p-1">
                  <img src={PHOTO} alt={data.hero.name} className="w-full h-full rounded-full object-cover" />
                </div>
                {statusText && (
                  <div className="status-pill absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-2 whitespace-nowrap">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" aria-hidden="true" />
                    <span className="text-xs font-mono font-bold text-slate-300">{statusText}</span>
                  </div>
                )}
              </div>

              <h1 className="rv-item rv-blur text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-balance" style={{ '--i': 1 }}>{data.hero.name}</h1>
              <p className="rv-item rv-up text-lg md:text-xl text-blue-400 font-mono mb-8 flex flex-wrap justify-center gap-x-4 sm:gap-x-2 gap-y-1" style={{ '--i': 2 }}>
                {data.hero.roles.map((r, i) => (
                  <span key={r} className="flex items-center gap-2">
                    {i > 0 && <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>}
                    {r}
                  </span>
                ))}
              </p>

              <div className="rv-item rv-zoom w-full flex justify-center" style={{ '--i': 3 }}>
                <SqlTerminal queries={queries} title={data.terminal.title} rowsLabel={data.terminal.rows} />
              </div>

              <div className="rv-item rv-up flex flex-col sm:flex-row gap-3 mt-8 mb-12 justify-center" style={{ '--i': 4 }}>
                <button
                  type="button"
                  onClick={() => setIsPdfOpen(true)}
                  className="px-6 py-3 bg-blue-600/90 hover:bg-blue-500 text-white rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95"
                >
                  <i className="fa-solid fa-file-pdf" aria-hidden="true" />
                  {data.hero.pdfView}
                </button>
                {pdfReady && (
                  <a
                    href={`${BASE}${pdfFileName(lang)}`}
                    download={pdfFileName(lang)}
                    target="_blank"
                    rel="noopener"
                    className="px-6 py-3 rounded-xl border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-download" aria-hidden="true" />
                    {data.hero.pdfDownload}
                  </a>
                )}
              </div>
            </RevealGroup>

            <RevealGroup step={140} className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
              <div className="rv-item rv-left" style={{ '--i': 0 }}>
                <TiltCard className="flex flex-col items-center text-center p-8 h-full" innerClassName="flex flex-col items-center">
                  <i className="fa-solid fa-bullseye text-3xl text-blue-400 mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold mb-2 text-white">{data.hero.missionTitle}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{data.hero.missionDesc}</p>
                </TiltCard>
              </div>
              <div className="rv-item rv-up" style={{ '--i': 1 }}>
                <TiltCard className="flex flex-col items-center text-center p-8 h-full" innerClassName="flex flex-col items-center w-full">
                  <i className="fa-solid fa-briefcase text-3xl text-purple-400 mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold mb-3 text-white">{data.hero.expTitle}</h3>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {[
                      ['total', stats.total, '+'],
                      ['focus', stats.focus, '+'],
                      ['companies', stats.companies, ''],
                    ].map(([key, value, suffix]) => (
                      <div key={key} className="flex flex-col items-center">
                        <CountUp value={value} suffix={suffix} className="text-2xl md:text-3xl font-extrabold text-white" />
                        <span className="text-[11px] text-slate-400 leading-tight mt-1">{plural(value, data.hero.stats[key], lang)}</span>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              </div>
              <div className="rv-item rv-right" style={{ '--i': 2 }}>
                <TiltCard className="flex flex-col items-center text-center p-8 h-full" innerClassName="flex flex-col items-center">
                  <i className="fa-solid fa-layer-group text-3xl text-cyan-400 mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold mb-2 text-white">{data.hero.stackTitle}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{data.hero.stackDesc}</p>
                </TiltCard>
              </div>
            </RevealGroup>
          </section>

          {/* ═══ Опыт ═══ */}
          <section id="experience" className="w-full scroll-mt-24">
            <SectionHeader tag={data.experience.sectionTag} title={data.experience.sectionTitle} subtitle={data.experience.subtitle} />
            <Reveal variant="zoom" className="rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md p-4 sm:p-6 mb-10">
              <CareerGantt
                jobs={CAREER.jobs}
                lang={lang}
                labels={data.experience}
                careerStart={CAREER.careerStart}
                imgSrc={imgSrc}
                highlight={jobHighlight}
                selected={selectedJob}
                onSelect={(id) => goTo('job', id)}
              />
            </Reveal>
            <ExperienceList
              jobs={CAREER.jobs}
              lang={lang}
              labels={data.experience}
              imgSrc={imgSrc}
              highlight={jobHighlight}
              selected={selectedJob}
              expanded={expanded}
              onToggle={() => setExpanded((v) => !v)}
            />
          </section>

          {/* ═══ Проекты ═══ */}
          <section id="projects" className="w-full scroll-mt-24">
            <SectionHeader tag={data.projects.sectionTag} title={data.projects.sectionTitle} subtitle={data.projects.subtitle} />
            <Projects items={PROJECTS.items} lang={lang} labels={data.projects} skillName={skillName} highlight={projectHighlight} />
          </section>

          {/* ═══ Навыки ═══ */}
          <section id="skills" className="w-full scroll-mt-24">
            <SectionHeader tag={data.skills.sectionTag} title={data.skills.sectionTitle} />
            <Skills
              skills={CAREER.skills}
              lang={lang}
              labels={data.skills}
              uses={uses}
              selected={selectedSkill}
              onSelect={setSelectedSkill}
              onGoTo={goTo}
            />
          </section>

          {/* ═══ Образование ═══ */}
          <section id="education" className="w-full scroll-mt-24">
            <SectionHeader tag={data.education.sectionTag} title={data.education.sectionTitle} />
            <EducationTimeline academic={data.education.academic} courses={data.education.courses} labels={data.education} />
          </section>

          {/* ═══ Контакты ═══ */}
          <section id="contact" className="w-full scroll-mt-24">
            <Contact data={data} lang={lang} currentRole={current ? loc(current.role, lang) : ''} />
          </section>
        </main>

        <footer className="relative z-10 border-t border-slate-800/50 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <span className="brand-mark font-bold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">KO.</span>
            </div>
            <div className="flex justify-center flex-wrap gap-x-5 gap-y-2 text-sm mb-3">
              <a href={SITE_URLS.services} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                {data.contact.servicesLink}
              </a>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                <i className="fa-brands fa-github mr-1.5" aria-hidden="true" />GitHub
              </a>
            </div>
            <p className="text-slate-500 text-sm">{fill(data.footer.copyright, { year: new Date().getFullYear() })}</p>
          </div>
        </footer>
      </div>

      <ResumePDFModal
        isOpen={isPdfOpen}
        onClose={closePdf}
        lang={lang}
        data={data}
        career={CAREER}
        projects={PROJECTS.items}
        photo={PHOTO}
        imgSrc={imgSrc}
      />
    </div>
  );
}
