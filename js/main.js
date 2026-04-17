/* ============================================
   Cumbre Expediciones — Main JavaScript
   Vanilla JS — no dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const scrollThreshold = 50;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    // Set initial state
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    }
  }


  // --- Mobile Menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // --- Hero Load Animation ---
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => {
      setTimeout(() => hero.classList.add('loaded'), 100);
    });
  }


  // --- Scroll Animations (Intersection Observer) ---
  const animatedElements = document.querySelectorAll('.fade-up, .slide-in-left, .scale-reveal');
  if (animatedElements.length > 0) {
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animObserver.observe(el));
  }


  // --- Stats Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }


  // --- Filter Buttons (Treks & Gallery) ---
  const filterGroups = document.querySelectorAll('.filter-group');

  filterGroups.forEach(group => {
    const buttons = group.querySelectorAll('.filter-btn');
    const filterKey = group.dataset.filterKey; // e.g. 'duration', 'difficulty', 'category'
    const gridSelector = group.dataset.grid; // e.g. '#trek-grid', '#gallery-grid'
    const grid = document.querySelector(gridSelector);

    if (!grid) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active — clicking active deselects to "all"
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
        } else {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }

        applyFilters(grid);
      });
    });
  });

  function applyFilters(grid) {
    if (!grid) return;

    const cards = grid.querySelectorAll('[data-duration], [data-difficulty], [data-category]');
    const activeFilters = {};

    // Gather active filters from all groups targeting this grid
    filterGroups.forEach(group => {
      if (document.querySelector(group.dataset.grid) === grid) {
        const active = group.querySelector('.filter-btn.active');
        if (active) {
          activeFilters[group.dataset.filterKey] = active.dataset.value;
        }
      }
    });

    cards.forEach(card => {
      let show = true;

      for (const [key, value] of Object.entries(activeFilters)) {
        if (card.dataset[key] !== value) {
          show = false;
          break;
        }
      }

      if (show) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }


  // --- Card Detail Expand (Treks) ---
  document.querySelectorAll('.detail-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      const details = card.querySelector('.card-details');

      if (!details) return;

      const isExpanded = details.classList.contains('expanded');

      // Close all other open details
      document.querySelectorAll('.card-details.expanded').forEach(d => {
        d.classList.remove('expanded');
        d.style.maxHeight = '0';
        const otherBtn = d.closest('.card').querySelector('.detail-toggle');
        if (otherBtn) otherBtn.textContent = 'View Details';
      });

      if (!isExpanded) {
        details.classList.add('expanded');
        details.style.maxHeight = details.scrollHeight + 'px';
        btn.textContent = 'Close Details';
      }
    });
  });


  // --- Gallery Lightbox ---
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryItems.length > 0) {
    let currentIndex = 0;
    let images = [];
    let touchStartX = 0;

    // Build overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
      <button class="lightbox-next" aria-label="Next">&#8250;</button>
      <img src="" alt="">
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(overlay);

    const lbImg = overlay.querySelector('img');
    const lbCaption = overlay.querySelector('.lightbox-caption');
    const lbClose = overlay.querySelector('.lightbox-close');
    const lbPrev = overlay.querySelector('.lightbox-prev');
    const lbNext = overlay.querySelector('.lightbox-next');

    function updateLightbox() {
      const item = images[currentIndex];
      if (!item) return;
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbCaption.textContent = item.caption;
    }

    function openLightbox(index) {
      // Rebuild images list from currently visible items
      images = [];
      document.querySelectorAll('.gallery-item:not(.hidden)').forEach(item => {
        const img = item.querySelector('img');
        images.push({
          src: img.dataset.full || img.src,
          alt: img.alt,
          caption: img.dataset.caption || img.alt
        });
      });

      currentIndex = index;
      updateLightbox();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + images.length) % images.length;
      updateLightbox();
    }

    // Click handlers
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        // Find index among visible items
        const visibleItems = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
        const visibleIndex = visibleItems.indexOf(item);
        openLightbox(visibleIndex >= 0 ? visibleIndex : i);
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => navigate(-1));
    lbNext.addEventListener('click', () => navigate(1));

    // Click outside image to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    // Touch swipe
    overlay.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        navigate(diff > 0 ? -1 : 1);
      }
    }, { passive: true });
  }


  // --- Contact Form Validation ---
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.classList.remove('error');
      });

      // Required fields
      const requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }
      });

      // Email validation
      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          emailField.classList.add('error');
          isValid = false;
        }
      }

      if (isValid) {
        contactForm.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.classList.add('visible');
      }
    });

    // Clear error on input
    contactForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });
  }


  // --- FAQ Accordion ---
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-content').style.maxHeight = '0';
      });

      // Open clicked (if it wasn't already open)
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

});
