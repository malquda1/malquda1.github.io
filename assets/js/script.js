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

  // 6. Photo Lightbox Modal (Supports avatar + travel photos)
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-caption h3') : null;
  const lightboxDesc = lightbox ? lightbox.querySelector('.lightbox-caption p') : null;

  const openLightboxWith = (src, alt, title, desc) => {
    if (!lightbox) return;
    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxDesc) lightboxDesc.textContent = desc || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const avatarWrapper = document.querySelector('.avatar-wrapper.clickable');
  if (avatarWrapper) {
    avatarWrapper.addEventListener('click', () => {
      openLightboxWith('./assets/images/IMG_4260_jpeg.jpg', 'Mohammad Alqudah, PhD - Portrait', 'Mohammad Alqudah, PhD', 'Principal Applied Scientist at Microsoft · Redmond, WA');
    });
    avatarWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightboxWith('./assets/images/IMG_4260_jpeg.jpg', 'Mohammad Alqudah, PhD - Portrait', 'Mohammad Alqudah, PhD', 'Principal Applied Scientist at Microsoft · Redmond, WA');
      }
    });
  }

  // Delegated click for travel photo cards
  document.querySelectorAll('[data-lightbox-src]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox-src');
      const title = el.getAttribute('data-lightbox-title');
      const desc = el.getAttribute('data-lightbox-desc');
      openLightboxWith(src, title, title, desc);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const src = el.getAttribute('data-lightbox-src');
        const title = el.getAttribute('data-lightbox-title');
        const desc = el.getAttribute('data-lightbox-desc');
        openLightboxWith(src, title, title, desc);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
});
