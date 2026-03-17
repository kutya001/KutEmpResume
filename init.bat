@echo off
chcp 65001 >nul
setlocal DisableDelayedExpansion

:: Переход в директорию запуска скрипта для обхода проблем с путями
cd /d "%~dp0"

echo [i] Инициализация структуры проекта...

mkdir ".github\workflows" 2>nul
mkdir "public" 2>nul
mkdir "src" 2>nul

set "ps1=%temp%\generate_files.ps1"
:: Добавлено явное указание кодировки -Encoding UTF8 при чтении файла
> "%ps1%" echo $self = Get-Content ".\%~nx0" -Encoding UTF8 -Raw
>> "%ps1%" echo $files = "package.json", "vite.config.js", "tailwind.config.js", "postcss.config.js", "src\style.css", "src\main.js", "index.html", ".github\workflows\deploy.yml", ".gitignore"
>> "%ps1%" echo foreach ($f in $files) {
>> "%ps1%" echo     $escaped = [regex]::Escape($f)
>> "%ps1%" echo     $regex = "(?s)@BEGIN_$escaped\r?\n(.*?)\r?\n@END_$escaped"
>> "%ps1%" echo     if ($self -match $regex) {
>> "%ps1%" echo         $utf8NoBom = New-Object System.Text.UTF8Encoding $false
>> "%ps1%" echo         [IO.File]::WriteAllText($f, $matches[1], $utf8NoBom)
>> "%ps1%" echo         Write-Host " [+] Создан: $f"
>> "%ps1%" echo     }
>> "%ps1%" echo }

powershell -NoProfile -ExecutionPolicy Bypass -File "%ps1%"
del "%ps1%"

echo.
echo [v] Архитектура развернута.
echo.
echo Дальнейшие действия:
echo 1. Переместите MyImage.jpeg, kgc.jpg и другие локальные медиафайлы в папку public/
echo 2. Выполните: npm install
echo 3. Выполните: npm run dev
echo 4. Для деплоя зафиксируйте изменения в git (ветка main) и сделайте push.
echo.
pause
exit /b

@BEGIN_package.json
{
  "name": "kutman-resume",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.0"
  },
  "dependencies": {
    "chart.js": "^4.4.2"
  }
}
@END_package.json

@BEGIN_vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/KutEmpResume.github.io/',
});
@END_vite.config.js

@BEGIN_tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'flow': 'flowDash 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flowDash: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    }
  },
  plugins: [],
}
@END_tailwind.config.js

@BEGIN_postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
@END_postcss.config.js

@BEGIN_src\style.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --color-bg: #0f172a;
    --color-surface: #1e293b;
    --color-primary: #f8fafc;
    --color-secondary: #cbd5e1;
    --color-accent: #38bdf8;
    --color-text: #e2e8f0;
    --color-muted: #64748b;
    --grid-color: rgba(255, 255, 255, 0.05);
    --line-color: #334155;
}

[data-theme="light"] {
    --color-bg: #f8fafc;
    --color-surface: #ffffff;
    --color-primary: #0f172a;
    --color-secondary: #475569;
    --color-accent: #2563eb;
    --color-text: #1e293b;
    --color-muted: #94a3b8;
    --grid-color: rgba(15, 23, 42, 0.05);
    --line-color: #cbd5e1;
}

[data-theme="warm"] {
    --color-bg: #fdfbf7;
    --color-surface: #fffefb;
    --color-primary: #422006;
    --color-secondary: #78350f;
    --color-accent: #d97706;
    --color-text: #292524;
    --color-muted: #a8a29e;
    --grid-color: rgba(66, 32, 6, 0.05);
    --line-color: #e7e5e4;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--color-bg);
    color: var(--color-text);
    transition: background-color 0.5s, color 0.5s;
    overflow-x: hidden;
}

.glass-card {
    background: var(--color-surface);
    backdrop-filter: blur(12px);
    border: 1px solid var(--grid-color);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.bg-grid-pattern {
    background-image: 
        linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
    background-size: 40px 40px;
}

.bpmn-path {
    stroke: var(--line-color);
    stroke-width: 2;
    fill: none;
    stroke-dasharray: 10;
    animation: flowDash 30s linear infinite;
}

.reveal-text {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease-out;
}

.reveal-text.visible {
    opacity: 1;
    transform: translateY(0);
}

.skill-percent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--color-primary);
}

