import { IS_PREVIEW, getTrafficSource, sessionStore } from './shared/site';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZryXC1jHMrRt_u8GJbtwexF-OVWaXLCfxbC6wBglLnGukZ7fmRh9ilrZJYWSp2e8X/exec';

const post = (payload) =>
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });

/**
 * Уведомление «резюме открыли». IP и геолокация больше не собираются:
 * город примерно виден по часовому поясу, а источник — по метке ?src= в ссылке
 * (например ?src=hh, ?src=tg, ?src=linkedin).
 */
export function notifyResumeView() {
  if (IS_PREVIEW || sessionStore.get('resume_viewed')) return;
  const src = getTrafficSource();
  const referrer = document.referrer || 'Прямой заход (или Instagram DM/Story)';
  const payload = {
    time: new Date().toLocaleTimeString('ru-RU'),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ua: navigator.userAgent,
    ref: src ? `src=${src} · ${referrer}` : referrer,
    utm_source: src,
    screen: `${window.screen.width}x${window.screen.height}`,
    resumeText: 'Твое резюме открыли!',
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio || 1,
    cores: navigator.hardwareConcurrency || 0,
    memory: navigator.deviceMemory || null,
    language: navigator.language || 'ru-RU',
    languages: (navigator.languages || []).join(','),
    platform: navigator.platform || '',
    url: window.location.href,
    city: '—',
    country: '—',
    ip: 'не собирается',
    provider: '—',
  };
  post(payload)
    .then(() => sessionStore.set('resume_viewed', 'true'))
    .catch(() => {});
}

export async function sendContactForm(form) {
  if (IS_PREVIEW) return false;
  try {
    await post({
      type: 'contact_form',
      name: form.name,
      contact: form.contact,
      message: form.message,
      source: getTrafficSource(),
      time: new Date().toLocaleString('ru-RU'),
    });
    return true;
  } catch {
    return false;
  }
}
