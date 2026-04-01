(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var header = document.getElementById('header');
  var backToTop = document.querySelector('.back-to-top');

  // Header scroll shadow
  function onScroll() {
    if (header) {
      if (window.scrollY > 60) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Hero carousel: prev/next, dots, swipe
  var heroTrack = document.getElementById('hero-track');
  var heroDotsContainer = document.getElementById('hero-dots');
  var heroPrev = document.querySelector('.hero-carousel-prev');
  var heroNext = document.querySelector('.hero-carousel-next');
  if (heroTrack && heroDotsContainer) {
    var slides = heroTrack.querySelectorAll('.hero-slide');
    var totalSlides = slides.length;
    var heroIndex = 0;
    /* % of track width = index/total — avoids rounded-px drift and horizontal “gap” between slides on iOS */
    function applyHeroTransform() {
      var pct = totalSlides ? (heroIndex * 100) / totalSlides : 0;
      heroTrack.style.transform = 'translate3d(-' + pct + '%,0,0)';
    }
    function setHeroSlide(i) {
      heroIndex = (i + totalSlides) % totalSlides;
      applyHeroTransform();
      heroDotsContainer.querySelectorAll('.hero-carousel-dot').forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === heroIndex);
        dot.setAttribute('aria-current', idx === heroIndex ? 'true' : 'false');
      });
    }
    var si;
    for (si = 0; si < slides.length; si++) {
      slides[si].style.removeProperty('flex');
      slides[si].style.removeProperty('width');
      slides[si].style.removeProperty('max-width');
    }
    heroTrack.style.removeProperty('transform');
    if (totalSlides) {
      for (var d = 0; d < totalSlides; d++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hero-carousel-dot' + (d === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (d + 1));
        dot.setAttribute('aria-current', d === 0 ? 'true' : 'false');
        dot.addEventListener('click', function (idx) { return function () { setHeroSlide(idx); }; }(d));
        heroDotsContainer.appendChild(dot);
      }
    }
    setHeroSlide(0);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(applyHeroTransform);
    });
    window.addEventListener('resize', function () {
      applyHeroTransform();
    }, { passive: true });
    window.addEventListener('orientationchange', function () {
      setTimeout(applyHeroTransform, 200);
    });
    if (heroPrev) heroPrev.addEventListener('click', function () { setHeroSlide(heroIndex - 1); });
    if (heroNext) heroNext.addEventListener('click', function () { setHeroSlide(heroIndex + 1); });
    var heroTouchStartX = 0;
    heroTrack.addEventListener('touchstart', function (e) { heroTouchStartX = e.touches[0].clientX; }, { passive: true });
    heroTrack.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - heroTouchStartX;
      if (Math.abs(dx) > 50) setHeroSlide(dx > 0 ? heroIndex - 1 : heroIndex + 1);
    }, { passive: true });
  }

  // Scroll-spy: highlight nav link for current section
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = [];
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.indexOf('#') === 0) {
      var id = href.slice(1);
      var section = document.getElementById(id);
      if (section) sections.push({ id: id, link: link, section: section });
    }
  });
  function updateActiveNav() {
    var scrollY = window.scrollY;
    var viewportMid = scrollY + window.innerHeight * 0.35;
    var active = null;
    sections.forEach(function (item) {
      var top = item.section.offsetTop;
      var height = item.section.offsetHeight;
      if (viewportMid >= top && viewportMid <= top + height) active = item.link;
    });
    sections.forEach(function (item) {
      item.link.classList.toggle('is-active', item.link === active);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav);
  updateActiveNav();

  // Mobile menu
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.nav-list a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav && window.innerWidth <= 768) {
        nav.classList.remove('is-open');
      }
    });
  });

  // How it works: Learn more → 3-step guide (replaces hero row)
  var howLearnMore = document.getElementById('how-learn-more-btn');
  var howHero = document.getElementById('how-split-hero');
  var howSteps = document.getElementById('how-split-steps');
  var howStepsClose = document.getElementById('how-steps-close');
  if (howLearnMore && howHero && howSteps) {
    howLearnMore.addEventListener('click', function () {
      howHero.setAttribute('hidden', '');
      howSteps.removeAttribute('hidden');
      howLearnMore.setAttribute('aria-expanded', 'true');
      if (howStepsClose) {
        howStepsClose.focus();
      }
      howSteps.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  if (howStepsClose && howHero && howSteps && howLearnMore) {
    howStepsClose.addEventListener('click', function () {
      howSteps.setAttribute('hidden', '');
      howHero.removeAttribute('hidden');
      howLearnMore.setAttribute('aria-expanded', 'false');
      howLearnMore.focus();
    });
  }

  // Stats strip: count-up animation when in view
  var statsStrip = document.getElementById('stats-strip');
  var statValues = document.querySelectorAll('.stat-value[data-count]');
  function animateValue(el, end, suffix, duration) {
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 2);
      var current = Math.round(easeOut * end);
      el.textContent = current + (suffix || '');
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if (statsStrip && statValues.length && 'IntersectionObserver' in window) {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var statsObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          statValues.forEach(function (el) {
            var end = parseInt(el.getAttribute('data-count'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            if (isNaN(end)) return;
            if (prefersReducedMotion) {
              el.textContent = end + suffix;
            } else {
              animateValue(el, end, suffix, 1200);
            }
          });
          statsObs.disconnect();
        });
      },
      { threshold: 0.3 }
    );
    statsObs.observe(statsStrip);
  }

  // Feature cards: click or Enter/Space to expand/collapse
  document.querySelectorAll('[data-feature]').forEach(function (card) {
    function toggleExpand() {
      var expanded = card.classList.toggle('is-expanded');
      card.setAttribute('aria-expanded', expanded);
    }
    card.addEventListener('click', toggleExpand);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpand();
      }
    });
    card.setAttribute('aria-expanded', 'false');
  });

  // Scroll: animate-in elements
  var animateEls = document.querySelectorAll('.animate-in');
  if (animateEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );
    animateEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animateEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // App screens gallery: prev/next, dots, click to focus
  var appTrack = document.getElementById('app-screens-track');
  var appDots = document.getElementById('app-screens-dots');
  var appCards = document.querySelectorAll('[data-app-screen]');
  var appPrev = document.querySelector('.app-screens-prev');
  var appNext = document.querySelector('.app-screens-next');

  if (appTrack && appCards.length) {
    function scrollToIndex(index) {
      var i = Math.max(0, Math.min(index, appCards.length - 1));
      appCards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setFocused(i);
    }
    function setFocused(index) {
      appCards.forEach(function (card, i) {
        card.classList.toggle('is-focused', i === index);
      });
      if (appDots) {
        appDots.querySelectorAll('.app-screens-dot').forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }
    }
    function updateFromScroll() {
      var trackRect = appTrack.getBoundingClientRect();
      var center = trackRect.left + trackRect.width / 2;
      var best = 0;
      var bestDist = 1e9;
      appCards.forEach(function (card, i) {
        var r = card.getBoundingClientRect();
        var cardCenter = r.left + r.width / 2;
        var dist = Math.abs(cardCenter - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setFocused(best);
    }
    if (appDots) {
      for (var d = 0; d < appCards.length; d++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'app-screens-dot' + (d === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to screen ' + (d + 1));
        (function (idx) {
          dot.addEventListener('click', function () { scrollToIndex(idx); });
        })(d);
        appDots.appendChild(dot);
      }
    }
    if (appPrev) appPrev.addEventListener('click', function () {
      var idx = Array.prototype.indexOf.call(appCards, document.querySelector('.app-screen-card.is-focused'));
      if (idx < 0) idx = 0;
      scrollToIndex(idx - 1);
    });
    if (appNext) appNext.addEventListener('click', function () {
      var idx = Array.prototype.indexOf.call(appCards, document.querySelector('.app-screen-card.is-focused'));
      if (idx < 0) idx = 0;
      scrollToIndex(idx + 1);
    });
    appCards.forEach(function (card, i) {
      card.addEventListener('click', function () { scrollToIndex(i); });
    });
    appTrack.addEventListener('scroll', function () {
      clearTimeout(appTrack._scrollTimer);
      appTrack._scrollTimer = setTimeout(updateFromScroll, 100);
    });
    setFocused(0);
  }

  // FAQ accordion: toggle open/close
  document.querySelectorAll('[data-faq]').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        var isOpen = item.classList.toggle('is-open');
        question.setAttribute('aria-expanded', isOpen);
      });
    }
  });

  // Contact form submission
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      var submitBtn = contactForm.querySelector('.btn-submit');
      var originalText = submitBtn.innerHTML;
      
      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Sending...';
      
      // Hide previous status
      formStatus.classList.remove('show', 'success', 'error');
      
      // Get form data
      var formData = {
        name: contactForm.querySelector('#contact-name').value,
        email: contactForm.querySelector('#contact-email').value,
        subject: contactForm.querySelector('#contact-subject').value,
        message: contactForm.querySelector('#contact-message').value
      };
      
      // Simulate form submission (replace with actual API call)
      setTimeout(function () {
        // For demo purposes, always show success
        // In production, replace this with actual fetch/XMLHttpRequest to your backend
        var success = true;
        
        if (success) {
          formStatus.textContent = 'Thank you for your message! We\'ll get back to you within 24 hours.';
          formStatus.classList.add('show', 'success');
          contactForm.reset();
        } else {
          formStatus.textContent = 'Sorry, something went wrong. Please try again or email us directly.';
          formStatus.classList.add('show', 'error');
        }
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Auto-hide success message after 5 seconds
        if (success) {
          setTimeout(function () {
            formStatus.classList.remove('show');
          }, 5000);
        }
      }, 1500);
    });
  }
})();
