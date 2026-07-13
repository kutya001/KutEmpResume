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
    downloadPdf: 'Печать / Сохранить в PDF',
    close: 'Закрыть',
    previewTitle: 'Предпросмотр резюме (A4)',
    portfolio: 'Портфолио',
    contacts: 'Контакты',
  };

  const handlePrint = () => {
    window.print();
  };

  // Shared sheet layout component
  const ResumeSheet = () => (
    <div className="w-full max-w-[820px] mx-auto bg-white text-slate-800 font-sans shadow-lg flex flex-col md:flex-row min-h-[1150px] border border-slate-200 print:border-none print:shadow-none text-left">
      {/* Sidebar - Left Column */}
      <div className="w-full md:w-[32%] bg-slate-50/90 border-r border-slate-200/80 p-6 flex flex-col gap-6 print:bg-slate-50/80 print:w-[32%]">
        
        {/* Photo and Name (compact for small screens print) */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-24 h-24 rounded-full border-2 border-blue-500/30 p-0.5 overflow-hidden">
            <img
              src={`${BASE}MyImage.jpeg`}
              alt={data.hero.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="md:hidden">
            <h2 className="text-xl font-bold text-slate-900">{data.hero.name}</h2>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Data Analyst & BI Specialist
            </p>
          </div>
        </div>

        {/* Contacts */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">
            {labels.contacts}
          </h3>
          <ul className="text-xs flex flex-col gap-2.5 text-slate-700">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-blue-500 w-4 text-center" />
              <span>{labels.location}</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-blue-500 w-4 text-center" />
              <a href="tel:+996500888268" className="hover:text-blue-600 hover:underline transition-all">
                +996 500 888 268
              </a>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-brands fa-whatsapp text-blue-500 w-4 text-center" />
              <a href="https://wa.me/996500888268" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline transition-all">
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-brands fa-telegram text-blue-500 w-4 text-center" />
              <a href="https://t.me/kutya_omuraliev" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline transition-all">
                @kutya_omuraliev
              </a>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-globe text-blue-500 w-4 text-center" />
              <a href="https://kutya001.github.io/KutEmpResume/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline transition-all">
                {labels.portfolio}
              </a>
            </li>
          </ul>
        </div>

        {/* Mission / Objective */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">
            {data.hero.missionTitle}
          </h3>
          <p className="text-xs leading-relaxed text-slate-600 italic">
            {data.hero.missionDesc}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">
            {data.skills.sectionTag}
          </h3>
          
          {data.skills.levels.map((level, idx) => (
            <div key={idx} className="flex flex-col gap-1.5 break-inside-avoid">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {level.title}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {level.items.map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-200/60 rounded text-[10px] font-medium text-slate-700 border border-slate-300/35 print:bg-slate-200/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education (Academic) */}
        <div className="flex flex-col gap-3 break-inside-avoid">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">
            {data.education.academicTitle}
          </h3>
          <div className="flex flex-col gap-3">
            {data.education.academic.map((item, idx) => (
              <div key={idx} className="text-xs flex flex-col gap-0.5">
                <h4 className="font-bold text-slate-800 leading-tight">{item.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium">{item.speciality}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded text-[9px] print:bg-slate-200">
                    {item.year}
                  </span>
                  <span className="text-[9px] text-slate-400 italic font-mono">{item.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Body - Right Column */}
      <div className="w-full md:w-[68%] p-6 flex flex-col gap-6 print:w-[68%]">
        
        {/* Header Name & Title */}
        <div className="hidden md:flex flex-col gap-1 border-b border-slate-100 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {data.hero.name}
          </h1>
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest flex gap-2 items-center">
            <span>Data Analyst</span>
            <span className="text-slate-300">|</span>
            <span>BI Specialist</span>
            <span className="text-slate-300">|</span>
            <span>Mentor</span>
          </p>
        </div>

        {/* Work Experience */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 flex items-center gap-2">
            <i className="fa-solid fa-briefcase text-blue-500 text-[10px]" />
            {data.experience.sectionTitle}
          </h3>

          <div className="flex flex-col gap-4">
            {data.experience.jobs.map((job, idx) => (
              <div key={idx} className="flex flex-col gap-1 break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <h4 className="text-xs font-bold text-slate-900">
                    {job.role}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    {job.dates}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-blue-600/90">
                  {job.company}
                </div>
                <p className="text-[11px] text-slate-650 leading-relaxed pl-3 border-l-2 border-slate-200">
                  {job.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Courses & Certificates */}
        <div className="flex flex-col gap-3 break-inside-avoid">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 flex items-center gap-2">
            <i className="fa-solid fa-certificate text-blue-500 text-[10px]" />
            {data.education.coursesTitle}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {data.education.courses.map((item, idx) => (
              <div key={idx} className="text-xs flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 truncate pr-2">{item.name}</h4>
                  <span className="text-[9px] font-mono text-slate-400 font-semibold">{item.year}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">{item.school}</p>
              </div>
            ))}
          </div>
        </div>

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

      {/* 2. PRINT-ONLY COMPONENT (rendered directly at the body root for print) */}
      <div className="hidden print:block print-only absolute top-0 left-0 w-full">
        <ResumeSheet />
      </div>
    </>
  );
}
