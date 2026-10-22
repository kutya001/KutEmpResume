import { useEffect, useRef, useState } from 'react';
import ResumeSheet from './ResumeSheet';
import { IS_PREVIEW } from '../shared/site';

const BASE = import.meta.env.BASE_URL;

export const pdfFileName = (lang) => `Omuraliev_Kutman_CV_${lang.toUpperCase()}.pdf`;

const LABELS = {
  ru: { title: 'Предпросмотр резюме (A4)', download: 'Скачать PDF', print: 'Печать', close: 'Закрыть', preview: 'В превью PDF открывается отдельным файлом — на сайте кнопка скачает его.' },
  kg: { title: 'Резюме көрүү (A4)', download: 'PDF жүктөп алуу', print: 'Басып чыгаруу', close: 'Жабуу', preview: 'Превьюда PDF өзүнчө файл катары ачылат — сайтта баскыч аны жүктөп берет.' },
  en: { title: 'Resume Preview (A4)', download: 'Download PDF', print: 'Print', close: 'Close', preview: 'In the preview the PDF is a separate file — on the site the button downloads it.' },
};

/** Проверяет, что PDF для языка лежит на сайте (его собирает GitHub Actions). */
export function usePdfAvailable(lang) {
  const [ok, setOk] = useState(IS_PREVIEW);
  useEffect(() => {
    if (IS_PREVIEW) return undefined;
    let alive = true;
    fetch(`${BASE}${pdfFileName(lang)}`, { method: 'HEAD', cache: 'no-cache' })
      .then((r) => alive && setOk(r.ok && (r.headers.get('content-type') || '').includes('pdf')))
      .catch(() => alive && setOk(false));
    return () => { alive = false; };
  }, [lang]);
  return ok;
}

export default function ResumePDFModal({ isOpen, onClose, lang, data, career, projects, photo, imgSrc }) {
  const l = LABELS[lang] || LABELS.ru;
  const pdfReady = usePdfAvailable(lang);
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Лист A4 шириной 820px уменьшается целиком, чтобы на телефоне ничего не обрезалось
  useEffect(() => {
    const el = wrapRef.current;
    if (!isOpen || !el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / 820)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sheet = <ResumeSheet data={data} lang={lang} career={career} projects={projects} photo={photo} imgSrc={imgSrc} />;

  return (
    <>
      <div className="fixed inset-0 z-[60] overflow-y-auto p-3 md:p-8 flex items-center justify-center bg-slate-950/80 backdrop-blur-md no-print" role="dialog" aria-modal="true" aria-label={l.title} onClick={onClose}>
        <div className="pdf-modal relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-4 border-b border-slate-800">
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-file-pdf text-blue-400" aria-hidden="true" />
              {l.title}
            </h2>
            <div className="flex items-center gap-2">
              {pdfReady && (
                <a
                  href={`${BASE}${pdfFileName(lang)}`}
                  download={pdfFileName(lang)}
                  target="_blank"
                  rel="noopener"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-download" aria-hidden="true" />
                  {l.download}
                </a>
              )}
              {!IS_PREVIEW && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-print" aria-hidden="true" />
                  {l.print}
                </button>
              )}
              <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all" title={l.close} aria-label={l.close}>
                <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
              </button>
            </div>
          </div>
          {IS_PREVIEW && <p className="px-6 pt-3 text-xs text-amber-400">{l.preview}</p>}
          <div className="p-3 md:p-6 overflow-auto bg-slate-950/50 flex-1">
            <div ref={wrapRef} className="w-full">
              <div className="sheet-scaler mx-auto" style={{ zoom: scale }}>{sheet}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden print:block print-only w-full">{sheet}</div>
    </>
  );
}
