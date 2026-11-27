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

  // 5b. Flight Log Regional Filter
  const flightFilterBtns = document.querySelectorAll('[data-flight-filter]');
  const flightChips = document.querySelectorAll('[data-flight-region]');

  flightFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetRegion = btn.dataset.flightFilter;

      flightFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      flightChips.forEach((chip) => {
        const chipRegion = chip.dataset.flightRegion;
        if (targetRegion === 'all' || chipRegion === targetRegion) {
          chip.classList.remove('hidden');
        } else {
          chip.classList.add('hidden');
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

  // 7. Academic Lineage Interactive Graph & View Toggle
  const lineageVizShell = document.getElementById('lineage-viz-shell');
  const lineageTree = document.querySelector('.lineage-tree');
  const lineageSvg = document.getElementById('lineage-svg');
  const lineageInspector = document.getElementById('lineage-inspector');
  const lineageToggleBtns = document.querySelectorAll('[data-lineage-view]');

  if (lineageVizShell && lineageTree && lineageSvg && lineageInspector) {
    const nodeEls = Array.from(lineageTree.querySelectorAll('.lineage-node'));
    const nodes = nodeEls.map((el, idx) => {
      const gen = el.querySelector('.lineage-gen')?.textContent.trim() || `GEN ${idx + 1}`;
      const names = el.querySelector('.lineage-names')?.textContent.trim() || '';
      const meta = el.querySelector('.lineage-meta')?.textContent.trim() || '';
      const note = el.querySelector('.lineage-note')?.textContent.trim() || '';
      const linksHtml = el.querySelector('.lineage-links')?.innerHTML || '';
      const isMilestone = el.classList.contains('is-milestone');
      const isSelf = el.classList.contains('is-self');
      const hasCoAdvisor = names.includes('&');
      // Short label for SVG node
      const primary = names.split('&')[0].trim();
      const parts = primary.replace(/,\s*Jr\.?/i, '').split(' ');
      const shortName = parts.length > 2 ? `${parts[0][0]}. ${parts[parts.length - 1]}` : primary;
      const yearMatch = meta.match(/\d{4}/);
      const shortYear = yearMatch ? yearMatch[0] : (meta.includes('16th') ? '~1550' : meta.includes('19th') ? '~1810' : '—');
      return { idx, gen, names, shortName, meta, shortYear, note, linksHtml, isMilestone, isSelf, hasCoAdvisor };
    });

    // Era colors matching CSS tokens
    const getEraColor = (idx) => {
      if (idx <= 9) return '#6366f1';   // Renaissance (indigo)
      if (idx <= 18) return '#38bdf8';  // Calculus & Physics (sky)
      if (idx <= 24) return '#a855f7';  // Logic & CS (purple)
      return '#10b981';                 // ML & You (emerald)
    };

    // Serpentine layout: 5 rows (6, 5, 6, 5, 5)
    const rowCounts = [6, 5, 6, 5, 5];
    const rowYs = [85, 225, 365, 505, 645];
    const coords = [];
    let cursor = 0;

    rowCounts.forEach((count, r) => {
      const reverse = r % 2 === 1;
      const xStart = 95;
      const xEnd = 905;
      const step = (xEnd - xStart) / (count - 1);
      for (let c = 0; c < count; c++) {
        const x = reverse ? xEnd - c * step : xStart + c * step;
        coords.push({ x, y: rowYs[r], row: r, reverse });
        cursor++;
      }
    });

    let activeIdx = nodes.length - 1; // Default to GEN 27 (Mohammad Alqudah)

    const renderInspector = (idx) => {
      const n = nodes[idx];
      if (!n) return;
      lineageInspector.innerHTML = `
        <div class="lineage-inspector-top">
          <div class="lineage-node-main">
            <span class="lineage-gen">${n.gen}</span>
            <span class="lineage-names">${n.names}</span>
            <span class="lineage-meta">· ${n.meta}</span>
          </div>
          <div class="lineage-inspector-nav">
            <button class="lineage-step-btn" id="lineage-prev" aria-label="Previous generation" ${idx === 0 ? 'disabled' : ''}>
              <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
            <button class="lineage-step-btn" id="lineage-next" aria-label="Next generation" ${idx === nodes.length - 1 ? 'disabled' : ''}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
          </div>
        </div>
        ${n.note ? `<p class="lineage-note">${n.note}</p>` : ''}
        ${n.linksHtml ? `<div class="lineage-links">${n.linksHtml}</div>` : ''}
      `;

      document.getElementById('lineage-prev')?.addEventListener('click', () => selectNode(idx - 1));
      document.getElementById('lineage-next')?.addEventListener('click', () => selectNode(idx + 1));
    };

    const svgNS = 'http://www.w3.org/2000/svg';
    const makeEl = (tag, attrs = {}) => {
      const el = document.createElementNS(svgNS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    };

    const drawSvg = () => {
      lineageSvg.innerHTML = '';

      // 1. Draw connecting path segments between consecutive generations
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = coords[i];
        const b = coords[i + 1];
        const color = getEraColor(i + 1);
        let d;
        if (a.row === b.row) {
          d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
        } else {
          // Smooth U-turn curve on right or left edge
          const dir = a.x > 500 ? 1 : -1;
          const cx = a.x + dir * 68;
          d = `M ${a.x} ${a.y} C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;
        }
        lineageSvg.appendChild(makeEl('path', {
          d,
          fill: 'none',
          stroke: color,
          'stroke-width': '2.5',
          'stroke-opacity': '0.55',
          'stroke-linecap': 'round'
        }));
      }

      // 2. Draw co-advisor merge branches & nodes
      nodes.forEach((n, i) => {
        const { x, y } = coords[i];
        const color = getEraColor(i);

        if (n.hasCoAdvisor) {
          const bx = x - 22;
          const by = y - 34;
          lineageSvg.appendChild(makeEl('path', {
            d: `M ${bx} ${by} Q ${bx} ${y - 8}, ${x} ${y}`,
            fill: 'none',
            stroke: color,
            'stroke-width': '1.5',
            'stroke-dasharray': '3 3',
            'stroke-opacity': '0.6'
          }));
          lineageSvg.appendChild(makeEl('circle', {
            cx: bx,
            cy: by,
            r: '4',
            fill: color,
            opacity: '0.7'
          }));
        }

        const g = makeEl('g', {
          class: 'lineage-svg-node',
          tabindex: '0',
          role: 'button',
          'aria-label': `${n.gen}: ${n.names}`
        });

        const ring = makeEl('circle', {
          class: 'node-ring',
          cx: x,
          cy: y,
          r: i === activeIdx ? '16' : (n.isMilestone || n.isSelf ? '11' : '8'),
          fill: i === activeIdx ? color : 'none',
          'fill-opacity': i === activeIdx ? '0.18' : '0',
          stroke: color,
          'stroke-width': i === activeIdx ? '2' : '0'
        });

        const core = makeEl('circle', {
          class: 'node-core',
          cx: x,
          cy: y,
          r: n.isSelf ? '9' : (n.isMilestone ? '7.5' : '5.5'),
          fill: (n.isMilestone || n.isSelf || i === activeIdx) ? color : 'var(--bg-base)',
          stroke: color,
          'stroke-width': '2.5'
        });

        const label = makeEl('text', {
          class: 'lineage-svg-label',
          x: x,
          y: y + 24,
          'text-anchor': 'middle'
        });
        label.textContent = n.shortName;

        const year = makeEl('text', {
          class: 'lineage-svg-year',
          x: x,
          y: y + 38,
          'text-anchor': 'middle'
        });
        year.textContent = n.shortYear;

        g.appendChild(ring);
        g.appendChild(core);
        g.appendChild(label);
        g.appendChild(year);

        g.addEventListener('click', () => selectNode(i));
        g.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectNode(i);
          }
        });

        lineageSvg.appendChild(g);
      });
    };

    const selectNode = (idx) => {
      if (idx < 0 || idx >= nodes.length) return;
      activeIdx = idx;
      drawSvg();
      renderInspector(idx);
    };

    drawSvg();
    renderInspector(activeIdx);

    // Toggle between Graph View and List View
    lineageToggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.lineageView;
        lineageToggleBtns.forEach((b) => b.classList.toggle('active', b === btn));
        if (view === 'graph') {
          lineageVizShell.classList.remove('hidden');
          lineageTree.classList.add('hidden');
        } else {
          lineageVizShell.classList.add('hidden');
          lineageTree.classList.remove('hidden');
        }
      });
    });
  }
});