.active-nav {
    border-color: var(--color-accent) !important;
    color: var(--color-accent) !important;
    background-color: var(--color-surface);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.active-mobile-nav {
    background-color: var(--color-accent) !important;
    color: white !important;
    border-color: var(--color-accent) !important;
}

.contact-dropdown {
    transform-origin: top right;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(0.95);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}

.contact-dropdown.active {
    transform: scale(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}

.theme-btn.active {
    font-weight: 700;
    color: var(--color-primary);
    border-color: var(--color-accent);
}

@media (max-width: 768px) {
    .mobile-nav-slider {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .mobile-nav-slider::-webkit-scrollbar {
        display: none;
    }
}

#image-modal {
    transition: opacity 0.3s ease;
    backdrop-filter: blur(5px);
}

.bpmn-task {
    border-radius: 12px;
    border: 2px solid var(--color-text);
}

.job-hidden {
    display: none !important;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb { background: var(--color-muted); border-radius: 4px; }
@END_src\style.css

@BEGIN_src\main.js
import './style.css';
import Chart from 'chart.js/auto';

const jobs = [
    { role: 'Разработчик "Отчетность и Аналитика"', company: 'Кумтор Голд Компани', dates: 'Окт 2025 — Наст. время', desc: 'Исправление багов, написание программного кода, оптимизация процессов.', img: 'kgc.jpg', icon: 'fa-code' },
    { role: 'Бизнес-аналитик', company: 'Кумтор Голд Компани', dates: 'Авг 2023 — Окт 2025', desc: 'Анализ бизнес процессов, разработка и составление ТЗ, тестирование, документирование.', img: 'kgc.jpg', icon: 'fa-project-diagram' },
    { role: 'Ментор (Data Analysis)', company: 'CodeInfinity', dates: 'Июнь 2024 — Март 2025', desc: 'Обучение по Анализу данных: Excel, SQL, Power BI.', img: 'codeinfinity.png', icon: 'fa-chalkboard-teacher' },
    { role: 'Тренер-консультант', company: 'DenMar', dates: 'Фев 2023 — Янв 2025', desc: 'Преподавание уроков и проведение тренингов по MS Excel (Pro уровень).', img: 'denmar.png', icon: 'fa-file-excel' },
    { role: 'Ведущий специалист', company: 'Газпромнефть Азия', dates: 'Дек 2022 — Май 2023', desc: 'Управленческая отчетность: свод, консолидация информации, глубокий анализ данных.', img: 'gazprom.png', icon: 'fa-gas-pump' },
    { role: 'Тренер Excel', company: 'GoFare', dates: 'Июнь 2022 — Сен 2022', desc: 'Обучение студентов основам и продвинутому анализу данных в MS Excel.', img: 'gofare.png', icon: 'fa-graduation-cap' },
    { role: 'Бизнес аналитик', company: 'Текстиль Транс - Салкын', dates: 'Март 2021 — Май 2023', desc: 'Разработка отчётов, Power BI, Excel VBA. ТЗ для 1С программистов.', img: 'textiletrans.png', icon: 'fa-tshirt' },
    { role: 'Бизнес-аналитик', company: 'Маткасымов', dates: 'Окт 2021 — Март 2022', desc: 'Оптимизация производства, отчетность, расчет себестоимости.', img: 'matkasymov.png', icon: 'fa-store' },
    { role: 'Бухгалтер', company: 'Эквилибри Консалт', dates: 'Фев 2020 — Фев 2021', desc: 'Расчётный бухгалтер, помощник главного бухгалтера.', img: 'equilibri.png', icon: 'fa-calculator' }
];

window.setTheme = function(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    updateThemeButtons(themeName);
};

window.updateThemeButtons = function(activeTheme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.themeVal === activeTheme) btn.classList.add('active');
    });
};

window.toggleThemeMobile = function() {
    const current = localStorage.getItem('theme') || 'dark';
    let nextTheme = 'light';
    if (current === 'light') nextTheme = 'dark';
    else if (current === 'dark') nextTheme = 'warm';
    window.setTheme(nextTheme);
};

window.toggleContacts = function(source) {
    const id = source === 'mobile' ? 'contact-icons-mobile' : 'contact-icons';
    const el = document.getElementById(id);
    if (el) {
        const isActive = el.classList.toggle('active');
        const btn = document.querySelector(`button[onclick="toggleContacts('${source}')"]`);
        if(btn) btn.setAttribute('aria-expanded', isActive);
    }
};

window.showMoreJobs = function() {
    document.querySelectorAll('.job-hidden').forEach(el => {
        el.classList.remove('job-hidden');
    });
    const wrapper = document.getElementById('show-more-wrapper');
    if(wrapper) wrapper.style.display = 'none';
};

window.openModal = function(src) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('modal-img');
    img.src = src;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
};

window.closeModal = function() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    modal.setAttribute('aria-hidden', 'true');
};

