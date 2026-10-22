import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const careerPath = fileURLToPath(new URL('./src/shared/career.json', import.meta.url));
const readCareer = () => JSON.parse(readFileSync(careerPath, 'utf-8'));

/**
 * 1) Публикует src/shared/career.json как /career.json — его подтягивает визитка.
 * 2) Вписывает в index.html структурированные данные (schema.org) с текущей должностью.
 */
function careerData() {
  return {
    name: 'career-data',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'career.json', source: readFileSync(careerPath, 'utf-8') });
    },
    transformIndexHtml(html) {
      const career = readCareer();
      const current = career.jobs.find((j) => !j.end);
      const person = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Kutman Omuraliev',
        alternateName: 'Омуралиев Кутман',
        jobTitle: current ? current.role.en : 'Data Analyst',
        ...(current ? { worksFor: { '@type': 'Organization', name: current.company.en } } : {}),
        address: { '@type': 'PostalAddress', addressLocality: 'Bishkek', addressCountry: 'KG' },
        url: 'https://kutya001.github.io/KutEmpResume/',
        image: 'https://kutya001.github.io/KutEmpResume/MyImage.jpeg',
        email: 'mailto:kutmanomuraliev012@gmail.com',
        knowsAbout: career.skills.filter((s) => s.level === 'advanced').map((s) => (typeof s.name === 'string' ? s.name : s.name.en)),
        sameAs: [
          'https://t.me/kutya_omuraliev',
          'https://github.com/kutya001',
          'https://www.instagram.com/_omuraliev_kutman_/',
          'https://kutya001.github.io/My-Services/',
        ],
      };
      return html.replace('<!--JSON_LD-->', `<script type="application/ld+json">${JSON.stringify(person)}</script>`);
    },
  };
}

export default defineConfig({
  base: '/KutEmpResume/',
  plugins: [react(), careerData()],
});
