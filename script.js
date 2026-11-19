'use strict';

/* 01. Theme: dark by default; remember the user's selection if possible. */
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');

function applyTheme(theme) {
    const isLight = theme === 'light';
    root.dataset.theme = isLight ? 'light' : 'dark';
    themeButton.setAttribute('aria-pressed', String(isLight));
    themeButton.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeButton.querySelector('span').textContent = isLight ? '☾' : '☀';
}

let savedTheme;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { /* Storage may be disabled. */ }
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton.hidden = false;
themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(theme);
    try { localStorage.setItem('portfolio-theme', theme); } catch (_) { /* Theme still works. */ }
});

/* 02. Mobile navigation: keyboard and screen-reader friendly. */
const navigation = document.querySelector('.navigation');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function setMenu(open) {
    navLinks.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
}

navigation.classList.add('enhanced');
menuButton.hidden = false;
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
    }
});

/* 03. Project filters. Case studies use native HTML details/summary. */
const filterBar = document.querySelector('.filter-bar');
const filters = Array.from(document.querySelectorAll('[data-filter]'));
const projects = Array.from(document.querySelectorAll('.project-card'));
const projectCount = document.querySelector('#project-count');

function filterProjects(language) {
    let count = 0;
    for (const project of projects) {
        const matches = language === 'all' || project.dataset.language === language;
        project.hidden = !matches;
        if (matches) count++;
    }
    for (const button of filters) {
        button.setAttribute('aria-pressed', String(button.dataset.filter === language));
    }
    projectCount.textContent = `${String(count).padStart(2, '0')} ${count === 1 ? 'project' : 'projects'}`;
}
filterBar.hidden = false;
for (const button of filters) {
    button.addEventListener('click', () => filterProjects(button.dataset.filter));
}