function renderJobs() {
    const container = document.getElementById('experience-container');
    if(!container) return; 

    const jobsToShowInitial = 3;
    
    const html = jobs.map((job, index) => {
        const isHidden = index >= jobsToShowInitial ? 'job-hidden' : '';
        const alignLeft = index % 2 !== 0;

        const mobileLayout = `
            <div class="md:hidden flex gap-4 pl-4 relative pb-8">
                 <div class="absolute left-[29px] top-8 bottom-0 w-0.5 bg-gray-600" aria-hidden="true"></div>
                <div class="flex-shrink-0 w-3 h-3 bg-accent rounded-full mt-6 -ml-[22px] border-4 border-surface shadow-sm z-20" aria-hidden="true"></div>
                <div class="bg-surface p-5 rounded-xl border border-gray-600 shadow-sm w-full">
                    <span class="text-xs font-bold text-accent uppercase mb-1 block">${job.dates}</span>
                    <h3 class="font-bold text-lg text-primary">${job.role}</h3>
                    <div class="text-sm font-semibold text-secondary mb-2">${job.company}</div>
                    <p class="text-sm text-muted">${job.desc}</p>
                </div>
            </div>
        `;

        const desktopLayout = `
            <div class="hidden md:flex items-center justify-between group w-full">
                <div class="w-5/12 ${!alignLeft ? 'text-right pr-8' : 'text-left pl-8 order-last'}">
                    ${!alignLeft 
                        ? `<div class="bg-surface p-5 rounded-xl border border-gray-600 shadow-sm hover:border-accent transition-all relative">
                             <div class="absolute top-1/2 right-[-9px] w-4 h-4 bg-surface border-t border-r border-gray-600 transform rotate-45" aria-hidden="true"></div>
                             <h3 class="font-bold text-lg text-primary">${job.role}</h3>
                             <div class="text-sm font-semibold text-secondary mb-2">${job.company}</div>
                             <p class="text-sm text-muted leading-relaxed">${job.desc}</p>
                           </div>`
                        : `<div class="py-2 px-4 rounded-lg border-2 border-dashed border-gray-600 inline-block bg-surface/50">
                             <i class="far fa-clock text-accent mr-2" aria-hidden="true"></i> <span class="font-mono font-bold text-secondary text-sm">${job.dates}</span>
                           </div>`
                    }
                </div>

                <div class="flex-shrink-0 w-14 h-14 rounded-full bg-surface border-4 border-gray-600 shadow-md flex items-center justify-center relative cursor-pointer hover:scale-110 transition-transform z-20" onclick="openModal('${job.img}')" role="button" tabindex="0" aria-label="Увеличить логотип ${job.company}">
                    <div class="w-full h-full rounded-full overflow-hidden relative bg-white">
                        <img src="${job.img}" class="w-full h-full object-cover" alt="Логотип ${job.company}" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');">
                        <div class="hidden absolute inset-0 flex items-center justify-center bg-white text-secondary" aria-hidden="true">
                            <i class="fas ${job.icon} text-2xl"></i>
                        </div>
                    </div>
                    <div class="absolute top-1/2 -left-4 w-4 h-0.5 bg-gray-600" aria-hidden="true"></div>
                    <div class="absolute top-1/2 -right-4 w-4 h-0.5 bg-gray-600" aria-hidden="true"></div>
                </div>

                <div class="w-5/12 ${!alignLeft ? 'text-left pl-8' : 'text-right pr-8 order-first'}">
                     ${alignLeft 
                        ? `<div class="bg-surface p-5 rounded-xl border border-gray-600 shadow-sm hover:border-accent transition-all relative">
                             <div class="absolute top-1/2 left-[-9px] w-4 h-4 bg-surface border-l border-b border-gray-600 transform rotate-45" aria-hidden="true"></div>
                             <h3 class="font-bold text-lg text-primary">${job.role}</h3>
                             <div class="text-sm font-semibold text-secondary mb-2">${job.company}</div>
                             <p class="text-sm text-muted leading-relaxed">${job.desc}</p>
                           </div>`
                        : `<div class="py-2 px-4 rounded-lg border-2 border-dashed border-gray-600 inline-block bg-surface/50">
                             <i class="far fa-clock text-accent mr-2" aria-hidden="true"></i> <span class="font-mono font-bold text-secondary text-sm">${job.dates}</span>
                           </div>`
                    }
                </div>
            </div>
        `;
        
        return `<div class="relative z-10 reveal-text visible ${isHidden}">${mobileLayout}${desktopLayout}</div>`;
    }).join('');

    const centerLine = container.innerHTML; 
    container.innerHTML = centerLine + html; 
    
    const hiddenCount = jobs.length - jobsToShowInitial;
    const btnText = document.getElementById('show-more-text');
    if(btnText) btnText.innerText = `Показать ещё (${hiddenCount})`;
}

document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    window.setTheme(savedTheme);

    renderJobs();

    window.addEventListener('click', function(e) {
        const btnDesk = document.querySelector('button[onclick="toggleContacts(\'desktop\')"]');
        const dropDesk = document.getElementById('contact-icons');
        if (btnDesk && dropDesk && !btnDesk.contains(e.target) && !dropDesk.contains(e.target)) {
            dropDesk.classList.remove('active');
            btnDesk.setAttribute('aria-expanded', 'false');
        }
        
        const btnMob = document.querySelector('button[onclick="toggleContacts(\'mobile\')"]');
        const dropMob = document.getElementById('contact-icons-mobile');
        if (btnMob && dropMob && !btnMob.contains(e.target) && !dropMob.contains(e.target)) {
            dropMob.classList.remove('active');
            btnMob.setAttribute('aria-expanded', 'false');
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el));

    const sections = document.querySelectorAll('section');
    const desktopLinks = document.querySelectorAll('.nav-link-desktop');
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');

    window.addEventListener('scroll', () => {
        let current = '';
        if (window.scrollY < 100) current = '#about'; 
        else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 300)) current = '#' + section.getAttribute('id');
            });
        }

        desktopLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === current) link.classList.add('active-nav');
        });
        
        mobileLinks.forEach(link => {
            link.classList.remove('active-mobile-nav');
            if (link.getAttribute('href') === current) link.classList.add('active-mobile-nav');
        });
    });

    const createChart = (ctxId, color, value) => {
        const canvas = document.getElementById(ctxId);
        if(!canvas) return;
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Skill', 'Rest'],
                datasets: [{
                    data: [value, 100 - value],
                    backgroundColor: [color, 'rgba(148, 163, 184, 0.1)'],
                    borderWidth: 0,
                }]
            },
            options: {
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                animation: { animateScale: true, animateRotate: true }
            }
        });
    };

    const chartObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            createChart('chartPowerBI', '#f59e0b', 95);
            createChart('chartPython', '#3b82f6', 80);
            createChart('chartSQL', '#14b8a6', 90);
            createChart('chartExcel', '#16a34a', 100);
            chartObserver.disconnect();
        }
    }, { threshold: 0.1 }); 
    
    const skillsSection = document.getElementById('skills');
    if(skillsSection) chartObserver.observe(skillsSection);
});
@END_src\main.js

