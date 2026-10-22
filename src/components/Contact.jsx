import { useState } from 'react';
import { LINKS, PERSON, SITE_URLS, IS_PREVIEW, buildVCard, downloadFile, loc } from '../shared/site';
import { sendContactForm } from '../tracking';
import { Reveal, RevealGroup } from '../shared/Reveal';

export default function Contact({ data, lang, currentRole }) {
  const c = data.contact;
  const f = data.contactForm;
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState(null); // null | sending | success | error | preview
  const [note, setNote] = useState('');

  const channels = [
    { key: 'telegram', icon: 'fa-brands fa-telegram', href: LINKS.telegram, value: `@${PERSON.telegram}`, hover: 'hover:text-blue-400' },
    { key: 'whatsapp', icon: 'fa-brands fa-whatsapp', href: LINKS.whatsapp, value: PERSON.phoneDisplay, hover: 'hover:text-green-400' },
    { key: 'email', icon: 'fa-solid fa-envelope', href: LINKS.email, value: PERSON.email, hover: 'hover:text-red-400' },
    { key: 'phone', icon: 'fa-solid fa-phone-alt', href: LINKS.phone, value: PERSON.phoneDisplay, hover: 'hover:text-cyan-400' },
    { key: 'github', icon: 'fa-brands fa-github', href: LINKS.github, value: `github.com/${PERSON.github}`, hover: 'hover:text-white' },
    { key: 'instagram', icon: 'fa-brands fa-instagram', href: LINKS.instagram, value: `@${PERSON.instagram}`, hover: 'hover:text-pink-400' },
    LINKS.linkedin ? { key: 'linkedin', icon: 'fa-brands fa-linkedin', href: LINKS.linkedin, value: 'LinkedIn', hover: 'hover:text-sky-400' } : null,
  ].filter(Boolean);

  const saveContact = () => {
    if (IS_PREVIEW) {
      setNote(c.previewDownload);
      return;
    }
    const vcf = buildVCard({ lang, title: currentRole, url: SITE_URLS.resume });
    downloadFile(`${loc(PERSON.family, 'en')}_${loc(PERSON.given, 'en')}.vcf`, vcf, 'text/vcard;charset=utf-8');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (IS_PREVIEW) {
      setStatus('preview');
      setTimeout(() => setStatus(null), 4000);
      return;
    }
    setStatus('sending');
    const ok = await sendContactForm(form);
    setStatus(ok ? 'success' : 'error');
    if (ok) setForm({ name: '', contact: '', message: '' });
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <>
      <Reveal variant="blur" className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">{c.title}</h2>
      </Reveal>

      <RevealGroup as="ul" step={80} className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto mb-6">
        {channels.map((ch, i) => (
          <li key={ch.key} className="rv-item rv-pop" style={{ '--i': i }}>
            <a
              href={ch.href}
              target={ch.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`contact-tile group h-full flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 text-slate-400 ${ch.hover} hover:border-slate-500 transition-all hover:-translate-y-0.5`}
            >
              <i className={`${ch.icon} text-2xl w-7 text-center`} aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{c.channels[ch.key]}</span>
                <span className="block text-[11px] text-slate-500 truncate">{ch.value}</span>
              </span>
            </a>
          </li>
        ))}
      </RevealGroup>

      <Reveal variant="up" delay={250} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-4xl mx-auto mb-3">
        <button
          type="button"
          onClick={saveContact}
          className="px-5 py-3 rounded-xl border border-slate-600 hover:border-blue-500 text-slate-200 hover:text-white text-sm font-bold transition-all inline-flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-address-card" aria-hidden="true" />
          {c.saveContact}
        </button>
        <a
          href={SITE_URLS.services}
          target="_blank"
          rel="noopener noreferrer"
          className="services-link px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/30 hover:border-blue-400 text-sm transition-all inline-flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-briefcase text-blue-400" aria-hidden="true" />
          <span className="text-left">
            <span className="block font-bold text-white">{c.servicesLink} →</span>
            <span className="block text-[11px] text-slate-400">{c.servicesNote}</span>
          </span>
        </a>
      </Reveal>
      {note && <p className="text-center text-xs text-amber-400 mb-2">{note}</p>}

      <Reveal variant="up" className="max-w-lg mx-auto mt-12">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-xl font-bold text-center mb-4">{f.title}</h3>
        <label className="sr-only" htmlFor="cf-name">{f.namePlaceholder}</label>
        <input
          id="cf-name"
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={f.namePlaceholder}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <label className="sr-only" htmlFor="cf-contact">{f.contactPlaceholder}</label>
        <input
          id="cf-contact"
          type="text"
          required
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          placeholder={f.contactPlaceholder}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <label className="sr-only" htmlFor="cf-message">{f.messagePlaceholder}</label>
        <textarea
          id="cf-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={f.messagePlaceholder}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-paper-plane" aria-hidden="true" />
          {status === 'sending' ? f.sending : f.sendBtn}
        </button>
        <div aria-live="polite">
          {status === 'success' && <p className="text-center text-green-400 text-sm font-medium">{f.success}</p>}
          {status === 'error' && <p className="text-center text-red-400 text-sm font-medium">{f.error}</p>}
          {status === 'preview' && <p className="text-center text-amber-400 text-sm font-medium">{f.previewNotice}</p>}
        </div>
      </form>
      </Reveal>
    </>
  );
}
