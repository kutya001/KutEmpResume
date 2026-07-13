import React from 'react';
import RESUME_DATA from '../data.json';

const BASE = import.meta.env.BASE_URL;

export default function ResumePDFModal({ isOpen, onClose, lang }) {
  if (!isOpen) return null;

  const data = RESUME_DATA[lang];

  // Helper translations for contacts and labels
  const labels = {
    ru: {
      location: 'Бишкек, Кыргызстан',
      phone: 'Телефон',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      downloadPdf: 'Печать / Сохранить в PDF',
      close: 'Закрыть',
      previewTitle: 'Предпросмотр резюме (A4)',
      portfolio: 'Портфолио',
      contacts: 'Контакты',
    },
    en: {
      location: 'Bishkek, Kyrgyzstan',
      phone: 'Phone',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      downloadPdf: 'Print / Save to PDF',
      close: 'Close',
      previewTitle: 'Resume Preview (A4)',
      portfolio: 'Portfolio',
      contacts: 'Contacts',
    },
    kg: {
      location: 'Бишкек, Кыргызстан',
      phone: 'Телефон',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      downloadPdf: 'Басып чыгаруу / PDF сактоо',
      close: 'Жабуу',
      previewTitle: 'Резюме көрүү (A4)',
      portfolio: 'Портфолио',
      contacts: 'Байланыш',
    }
  }[lang] || {
    location: 'Бишкек, Кыргызстан',
    phone: 'Телефон',
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    downloadPdf: 'Печать / Сохранить  // Shared sheet layout component
  const ResumeSheet = () => (
    <div className="resume-page flex flex-col justify-between select-text">
      <div>
        {/* Header: Name, Title, and Contacts */}
        <div className="border-b border-slate-200 pb-3 mb-3 flex justify-between items-start select-text">
          <div className="flex-1 text-left select-text">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1 select-text">
              {data.hero.name}
            </h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex gap-2 items-center select-text">
              <span>Data Analyst</span>
              <span className="text-slate-300">|</span>
              <span>BI Specialist</span>
              <span className="text-slate-300">|</span>
              <span>Mentor</span>
            </p>

            {/* Contacts row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 mt-3 text-[9px] text-slate-600 pt-2 border-t border-slate-100 select-text">
              <div className="flex items-center gap-1.5 group select-text">
                <i className="fa-solid fa-location-dot text-blue-500 w-3 text-center group-hover:scale-110 transition-transform" />
                <span>{labels.location}</span>
              </div>
              <a href="tel:+996500888268" className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-all group select-text">
                <i className="fa-solid fa-phone text-blue-500 w-3 text-center group-hover:scale-110 transition-transform" />
                <span>+996 500 888 268</span>
              </a>
              <a href="mailto:kutmanomuraliev012@gmail.com" className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-all group select-text truncate">
                <i className="fa-solid fa-envelope text-blue-500 w-3 text-center group-hover:scale-110 transition-transform" />
                <span className="truncate">kutmanomuraliev012@gmail.com</span>
              </a>
              <a href="https://wa.me/996500888268" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-all group select-text">
                <i className="fa-brands fa-whatsapp text-blue-500 w-3 text-center group-hover:scale-110 transition-transform" />
                <span>WhatsApp</span>
              </a>
              <a href="https://t.me/kutya_omuraliev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-all group select-text">
                <i className="fa-brands fa-telegram text-blue-500 w-3 text-center group-hover:scale-110 transition-transform" />
                <span>@kutya_omuraliev</span>
              </a>
              <a href="https://kutya001.github.io/KutEmpResume/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-all group select-text truncate">
                <i className="fa-solid fa-globe text-blue-500 w-3 text-center group-hover:scale-110 transition-transform" />
                <span className="truncate">kutya001.github.io/KutEmpResume/</span>
              </a>
            </div>
          </div>

          {/* Photo with hover zoom */}
          <div className="w-16 h-16 rounded-full border border-slate-200 p-0.5 overflow-hidden ml-6 shrink-0 group cursor-pointer">
            <img
              src={`${BASE}MyImage.jpeg`}
              alt={data.hero.name}
              className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Two-Column split */}
        <div className="flex flex-row gap-5 select-text">
          
          {/* Sidebar Column (Left) */}
          <div className="w-[32%] flex flex-col gap-4 border-r border-slate-100 pr-4 text-left select-text">
            
            {/* Mission */}
            <div className="flex flex-col gap-1.5 select-text">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-0.5 select-text">
                {data.hero.missionTitle}
              </h3>
              <p className="text-[9.5px] leading-normal text-slate-650 italic select-text">
                {data.hero.missionDesc}
              </p>
            </div>

            {/* Skills with hover zoom/bg-color */}
            <div className="flex flex-col gap-3 select-text">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-0.5 select-text">
                {data.skills.sectionTag}
              </h3>
              {data.skills.levels.map((level, idx) => (
                <div key={idx} className="flex flex-col gap-1 select-text">
                  <h4 className="text-[8px] font-bold text-slate-500 uppercase tracking-wider leading-none select-text">
                    {level.title}
                  </h4>
                  <div className="flex flex-wrap gap-1 select-text">
                    {level.items.map((item, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 bg-slate-100 rounded text-[8.5px] font-medium text-slate-700 border border-slate-200/50 leading-none select-text hover:scale-105 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Education (Academic) */}
            <div className="flex flex-col gap-2 select-text">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-0.5 select-text">
                {data.education.academicTitle}
              </h3>
              <div className="flex flex-col gap-2.5 select-text">
                {data.education.academic.map((item, idx) => (
                  <div key={idx} className="text-xs flex flex-col gap-0.5 select-text">
                    <h4 className="font-bold text-slate-800 leading-tight text-[9.5px] select-text">{item.name}</h4>
                    <p className="text-[8.5px] text-slate-500 font-medium leading-tight select-text">{item.speciality}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 select-text">
                      <span className="bg-slate-100 text-slate-600 font-bold px-1 py-0.5 rounded text-[7.5px] leading-none select-text">
                        {item.year}
                      </span>
                      <span className="text-[7.5px] text-slate-400 italic font-mono leading-none select-text">{item.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses & Certificates */}
            <div className="flex flex-col gap-2 select-text">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-0.5 select-text">
                {data.education.coursesTitle}
              </h3>
              <div className="flex flex-col gap-2 select-text">
                {data.education.courses.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5 select-text">
                    <div className="flex items-center justify-between gap-1 select-text">
                      <h4 className="font-bold text-slate-800 text-[9.5px] truncate select-text">{item.name}</h4>
                      <span className="text-[8px] font-mono text-slate-400 font-semibold shrink-0 select-text">{item.year}</span>
                    </div>
                    <p className="text-[8.5px] text-slate-500 font-medium leading-none select-text">{item.school}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Main Column (Right) */}
          <div className="w-[68%] flex flex-col gap-3.5 text-left select-text">
            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-0.5 flex items-center gap-1.5 select-text">
              <i className="fa-solid fa-briefcase text-blue-500 text-[8px]" />
              {data.experience.sectionTitle}
            </h3>

            <div className="flex flex-col gap-3 select-text">
              {data.experience.jobs.map((job, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 select-text hover:bg-slate-50/50 p-1 -m-1 rounded transition-colors duration-200">
                  <div className="flex justify-between items-baseline gap-2 select-text">
                    <h4 className="text-[10.5px] font-bold text-slate-900 leading-tight select-text">{job.role}</h4>
                    <span className="text-[8.5px] font-mono text-slate-400 font-semibold shrink-0 select-text">{job.dates}</span>
                  </div>
                  <div className="text-[9.5px] font-semibold text-blue-600 leading-none select-text">
                    {job.company}
                  </div>
                  <p className="text-[9.5px] text-slate-600 leading-relaxed pl-2 border-l border-slate-200 mt-0.5 select-text">
                    {job.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-[7.5px] text-slate-400 flex justify-between border-t border-slate-100 pt-1.5 mt-3 print:mt-0 leading-none select-none">
        <span>{data.hero.name} &mdash; {data.hero.missionTitle}</span>
        <span>1 / 1</span>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. SCREEN PREVIEW MODAL */}
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-slate-950/80 backdrop-blur-md no-print">
        <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-file-pdf text-blue-400" />
              {labels.previewTitle}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                <i className="fa-solid fa-print" />
                {labels.downloadPdf}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                title={labels.close}
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>
          </div>

          {/* Modal Content - Scrollable Web A4 preview */}
          <div className="p-6 overflow-y-auto bg-slate-950/50 flex-1 scrollbar-thin">
            <div className="flex justify-center">
              <ResumeSheet />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRINT-ONLY COMPONENT */}
      <div className="hidden print:block print-only w-full">
        <ResumeSheet />
      </div>
    </>
  );
}