@BEGIN_index.html
<!DOCTYPE html>
<html lang="ru" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Резюме - Омуралиев Кутман | Data Analyst & BI Specialist</title>
    
    <meta name="description" content="Резюме Омуралиева Кутмана: Data Analyst, BI Specialist, Ментор. Опыт работы 6+ лет. Автоматизация бизнес-процессов, Power BI, SQL, Python.">
    <meta name="keywords" content="Data Analyst, BI Specialist, Business Analyst, Power BI, SQL, Python, Excel, Резюме, Кутман Омуралиев, Бишкек">
    <meta name="author" content="Омуралиев Кутман">
    
    <meta property="og:title" content="Омуралиев Кутман - Data Analyst & BI Specialist">
    <meta property="og:description" content="Превращаю сырые данные в готовые бизнес-решения и стратегии. Аналитика, дашборды, автоматизация.">
    <meta property="og:image" content="/MyImage.jpeg">
    <meta property="og:type" content="profile">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:url" content="https://kutya001.github.io/KutEmpResume.github.io/">
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-grid-pattern antialiased">

    <div id="image-modal" class="fixed inset-0 z-[100] bg-black/90 hidden items-center justify-center p-4" onclick="closeModal()" role="dialog" aria-modal="true" aria-label="Просмотр изображения">
        <button class="absolute top-4 right-4 text-white text-4xl hover:text-accent" aria-label="Закрыть окно просмотра изображения">&times;</button>
        <img id="modal-img" src="" class="max-w-full max-h-full rounded-lg shadow-2xl object-contain" alt="Увеличенное изображение профиля или компании">
    </div>

    <nav class="fixed top-0 w-full z-50 glass-card transition-all duration-300 shadow-sm border-b border-gray-100/20" aria-label="Главная навигация">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-between h-auto md:h-20 py-2 md:py-0">
                
                <div class="flex-shrink-0 flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                    <div class="flex items-center gap-3 cursor-pointer" onclick="window.scrollTo(0,0)" role="button" tabindex="0" aria-label="Вернуться наверх">
                        <div class="w-10 h-10 rounded-lg border-2 border-accent rotate-45 flex items-center justify-center bg-surface shadow-sm">
                             <div class="w-6 h-6 bg-accent/20 -rotate-45 rounded-full flex items-center justify-center">
                                 <span class="w-2 h-2 bg-accent rounded-full"></span>
                             </div>
                        </div>
                        <span class="font-bold text-xl text-primary tracking-tight font-mono">
                            Kutman Omuraliev
                        </span>
                    </div>
                    
                    <div class="flex items-center gap-2 md:hidden relative">
                        <button onclick="toggleThemeMobile()" class="w-9 h-9 rounded-full bg-surface text-secondary border border-gray-600 flex items-center justify-center shadow-md mr-1" aria-label="Переключить тему оформления">
                             <i class="fas fa-adjust text-sm" aria-hidden="true"></i>
                        </button>
                        
                        <div class="relative">
                            <button onclick="toggleContacts('mobile')" class="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center shadow-md" aria-haspopup="true" aria-expanded="false" aria-label="Открыть контакты">
                                <i class="fas fa-phone-alt text-sm" aria-hidden="true"></i>
                            </button>
                            <div id="contact-icons-mobile" class="contact-dropdown absolute top-full right-0 mt-3 w-64 bg-surface rounded-xl shadow-xl border border-gray-100 p-3 flex-col gap-2 z-50" role="menu">
                                <a href="https://wa.me/996500888268?text=Здравствуйте%20Кутман,%20по%20вашему%20резюме%20из%20GitHub.io" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-secondary hover:text-green-400 transition-colors" role="menuitem" aria-label="Написать в WhatsApp">
                                    <i class="fab fa-whatsapp text-lg w-6 text-center" aria-hidden="true"></i> WhatsApp
                                </a>
                                <a href="https://t.me/kutya_omuraliev" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-secondary hover:text-blue-400 transition-colors" role="menuitem" aria-label="Написать в Telegram">
                                    <i class="fab fa-telegram-plane text-lg w-6 text-center" aria-hidden="true"></i> Telegram
                                </a>
                                <a href="https://www.instagram.com/_omuraliev_kutman_/" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-secondary hover:text-pink-400 transition-colors" role="menuitem" aria-label="Перейти в Instagram">
                                    <i class="fab fa-instagram text-lg w-6 text-center" aria-hidden="true"></i> Instagram
                                </a>
                                <a href="tel:+996500888268" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-secondary hover:text-white transition-colors" role="menuitem" aria-label="Позвонить по телефону">
                                    <i class="fas fa-phone-alt text-lg w-6 text-center" aria-hidden="true"></i> +996 500 888 268
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="hidden md:flex items-center justify-center flex-1 mx-8 relative">
                    <div class="absolute w-full h-0.5 bg-gray-200/20 z-0 top-1/2 transform -translate-y-1/2"></div>
                    <div class="flex items-center gap-8 z-10 bg-transparent">
                         <a href="#about" onclick="window.scrollTo(0,0); return false;" class="nav-link-desktop bg-surface px-4 py-1.5 rounded-lg border border-gray-600 text-sm font-bold text-secondary hover:border-accent hover:text-accent hover:shadow-md transition-all uppercase tracking-wide">Обо мне</a>
                         <i class="fas fa-chevron-right text-gray-500 text-xs" aria-hidden="true"></i>
                         <a href="#experience" class="nav-link-desktop bg-surface px-4 py-1.5 rounded-lg border border-gray-600 text-sm font-bold text-secondary hover:border-accent hover:text-accent hover:shadow-md transition-all uppercase tracking-wide">Опыт</a>
                         <i class="fas fa-chevron-right text-gray-500 text-xs" aria-hidden="true"></i>
                         <a href="#skills" class="nav-link-desktop bg-surface px-4 py-1.5 rounded-lg border border-gray-600 text-sm font-bold text-secondary hover:border-accent hover:text-accent hover:shadow-md transition-all uppercase tracking-wide">Навыки</a>
                         <i class="fas fa-chevron-right text-gray-500 text-xs" aria-hidden="true"></i>
                         <a href="#education" class="nav-link-desktop bg-surface px-4 py-1.5 rounded-lg border border-gray-600 text-sm font-bold text-secondary hover:border-accent hover:text-accent hover:shadow-md transition-all uppercase tracking-wide">Образование</a>
                    </div>
                </div>

                <div class="hidden md:flex items-center gap-6">
                    <div class="flex items-center gap-4 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700" role="group" aria-label="Переключение цветовых тем">
                        <button onclick="setTheme('light')" class="theme-btn flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors" data-theme-val="light" aria-label="Светлая тема">
                            <div class="w-3 h-3 rounded-full bg-white border border-gray-300"></div> Белый
                        </button>
                        <button onclick="setTheme('dark')" class="theme-btn flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors" data-theme-val="dark" aria-label="Тёмная тема">
                            <div class="w-3 h-3 rounded-full bg-slate-900 border border-slate-500"></div> Тёмный
                        </button>
                        <button onclick="setTheme('warm')" class="theme-btn flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors" data-theme-val="warm" aria-label="Тёплая тема">
                            <div class="w-3 h-3 rounded-full bg-[#fdfbf7] border border-orange-200"></div> Тёплый
                        </button>
                    </div>

                    <div class="relative">
                        <button onclick="toggleContacts('desktop')" class="bg-accent hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all flex items-center gap-2" aria-haspopup="true" aria-expanded="false" aria-label="Открыть список контактов">
                            <i class="fas fa-paper-plane" aria-hidden="true"></i> Связаться
                        </button>
                        <div id="contact-icons" class="contact-dropdown absolute top-full right-0 mt-3 w-64 bg-surface rounded-xl shadow-xl border border-gray-600 p-3 flex-col gap-2 z-50" role="menu">
                             <a href="https://wa.me/996500888268?text=Здравствуйте%20Кутман,%20по%20вашему%20резюме%20из%20GitHub.io" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-secondary hover:text-green-400 transition-colors" role="menuitem" aria-label="Написать в WhatsApp">
                                <i class="fab fa-whatsapp text-lg w-6 text-center" aria-hidden="true"></i> WhatsApp
                            </a>
                            <a href="https://t.me/kutya_omuraliev" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-secondary hover:text-blue-400 transition-colors" role="menuitem" aria-label="Написать в Telegram">
                                <i class="fab fa-telegram-plane text-lg w-6 text-center" aria-hidden="true"></i> Telegram
                            </a>
                            <a href="https://www.instagram.com/_omuraliev_kutman_/" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-secondary hover:text-pink-400 transition-colors" role="menuitem" aria-label="Перейти в Instagram">
                                <i class="fab fa-instagram text-lg w-6 text-center" aria-hidden="true"></i> Instagram
                            </a>
                            <a href="tel:+996500888268" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-secondary hover:text-white transition-colors" role="menuitem" aria-label="Позвонить">
                                <i class="fas fa-phone-alt text-lg w-6 text-center" aria-hidden="true"></i> +996 500 888 268
                            </a>
                        </div>
                    </div>
                </div>

                <div class="md:hidden w-full overflow-x-auto mobile-nav-slider pb-2 mt-2">
                    <div class="flex items-center gap-4 px-1 min-w-max" role="navigation" aria-label="Дополнительная мобильная навигация">
                        <a href="#about" onclick="window.scrollTo(0,0); return false;" class="nav-link-mobile px-3 py-1 rounded-md border border-gray-600 text-xs font-bold text-secondary bg-surface transition-colors">Обо мне</a>
                        <div class="w-4 h-px bg-gray-500" aria-hidden="true"></div>
                        <a href="#experience" class="nav-link-mobile px-3 py-1 rounded-md border border-gray-600 text-xs font-bold text-secondary bg-surface transition-colors">Опыт</a>
                        <div class="w-4 h-px bg-gray-500" aria-hidden="true"></div>
                        <a href="#skills" class="nav-link-mobile px-3 py-1 rounded-md border border-gray-600 text-xs font-bold text-secondary bg-surface transition-colors">Навыки</a>
                        <div class="w-4 h-px bg-gray-500" aria-hidden="true"></div>
                        <a href="#education" class="nav-link-mobile px-3 py-1 rounded-md border border-gray-600 text-xs font-bold text-secondary bg-surface transition-colors">Образование</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <main class="pt-32 pb-20 overflow-hidden relative">
        <svg class="absolute top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-20 hidden md:block" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="50%" y1="100" x2="50%" y2="3000" class="bpmn-path" />
        </svg>

        <section id="about" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-32">
            <div class="flex flex-col md:flex-row items-center gap-10">
                <div class="relative group cursor-pointer w-full md:w-5/12 flex justify-center" onclick="openModal('MyImage.jpeg')" role="button" tabindex="0" aria-label="Увеличить фотографию профиля">
                    <div class="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-accent p-1 relative animate-float bg-surface">
                         <div class="w-full h-full rounded-full border border-dashed border-secondary p-2 overflow-hidden relative">
                             <img src="MyImage.jpeg" 
                                  class="w-full h-full rounded-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                                  alt="Фотография Омуралиева Кутмана"
                                  onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');">
                             <div class="hidden w-full h-full flex items-center justify-center bg-surface absolute inset-0 rounded-full" aria-hidden="true">
                                 <i class="fas fa-user-astronaut text-6xl text-secondary"></i>
                             </div>
                         </div>
                         <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-surface/90 backdrop-blur border border-gray-500 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></span>
                            <span class="text-xs font-mono font-bold text-text">Open to Work</span>
                         </div>
                    </div>
                </div>
                <div class="w-full md:w-7/12 text-center md:text-left">
                    <h1 class="text-3xl md:text-6xl font-extrabold text-primary tracking-tight mb-2 reveal-text leading-tight">
                        Омуралиев Кутман
                    </h1>
                    <p class="text-lg md:text-2xl text-accent font-mono mb-8 reveal-text flex flex-wrap justify-center md:justify-start gap-2" style="transition-delay: 100ms">
                        <span>Data Analyst</span> <span class="text-gray-500" aria-hidden="true">|</span> 
                        <span>BI Specialist</span> <span class="text-gray-500" aria-hidden="true">|</span> 
                        <span>Mentor</span>
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 reveal-text" style="transition-delay: 200ms">
                        <div class="bpmn-task bg-surface p-5 hover:border-accent hover:shadow-lg transition-all relative group text-left">
                            <div class="absolute -top-3 left-4 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">
                                <i class="fas fa-tasks mr-1" aria-hidden="true"></i> Миссия
                            </div>
                            <p class="text-sm text-secondary mt-2 leading-relaxed">
                                Превращаю сырые данные в готовые бизнес-решения и стратегии.
                            </p>
                        </div>
                        <div class="bpmn-task bg-surface p-5 hover:border-accent hover:shadow-lg transition-all relative group text-left">
                             <div class="absolute -top-3 left-4 bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-bold border border-purple-200">
                                <i class="fas fa-history mr-1" aria-hidden="true"></i> Опыт
                            </div>
                            <p class="text-sm text-secondary mt-2 leading-relaxed">
                                6+ лет общего стажа. 2.5+ года фокуса в Data Analysis & BI.
                            </p>
                        </div>
                        <div class="bpmn-task bg-surface p-5 hover:border-accent hover:shadow-lg transition-all relative group text-left">
                             <div class="absolute -top-3 left-4 bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-xs font-bold border border-teal-200">
                                <i class="fas fa-layer-group mr-1" aria-hidden="true"></i> Стек
                            </div>
                            <p class="text-sm text-secondary mt-2 leading-relaxed">
                                Power BI, SQL, Python и автоматизация процессов.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="experience" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
            <div class="text-center mb-16 reveal-text">
                <span class="text-accent font-mono text-xs tracking-[0.2em] uppercase border border-accent/20 px-3 py-1 rounded-full">Карьера</span>
                <h2 class="text-3xl md:text-4xl font-bold text-primary mt-4">Профессиональный путь</h2>
                <div class="w-px h-10 bg-gray-500 mx-auto mt-4" aria-hidden="true"></div>
                <div class="w-3 h-3 border-r border-b border-gray-500 rotate-45 mx-auto -mt-1.5" aria-hidden="true"></div>
            </div>

            <div class="relative space-y-12" id="experience-container">
                <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-600 md:-translate-x-1/2 z-0" aria-hidden="true"></div>
            </div>

            <div class="flex justify-center mt-12 relative z-10" id="show-more-wrapper">
                 <button onclick="showMoreJobs()" id="show-more-btn" class="bg-surface border border-gray-600 text-primary px-8 py-3 rounded-full hover:bg-accent hover:text-white hover:border-accent transition-all shadow-lg flex items-center gap-2 group" aria-label="Показать остальные места работы">
                     <span id="show-more-text">Показать ещё</span> <i class="fas fa-chevron-down group-hover:translate-y-1 transition-transform" aria-hidden="true"></i>
                 </button>
            </div>
        </section>

        <section id="skills" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
             <div class="text-center mb-16 reveal-text">
                <span class="text-accent font-mono text-xs tracking-[0.2em] uppercase border border-accent/20 px-3 py-1 rounded-full">Компетенции</span>
                <h2 class="text-3xl md:text-4xl font-bold text-primary mt-4">Технический стек</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                 <div class="glass-card p-6 rounded-2xl flex flex-col items-center reveal-text hover:-translate-y-2 transition-transform">
                    <div class="w-32 h-32 relative mb-4">
                        <canvas id="chartPowerBI" aria-label="Power BI: 95% владения" role="img"></canvas>
                        <div class="skill-percent" aria-hidden="true">95%</div>
                    </div>
                    <h3 class="font-bold text-lg text-primary">Power BI & DAX</h3>
                 </div>
                 <div class="glass-card p-6 rounded-2xl flex flex-col items-center reveal-text hover:-translate-y-2 transition-transform" style="transition-delay: 100ms">
                    <div class="w-32 h-32 relative mb-4">
                        <canvas id="chartPython" aria-label="Python: 80% владения" role="img"></canvas>
                        <div class="skill-percent" aria-hidden="true">80%</div>
                    </div>
                    <h3 class="font-bold text-lg text-primary">Python & Pandas</h3>
                 </div>
                 <div class="glass-card p-6 rounded-2xl flex flex-col items-center reveal-text hover:-translate-y-2 transition-transform" style="transition-delay: 200ms">
                    <div class="w-32 h-32 relative mb-4">
                        <canvas id="chartSQL" aria-label="SQL: 90% владения" role="img"></canvas>
                        <div class="skill-percent" aria-hidden="true">90%</div>
                    </div>
                    <h3 class="font-bold text-lg text-primary">SQL & DBs</h3>
                 </div>
                 <div class="glass-card p-6 rounded-2xl flex flex-col items-center reveal-text hover:-translate-y-2 transition-transform" style="transition-delay: 300ms">
                    <div class="w-32 h-32 relative mb-4">
                        <canvas id="chartExcel" aria-label="Excel: 100% владения" role="img"></canvas>
                        <div class="skill-percent" aria-hidden="true">100%</div>
                    </div>
                    <h3 class="font-bold text-lg text-primary">Excel & VBA</h3>
                 </div>
            </div>
            <div class="bg-surface p-8 rounded-2xl border border-gray-600 shadow-sm relative overflow-hidden group">
                <div class="absolute -right-10 -bottom-10 opacity-5 transform rotate-12 group-hover:rotate-45 transition-transform duration-700" aria-hidden="true">
                    <i class="fas fa-layer-group text-9xl text-accent"></i>
                </div>
                <h3 class="font-bold text-xl mb-8 text-primary flex items-center gap-2 border-b border-gray-600 pb-4">
                    <i class="fas fa-toolbox text-accent" aria-hidden="true"></i> Детализация навыков
                </h3>
                <div class="space-y-8">
                    <div>
                        <h4 class="text-sm font-bold text-muted uppercase tracking-wider mb-3">Продвинутый уровень</h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-800">Power BI</span>
                            <span class="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-800">Power Query</span>
                            <span class="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-800">АВС-анализ</span>
                            <span class="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-800">Анализ бизнес процессов</span>
                            <span class="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-800">Ms Excel VBA</span>
                            <span class="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-800">1С: УПП 8.3</span>
                            <span class="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-800">Draw.io</span>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-muted uppercase tracking-wider mb-3">Средний уровень</h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium border border-gray-600">SQL</span>
                            <span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium border border-gray-600">Python</span>
                            <span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium border border-gray-600">PostgreSQL</span>
                            <span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium border border-gray-600">Oracle PL/SQL</span>
                            <span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium border border-gray-600">MySQL</span>
                            <span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium border border-gray-600">ООП</span>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-muted uppercase tracking-wider mb-3">Базовый уровень</h4>
                        <div class="flex flex-wrap gap-2">
                             <span class="px-3 py-1 bg-gray-900 text-gray-500 rounded-lg text-sm font-medium border border-gray-700 opacity-80">Git</span>
                             <span class="px-3 py-1 bg-gray-900 text-gray-500 rounded-lg text-sm font-medium border border-gray-700 opacity-80">REST API</span>
                             <span class="px-3 py-1 bg-gray-900 text-gray-500 rounded-lg text-sm font-medium border border-gray-700 opacity-80">Docker</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="education" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 reveal-text">
            <div class="text-center mb-16">
                <span class="text-accent font-mono text-xs tracking-[0.2em] uppercase border border-accent/20 px-3 py-1 rounded-full">Знания</span>
                <h2 class="text-3xl md:text-4xl font-bold text-primary mt-4">Образование и Курсы</h2>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="space-y-6">
                    <h3 class="font-bold text-xl text-primary border-b border-gray-600 pb-2 mb-4"><i class="fas fa-graduation-cap text-accent mr-2" aria-hidden="true"></i> Академическое</h3>
                    <div class="bg-surface p-6 rounded-xl border-l-4 border-accent shadow-sm hover:translate-x-2 transition-transform duration-300">
                        <div class="flex flex-col justify-start items-start">
                             <h4 class="font-bold text-lg text-primary">БГУ</h4>
                             <p class="text-secondary text-sm font-medium mt-1">Бухгалтерия и аудит</p>
                             <div class="mt-2 flex items-center gap-2">
                                 <span class="bg-gray-700 text-gray-200 text-xs font-bold px-2 py-1 rounded">2024</span>
                                 <span class="text-xs text-muted">Неоконченное высшее</span>
                             </div>
                        </div>
                    </div>
                    <div class="bg-surface p-6 rounded-xl border-l-4 border-gray-500 shadow-sm hover:translate-x-2 transition-transform duration-300">
                        <div class="flex flex-col justify-start items-start">
                             <h4 class="font-bold text-lg text-primary">БФЭТ</h4>
                             <p class="text-secondary text-sm font-medium mt-1">Бухгалтерский учет, анализ и аудит (экономист)</p>
                             <div class="mt-2 flex items-center gap-2">
                                 <span class="bg-gray-700 text-gray-200 text-xs font-bold px-2 py-1 rounded">2020</span>
                                 <span class="text-xs text-muted">Неоконченное высшее</span>
                             </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-6">
                     <h3 class="font-bold text-xl text-primary border-b border-gray-600 pb-2 mb-4"><i class="fas fa-certificate text-accent mr-2" aria-hidden="true"></i> Курсы и Сертификаты</h3>
                     <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="bg-surface p-4 rounded-xl border border-gray-600 shadow-sm hover:border-accent hover:shadow-md transition-all group">
                            <div class="flex items-center justify-between mb-2">
                                <i class="fab fa-python text-2xl text-blue-500 group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                                <span class="text-xs font-bold text-gray-400">2023</span>
                            </div>
                            <h4 class="font-bold text-primary">Python Developer</h4>
                            <p class="text-xs text-secondary mt-1">Megacom IT School</p>
                        </div>
                        <div class="bg-surface p-4 rounded-xl border border-gray-600 shadow-sm hover:border-accent hover:shadow-md transition-all group">
                             <div class="flex items-center justify-between mb-2">
                                <i class="fas fa-database text-2xl text-red-500 group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                                <span class="text-xs font-bold text-gray-400">2022</span>
                            </div>
                            <h4 class="font-bold text-primary">Oracle PL/SQL</h4>
                            <p class="text-xs text-secondary mt-1">Megacom IT School</p>
                        </div>
                         <div class="bg-surface p-4 rounded-xl border border-gray-600 shadow-sm hover:border-accent hover:shadow-md transition-all group">
                             <div class="flex items-center justify-between mb-2">
                                <i class="fas fa-cube text-2xl text-yellow-600 group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                                <span class="text-xs font-bold text-gray-400">2021</span>
                            </div>
                            <h4 class="font-bold text-primary">1С Азы программирования</h4>
                            <p class="text-xs text-secondary mt-1">1С Като</p>
                        </div>
                        <div class="bg-surface p-4 rounded-xl border border-gray-600 shadow-sm hover:border-accent hover:shadow-md transition-all group">
                             <div class="flex items-center justify-between mb-2">
                                <i class="fas fa-chart-pie text-2xl text-green-600 group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                                <span class="text-xs font-bold text-gray-400">2021</span>
                            </div>
                            <h4 class="font-bold text-primary">Управленческий учет</h4>
                            <p class="text-xs text-secondary mt-1">CIPAEN</p>
                        </div>
                     </div>
                </div>
            </div>
        </section>
        
        <footer class="bg-surface border-t border-gray-600 mt-20 py-12">
            <div class="max-w-7xl mx-auto px-4 text-center">
                 <div class="flex justify-center items-center gap-3 mb-6">
                    <div class="w-8 h-8 rounded border-2 border-primary rotate-45 flex items-center justify-center" aria-hidden="true">
                         <div class="w-4 h-4 bg-primary -rotate-45"></div>
                    </div>
                    <span class="font-bold text-xl text-primary tracking-tight font-mono">Kutman Omuraliev</span>
                </div>
                <div class="flex justify-center space-x-8 mb-8" aria-label="Социальные сети">
                     <a href="https://t.me/kutya_omuraliev" target="_blank" class="text-gray-400 hover:text-blue-500 text-2xl transition-transform hover:-translate-y-1" aria-label="Профиль в Telegram"><i class="fab fa-telegram" aria-hidden="true"></i></a>
                     <a href="https://wa.me/996500888268" target="_blank" class="text-gray-400 hover:text-green-500 text-2xl transition-transform hover:-translate-y-1" aria-label="Чат в WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
                     <a href="https://www.instagram.com/_omuraliev_kutman_/" target="_blank" class="text-gray-400 hover:text-pink-600 text-2xl transition-transform hover:-translate-y-1" aria-label="Профиль в Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
                </div>
                <p class="text-muted text-sm">© 2026. Designed with Data Driven Mindset.</p>
            </div>
        </footer>
    </main>

    <script type="module" src="/src/main.js"></script>
</body>
</html>
@END_index.html

@BEGIN_.github\workflows\deploy.yml
name: Deploy static content to Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
@END_.github\workflows\deploy.yml

@BEGIN_.gitignore
node_modules/
dist/
dist-ssr/
*.local
.vscode/
.idea/
.DS_Store
@END_.gitignore