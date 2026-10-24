'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Theme Toggle (Dark / Light mode)
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('malquda-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('malquda-theme', nextTheme);
    });
  }

  // 3. Mobile Sidebar Toggle
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');

  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', () => {
      const isActive = sidebar.classList.toggle('active');
      sidebarBtn.setAttribute('aria-expanded', String(isActive));
    });
  }

  // 4. Page Navigation (About, Experience, Publications)
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');
  const jumpButtons = document.querySelectorAll('[data-jump-page]');
  const brandLink = document.querySelector('[data-nav-target]');

  const switchPage = (targetPage) => {
    pages.forEach((page) => {
      const isMatch = page.dataset.page === targetPage;
      page.classList.toggle('active', isMatch);
    });

    navLinks.forEach((link) => {
      const isMatch = link.dataset.navLink === targetPage;
      link.classList.toggle('active', isMatch);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      switchPage(link.dataset.navLink);
    });
  });

  jumpButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchPage(btn.dataset.jumpPage);
    });
  });

  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage(brandLink.dataset.navTarget);
    });
  }

  // 5. Publications Topic Filter
  const filterPills = document.querySelectorAll('[data-pub-filter]');
  const pubCards = document.querySelectorAll('[data-pub-category]');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filterValue = pill.dataset.pubFilter;

      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      pubCards.forEach((card) => {
        const categories = (card.dataset.pubCategory || '').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
});
