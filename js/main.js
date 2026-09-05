document.addEventListener('DOMContentLoaded', () => {
  // 0. Initial Page Loader Screen
  initLoader();
  
  // 0.2 Smooth Scroll Engine (Lenis)
  initLenis();

  // 0.5 Page Transitions
  initPageTransitions();

  // 1. Theme Toggle System
  initTheme();

  // 2. Audio Pronunciation
  initPronunciation();

  // 4. Contact Form Handler (For contact.html)
  initContactForm();

  // 5. Active Link Indicator, Smooth Scroll & Visual Reading Indicator
  initNavLinks();
  initSmoothScroll();
  initScrollSpy();
  initScrollProgress();

  // 6. Canvas Waves Background
  initWaves();

  // 7. Typing Text Animation
  initTypingEffect();

  // 8. Mobile Navigation Menu
  initMobileMenu();

  // 9. Facts Cards Flip Animation
  initFactsFlip();

  // 10. Custom Cursor System
  initCustomCursor();

  // 11. Scroll Reveal
  initScrollReveal();
  initGalleryReveal();

  // 12. Glow Cards
  initGlowCards();

  // 13. Stats Animation
  initStats();

  // 15. Scroll Arrow (About Page)
  initScrollArrow();

  // 17. Interactive About Me Cursor Reveal
  initAboutReveal();
});

/**
 * Initialize Glow Cards by syncing pointer coordinates to CSS variables
 */
function initGlowCards() {
  const cards = document.querySelectorAll('.trait-card[data-glow]');
  if (cards.length === 0) return;

  const syncPointer = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    cards.forEach((card) => {
      card.style.setProperty('--x', x.toFixed(2));
      card.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
      card.style.setProperty('--y', y.toFixed(2));
      card.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
    });
  };

  document.addEventListener('pointermove', syncPointer);
}



/**
 * Initialize theme based on local storage or user preference.
 */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn || !icon) return;

  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  const isLight = currentTheme === 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);
  btn.classList.toggle('light', isLight);
  document.body.classList.toggle('light-mode', isLight);
  icon.className = isLight ? 'ti ti-sun' : 'ti ti-moon';

  btn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    const activeLight = newTheme === 'light';

    btn.classList.toggle('light', activeLight);
    document.body.classList.toggle('light-mode', activeLight);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);

    setTimeout(() => {
      icon.className = activeLight ? 'ti ti-sun' : 'ti ti-moon';
    }, 200);
  });
}

/**
 * Pronounce name using Text-to-Speech Web API
 */
function initPronunciation() {
  const pronounceBtn = document.getElementById('pronounce-name-btn');
  if (!pronounceBtn) return;

  pronounceBtn.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
      // If already speaking, cancel it
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        pronounceBtn.classList.remove('speaking');
        return;
      }

      const utterance = new SpeechSynthesisUtterance('Mohit Roscen');

      // Let's configure a premium sounding configuration
      utterance.rate = 0.9; // Slightly slower for clear pronunciation
      utterance.pitch = 1.05; // Friendly pitch

      // Try to find a high quality English voice if available
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(voice => voice.lang.includes('en-') && voice.name.includes('Google'))
        || voices.find(voice => voice.lang.includes('en-'))
        || voices[0];

      if (engVoice) utterance.voice = engVoice;

      utterance.onstart = () => {
        pronounceBtn.classList.add('speaking');
      };

      utterance.onend = () => {
        pronounceBtn.classList.remove('speaking');
      };

      utterance.onerror = () => {
        pronounceBtn.classList.remove('speaking');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  });
}



/**
 * Handle form inputs, floating labels, validation, and submission
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Dynamically load dependencies if not present
  if (typeof emailjs === 'undefined') {
    const s1 = document.createElement('script');
    s1.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s1.onload = () => emailjs.init({ publicKey: "MIFwj3191Sv2I8mJx" });
    document.head.appendChild(s1);
  }
  if (typeof confetti === 'undefined') {
    const s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
    document.head.appendChild(s2);
  }

  const formInputs = form.querySelectorAll('.form-control');
  const successBanner = document.getElementById('form-success');

  // Input states & dynamic label behaviors
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateInput(input);
    });

    // Remove error class on keypress/input typing
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group.classList.contains('has-error')) {
        group.classList.remove('has-error');
      }
    });
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    formInputs.forEach(input => {
      const isValid = validateInput(input);
      if (!isValid) isFormValid = false;
    });

    if (!isFormValid) return;

    // Send message using EmailJS
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 1rem; height: 1rem; animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
        <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor"></path>
      </svg>
      Sending message...
    `;

    // Inline CSS for keyframes if not defined
    if (!document.getElementById('spin-keyframes')) {
      const style = document.createElement('style');
      style.id = 'spin-keyframes';
      style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    // Config details
    const serviceID = 'service_or1f0xl';
    const adminTemplateID = 'template_iwybiou';
    const autoReplyTemplateID = 'template_8srw51d';
    const publicKey = 'MIFwj3191Sv2I8mJx';

    // Gather template parameters from the form inputs
    const templateParams = {
      from_name: document.getElementById("name").value,
      from_email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    // 1. Send Admin Notification (Sends message details to YOU)
    emailjs.send(serviceID, adminTemplateID, templateParams, publicKey)
      .then((response) => {
        console.log('Admin notified!', response.status);

        // 2. Send Auto-Reply (Sends "Thank you" email to the VISITOR)
        return emailjs.send(serviceID, autoReplyTemplateID, templateParams, publicKey);
      })
      .then((response) => {
        console.log('Auto-reply sent to visitor!', response.status);

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Clear form inputs
        form.reset();

        // Display success banners
        if (successBanner) {
          successBanner.style.display = 'block';
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Fire white, black, and blue paper shower
        if (typeof confetti === 'function') {
          const duration = 2.3 * 1000;
          const end = Date.now() + duration;

          (function frame() {
            confetti({
              particleCount: 3,
              angle: 60,
              spread: 55,
              origin: { x: 0, y: 0.8 },
              colors: ['#ffffff', '#1a1a1a', '#0ea5e9']
            });
            confetti({
              particleCount: 3,
              angle: 120,
              spread: 55,
              origin: { x: 1, y: 0.8 },
              colors: ['#ffffff', '#1a1a1a', '#0ea5e9']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          }());
        }

        // Automatically hide banner after 5 seconds
        setTimeout(() => {
          if (successBanner) successBanner.style.display = 'none';
        }, 5000);
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alert('Failed to send message. Please ensure your EmailJS configurations are set correctly in js/main.js.');
      });
  });
}

function validateInput(input) {
  const group = input.closest('.form-group');
  const errorMsg = group.querySelector('.form-error-msg');
  let isValid = true;
  let message = "";

  if (input.hasAttribute('required') && input.value.trim() === '') {
    isValid = false;
    message = "This field is required.";
  } else if (input.type === 'email' && input.value.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      isValid = false;
      message = "Please enter a valid email address.";
    }
  } else if (input.id === 'message' && input.value.trim().length > 0 && input.value.trim().length < 10) {
    isValid = false;
    message = "Message must be at least 10 characters long.";
  }

  if (!isValid) {
    group.classList.add('has-error');
    if (errorMsg) errorMsg.textContent = message;
  } else {
    group.classList.remove('has-error');
  }

  return isValid;
}

/**
 * Dynamically wraps nav-link text in spans for sliding animation (Option C)
 */
function initNavLinks() {
  // Disabled: Nav links now use HTML structure with icons
}

/**
 * 0.2 Initialize Lenis Smooth Scroll Engine (Seamless bidirectional scrolling)
 */
let lenisInstance = null;
let lenisRafId = null;

function initLenis() {
  if (typeof Lenis === 'undefined') return null;

  if (window.lenis && typeof window.lenis.destroy === 'function') {
    window.lenis.destroy();
  }
  if (lenisRafId) {
    cancelAnimationFrame(lenisRafId);
    lenisRafId = null;
  }

  const lenis = new Lenis({
    lerp: 0.052,          // Slow-motion, liquid cinematic drift & damping
    wheelMultiplier: 1.22, // High-speed momentum on fast scrolls
    touchMultiplier: 2.0,  // Fast responsive touch glide
    smoothWheel: true,
    smoothTouch: true,
    syncTouch: false,
    autoResize: true,
  });

  window.lenis = lenis;
  lenisInstance = lenis;

  function raf(time) {
    lenis.raf(time);
    lenisRafId = requestAnimationFrame(raf);
  }
  lenisRafId = requestAnimationFrame(raf);
  return lenis;
}

/**
 * Smooth scroll navigation for anchor links and mobile menu auto-close
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.dataset.scrollBound) return;
    anchor.dataset.scrollBound = "true";

    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        // Close sidebar drawer if open
        const menuToggle = document.getElementById('menu-toggle');
        if (document.body.classList.contains('drawer-open')) {
          document.body.classList.remove('drawer-open');
          if (menuToggle) menuToggle.classList.remove('open');
        }

        if (window.lenis) {
          window.lenis.scrollTo(targetEl, { offset: -80, duration: 1.4 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }

        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });
}

/**
 * Automatically updates active state for desktop nav links and drawer menu links
 * based on scroll position (index.html sections) and current page route.
 */
function initScrollSpy() {
  const desktopLinks = document.querySelectorAll('.desktop-nav-links .desktop-nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-menu-link');
  const sections = document.querySelectorAll('section[id], footer[id="contact"]');

  function determineActiveSection() {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    // Check if on dedicated pages
    if (path.includes('about')) return 'about';
    if (path.includes('contact')) return 'contact';
    if (path.includes('project')) return 'projects';

    // If on single-page scroll view (index.html or root /)
    if (sections.length > 0) {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Bottom of page -> contact
      if (scrollY + windowHeight >= docHeight - 100) {
        return 'contact';
      }

      // Check section bounding rects relative to viewport trigger line (35% from top)
      let activeId = '';
      const triggerY = windowHeight * 0.35;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          activeId = section.getAttribute('id');
        }
      });

      if (activeId) return activeId;
      if (hash) return hash.replace('#', '');

      // Top of page (< 200px) -> home
      if (scrollY < 200) {
        return 'home';
      }
    }

    return 'home';
  }

  function updateActiveNav() {
    const activeSection = determineActiveSection();

    // Update Desktop Nav Links
    desktopLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      const text = (link.textContent || '').trim().toLowerCase();

      let isActive = false;
      if (activeSection === 'about' && (href.includes('about') || text === 'about')) {
        isActive = true;
      } else if ((activeSection === 'projects' || activeSection === 'work') && (href.includes('project') || href.includes('work') || text === 'work')) {
        isActive = true;
      } else if (activeSection === 'contact' && (href.includes('contact') || text === 'contact')) {
        isActive = true;
      }

      link.classList.toggle('active', isActive);
    });

    // Update Drawer Menu Links
    drawerLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      const text = (link.textContent || '').trim().toLowerCase();

      let isActive = false;
      if (activeSection === 'home' && (href.includes('home') || text.includes('home'))) {
        isActive = true;
      } else if (activeSection === 'about' && (href.includes('about') || text.includes('about') || text.includes('experience'))) {
        isActive = true;
      } else if ((activeSection === 'projects' || activeSection === 'work') && (href.includes('project') || href.includes('work') || text.includes('work') || text.includes('project'))) {
        isActive = true;
      } else if (activeSection === 'contact' && (href.includes('contact') || text.includes('contact'))) {
        isActive = true;
      }

      link.classList.toggle('active', isActive);
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  if (window._scrollSpyHandler) {
    window.removeEventListener('scroll', window._scrollSpyHandler);
  }
  window._scrollSpyHandler = onScroll;

  if (window.lenis) {
    window.lenis.on('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateActiveNav, { passive: true });
  window.addEventListener('hashchange', updateActiveNav);

  updateActiveNav();
}

/**
 * Highlights active page link in navigation menu (legacy fallback)
 */
function highlightActiveLink() {
  initScrollSpy();
}

/**
 * Visual Reading Indicator: Real-time track of scroll progress (fills down on scrolling)
 */
function initScrollProgress() {
  const thumb = document.getElementById('scrollProgressThumb');
  if (!thumb) return;

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

    // Line fills down from top as you scroll (minimum 5% visible at top)
    const pct = Math.max(5, Math.min(100, Math.round(progress * 100)));
    thumb.style.height = `${pct}%`;
  }

  updateProgress();

  if (window._scrollProgressUpdate) {
    window.removeEventListener('scroll', window._scrollProgressUpdate);
    window.removeEventListener('resize', window._scrollProgressUpdate);
  }
  window._scrollProgressUpdate = updateProgress;

  if (window.lenis) {
    window.lenis.on('scroll', updateProgress);
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

/**
 * Initialize dynamic diagonal canvas waves as background
 */
function initWaves() {
  // Check if canvas exists; if not, create it
  let canvas = document.getElementById('waves-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'waves-canvas';
    canvas.className = 'home__waves';
    // Insert before the first element of body to ensure it's in the background
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isVisible = true;

  // Canvas size
  let width = 0;
  let height = 0;
  let diag = 0;

  // Mouse coordinates (relative to canvas center)
  let mouseX = null;
  let mouseY = null;
  let rotatedMouseX = null;
  let rotatedMouseY = null;

  // Theme-aware wave colors matching 🩵 emoji sky blue color palette
  const darkWaves = [
    {
      amplitude: 45,
      frequency: 0.0035,
      speed: 0.008,
      phase: 0,
      yOffset: -40,
      lineWidth: 2,
      colorStart: 'rgba(186, 230, 253, 0.15)', // sky-200
      colorEnd: 'rgba(56, 189, 248, 0.15)'     // sky-400
    },
    {
      amplitude: 60,
      frequency: 0.002,
      speed: -0.005,
      phase: 0,
      yOffset: 20,
      lineWidth: 1.5,
      colorStart: 'rgba(56, 189, 248, 0.10)',  // sky-400
      colorEnd: 'rgba(14, 165, 233, 0.10)'    // sky-500
    },
    {
      amplitude: 30,
      frequency: 0.005,
      speed: 0.012,
      phase: 0,
      yOffset: 80,
      lineWidth: 1,
      colorStart: 'rgba(125, 211, 252, 0.08)', // sky-300
      colorEnd: 'rgba(3, 105, 161, 0.08)'     // sky-700
    }
  ];

  const lightWaves = [
    {
      amplitude: 45,
      frequency: 0.0035,
      speed: 0.008,
      phase: 0,
      yOffset: -40,
      lineWidth: 2,
      colorStart: 'rgba(14, 165, 233, 0.08)', // sky-500
      colorEnd: 'rgba(3, 105, 161, 0.08)'    // sky-700
    },
    {
      amplitude: 60,
      frequency: 0.002,
      speed: -0.005,
      phase: 0,
      yOffset: 20,
      lineWidth: 1.5,
      colorStart: 'rgba(3, 105, 161, 0.06)',  // sky-700
      colorEnd: 'rgba(2, 132, 199, 0.06)'    // sky-600
    },
    {
      amplitude: 30,
      frequency: 0.005,
      speed: 0.012,
      phase: 0,
      yOffset: 80,
      lineWidth: 1,
      colorStart: 'rgba(14, 165, 233, 0.04)', // sky-500
      colorEnd: 'rgba(3, 105, 161, 0.04)'    // sky-700
    }
  ];

  // Angle of rotation (in radians) - e.g., -28 degrees for a clean diagonal look
  const angle = -28 * Math.PI / 180;
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);

  // Resize handler
  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    diag = Math.sqrt(width * width + height * height);
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse events
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left - width / 2;
    const my = e.clientY - rect.top - height / 2;

    mouseX = mx;
    mouseY = my;

    // Rotate mouse coordinates backward to map into the wave's coordinate system
    rotatedMouseX = mx * cosAngle + my * sinAngle;
    rotatedMouseY = -mx * sinAngle + my * cosAngle;
  });

  window.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
    rotatedMouseX = null;
    rotatedMouseY = null;
  });

  // Main render loop
  function animate() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Save context and transform to the center of the canvas to rotate it
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(angle);

    // Get active wave configuration based on active theme
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const waves = activeTheme === 'light' ? lightWaves : darkWaves;

    // Draw each wave
    waves.forEach((wave) => {
      wave.phase += wave.speed;

      // Draw line
      ctx.beginPath();
      ctx.lineWidth = wave.lineWidth;

      const gradient = ctx.createLinearGradient(-diag / 2, 0, diag / 2, 0);
      gradient.addColorStop(0, wave.colorStart);
      gradient.addColorStop(1, wave.colorEnd);
      ctx.strokeStyle = gradient;

      // Draw points across the rotated horizontal span
      for (let x = -diag / 2; x <= diag / 2; x += 6) {
        let currentAmplitude = wave.amplitude;
        let currentPhase = wave.phase;

        // Mouse interaction: distort amplitude and phase if cursor is nearby
        if (rotatedMouseX !== null && rotatedMouseY !== null) {
          const dx = x - rotatedMouseX;
          const dy = wave.yOffset - rotatedMouseY;
          const distanceX = Math.abs(dx);
          const distanceY = Math.abs(dy);

          if (distanceX < 250 && distanceY < 180) {
            const factorX = (250 - distanceX) / 250;
            const factorY = (180 - distanceY) / 180;
            const force = Math.sin(factorX * Math.PI / 2) * factorY;

            currentAmplitude += force * 28;
            currentPhase += force * 0.8;
          }
        }

        // Mathematical sine wave formulation
        const y = Math.sin(x * wave.frequency + currentPhase) * currentAmplitude + wave.yOffset;

        if (x === -diag / 2) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    });

    ctx.restore();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Optimize performance: use IntersectionObserver to only animate when visible
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animationFrameId) {
            animate();
          }
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, {
      threshold: 0.05
    });
    observer.observe(canvas);
  } else {
    animate();
  }
}

/**
 * Initialize typing text animation for the about page.
 */
function initTypingEffect() {
  const typewriterEl = document.querySelector('.typewriter-text');
  if (!typewriterEl) return;

  const phrases = [
    'CS Student & Developer from Puducherry, India.',
    'Co-Founder of Neuron Tech.',
    'Developing integrated hardware and software solutions.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseAfterType = 1800;
  const pauseAfterDelete = 400;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      typewriterEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, pauseAfterType);
        return;
      }
      setTimeout(type, typeSpeed);
    } else {
      typewriterEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, pauseAfterDelete);
        return;
      }
      setTimeout(type, deleteSpeed);
    }
  }

  type();
}

/**
 * Initialize Multi-Column Sidebar Navigation Drawer
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    document.body.classList.add('drawer-open');
    if (menuToggle) menuToggle.classList.add('open');
  }

  function closeDrawer() {
    document.body.classList.remove('drawer-open');
    if (menuToggle) menuToggle.classList.remove('open');
  }

  // 2-line toggle button click
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.body.classList.contains('drawer-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  // Close button inside drawer
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  // Close when clicking the dark backdrop overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeDrawer);
  }

  // Close when clicking outside the drawer
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('drawer-open')) {
      if (sidebarDrawer && !sidebarDrawer.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
        closeDrawer();
      }
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) {
      closeDrawer();
    }
  });

  // Close when clicking any link inside the drawer
  if (sidebarDrawer) {
    sidebarDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }
}

/**
 * Initialize tap-to-flip cards behavior for mobile/touch screens and keyboard accessibility.
 */
function initFactsFlip() {
  document.querySelectorAll('.flip-wrap').forEach(function (c) {
    c.addEventListener('click', function () {
      const wasFlipped = c.classList.contains('flipped');
      // Unflip all other cards
      document.querySelectorAll('.flip-wrap').forEach(card => card.classList.remove('flipped'));
      if (!wasFlipped) {
        c.classList.add('flipped');
      }
    });
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const wasFlipped = c.classList.contains('flipped');
        // Unflip all other cards
        document.querySelectorAll('.flip-wrap').forEach(card => card.classList.remove('flipped'));
        if (!wasFlipped) {
          c.classList.add('flipped');
        }
      }
    });
    // Unflip others when mouse enters this card
    c.addEventListener('mouseenter', function () {
      document.querySelectorAll('.flip-wrap').forEach(card => {
        if (card !== c) {
          card.classList.remove('flipped');
        }
      });
    });
  });
}


/**
 * Initial Page Loader Screen
 */
function initLoader() {
  const loaderOverlay = document.getElementById('loader-overlay');
  if (!loaderOverlay) {
    // If there is no loader overlay, still trigger the CSS entrance animations
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 50);
    return;
  }

  const isReload = (window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType('navigation')[0] && window.performance.getEntriesByType('navigation')[0].type === 'reload') ||
                   (window.performance && window.performance.navigation && window.performance.navigation.type === 1);
  const hasLoaded = sessionStorage.getItem('portfolio-loaded');

  if (hasLoaded && !isReload) {
    loaderOverlay.style.display = 'none';
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    return;
  }

  // Mark the site as loaded for this session
  sessionStorage.setItem('portfolio-loaded', 'true');

  // --- Video ready handling ---
  // The video starts hidden (opacity:0 in CSS). Show it only once it can play.
  const loaderVideo = document.getElementById('loader-video');
  const loaderPulse = document.getElementById('loader-avatar-pulse');

  function revealVideo() {
    if (loaderVideo) loaderVideo.classList.add('video-ready');
    if (loaderPulse) loaderPulse.classList.add('pulse-hidden');
  }

  if (loaderVideo) {
    // Force load & play (needed on some mobile browsers)
    loaderVideo.load();
    const playPromise = loaderVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => { /* autoplay blocked — still reveal after canplay */ });
    }

    if (loaderVideo.readyState >= 3) {
      // Already buffered enough (e.g. cached from preload)
      revealVideo();
    } else {
      loaderVideo.addEventListener('canplay', revealVideo, { once: true });
      // Safety fallback: if video still not ready after 3s, show it anyway
      setTimeout(revealVideo, 3000);
    }
  }

  // Progress counter
  const msgs = ['Initializing...', 'Loading assets...', 'Almost there...', 'Welcome'];
  const fill = document.getElementById('bar-fill');
  const pct = document.getElementById('bar-pct');
  const msg = document.getElementById('bar-msg');

  if (fill && pct && msg) {
    setTimeout(() => {
      let v = 0;
      let mi = 0;

      const t = setInterval(() => {
        // Increment progress by 1 or 2 (average 1.5) per tick for a longer loading screen
        v = Math.min(100, v + Math.ceil(Math.random() * 2));
        fill.style.width = v + '%';
        pct.textContent = v + '%';
        
        const ni = v < 30 ? 0 : v < 60 ? 1 : v < 90 ? 2 : 3;
        if (ni !== mi) {
          mi = ni;
          msg.textContent = msgs[mi];
        }

        if (v >= 100) {
          clearInterval(t);
          setTimeout(() => {
            loaderOverlay.classList.add('fade-out');
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
          }, 280);
        }
      }, 40); // 40ms per tick (average fill time is ~2.67s)
    }, 800); // Initial entrance delay of 800ms (0.8s)
  }
}

/**
 * Page Transitions
 */
function initPageTransitions() {
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.url) {
      loadPage(e.state.url, false);
    } else {
      loadPage(window.location.href, false);
    }
  });
  attachLinkListeners(document);
}

function attachLinkListeners(root) {
  root.querySelectorAll('a').forEach(link => {
    if (link.dataset.ajaxBound) return;
    link.dataset.ajaxBound = "true";

    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      const target = link.getAttribute('target');
      
      // Ignore external, anchors, mailto, etc.
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || target === '_blank') return;
      if (link.hostname !== window.location.hostname) return;
      
      // Ignore same page clicks
      if (href === window.location.pathname || href === window.location.pathname + window.location.search) return;

      e.preventDefault();
      loadPage(href, true);
    });
  });
}

async function loadPage(url, pushState = true) {
  document.body.classList.remove('loaded');
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const html = await response.text();
    
    setTimeout(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const container = document.querySelector('.container.fade-in-element');
      const newContainer = doc.querySelector('.container.fade-in-element');
      
      if (newContainer && container) {
        container.innerHTML = newContainer.innerHTML;
        document.title = doc.title;
        if (pushState) window.history.pushState({url}, '', url);

        // Re-execute inline script elements in swapped container
        container.querySelectorAll('script').forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        
        // Preserve essential classes
        const isLightMode = document.body.classList.contains('light-mode');
        document.body.className = doc.body.className;
        document.body.classList.remove('loaded');
        document.body.classList.remove('loading'); // remove initial loader class
        if (isLightMode) document.body.classList.add('light-mode');
        
        reinitScripts(url);
        attachLinkListeners(container);
        
        // Handle scroll position (to hash element or top of page)
        const hash = url.includes('#') ? url.substring(url.indexOf('#')) : '';
        if (hash) {
          const scrollToHash = () => {
            const targetEl = document.querySelector(hash);
            if (targetEl) {
              if (window.lenis) {
                window.lenis.resize();
                window.lenis.scrollTo(targetEl, { offset: -30, immediate: true });
              } else {
                targetEl.scrollIntoView();
              }
            }
          };
          scrollToHash();
          setTimeout(scrollToHash, 60);
          setTimeout(scrollToHash, 250);
        } else {
          if (window.lenis) {
            window.lenis.resize();
            window.lenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo(0, 0);
          }
        }
        
        setTimeout(() => {
          document.body.classList.add('loaded');
        }, 50);
      } else {
        window.location.href = url;
      }
    }, 450);
  } catch(e) {
    window.location.href = url;
  }
}

function reinitScripts(targetUrl) {
  if (typeof initLenis === 'function') initLenis();
  if (typeof initWaves === 'function') initWaves();
  if (typeof initTheme === 'function') initTheme();
  if (typeof initPronunciation === 'function') initPronunciation();
  if (typeof initContactForm === 'function') initContactForm();
  if (typeof initNavLinks === 'function') initNavLinks();
  if (typeof initSmoothScroll === 'function') initSmoothScroll();
  if (typeof initScrollSpy === 'function') initScrollSpy();
  if (typeof highlightActiveLink === 'function') highlightActiveLink();
  if (typeof initTypingEffect === 'function') initTypingEffect();
  if (typeof initMobileMenu === 'function') initMobileMenu();
  if (typeof initFactsFlip === 'function') initFactsFlip();
  if (typeof initScrollReveal === 'function') initScrollReveal();
  if (typeof initGlowCards === 'function') initGlowCards();
  if (typeof initStats === 'function') initStats();
  if (typeof initScrollArrow === 'function') initScrollArrow();
  if (typeof initScrollProgress === 'function') initScrollProgress();

  if (typeof initAboutReveal === 'function') initAboutReveal();
  if (typeof window.initProjDeck === 'function') window.initProjDeck();
  if (typeof window.initProjectDetail === 'function') window.initProjectDetail(targetUrl);
}

/**
 * Interactive About Me Cursor Reveal Spotlight
 */
function initAboutReveal() {
  const stageElements = [
    {
      stage: document.getElementById('aboutRevealStage'),
      textWrap: document.getElementById('aboutRevealTextWrap')
    },
    {
      stage: document.getElementById('mottoRevealStage'),
      textWrap: document.getElementById('mottoRevealTextWrap')
    }
  ];

  if (window._aboutRevealRafs) {
    window._aboutRevealRafs.forEach(raf => cancelAnimationFrame(raf));
  }
  window._aboutRevealRafs = [];

  stageElements.forEach(item => {
    const stage = item.stage;
    const textWrap = item.textWrap;
    if (!stage || !textWrap) return;

    const cursorCircle = textWrap.querySelector('.cursor-circle');
    const RADIUS = 140;
    let mouseX = null;
    let mouseY = null;
    let targetR = 0;
    let currentR = 0;

    stage.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const rect = textWrap.getBoundingClientRect();
      const ox = mouseX - rect.left;
      const oy = mouseY - rect.top;
      textWrap.style.setProperty('--ox', ox + 'px');
      textWrap.style.setProperty('--oy', oy + 'px');
    });

    stage.addEventListener('mouseenter', () => { targetR = RADIUS; });
    stage.addEventListener('mouseleave', () => { targetR = 0; });

    function tick() {
      currentR += (targetR - currentR) * 0.22;
      if (Math.abs(targetR - currentR) < 0.2) currentR = targetR;

      if (mouseX !== null && textWrap) {
        const rect = textWrap.getBoundingClientRect();
        const ox = mouseX - rect.left;
        const oy = mouseY - rect.top;
        textWrap.style.setProperty('--ox', ox + 'px');
        textWrap.style.setProperty('--oy', oy + 'px');
      }
      if (textWrap) {
        textWrap.style.setProperty('--r', currentR + 'px');
      }
      if (cursorCircle) {
        cursorCircle.style.transform = `translate(-50%, -50%) scale(${currentR / RADIUS})`;
      }

      // Instead of array for cancelAnimationFrame, we just don't re-add if we can handle it,
      // but to match original we keep requesting. 
      // Wait, cancelAnimationFrame needs the specific raf id returned by requestAnimationFrame.
      // So we store the current raf ID on the stage element itself.
      stage._rafId = requestAnimationFrame(tick);
    }

    if (stage._rafId) cancelAnimationFrame(stage._rafId);
    stage._rafId = requestAnimationFrame(tick);
  });
}

/**
 * Custom Cursor — white circle with mix-blend-mode:difference
 * Shrinks on text, expands on links/buttons, smooth lerp follow.
 */
function initCustomCursor() {
  // Don't run on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  // Create cursor element
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  document.body.appendChild(cursor);

  let tx = 0, ty = 0, cx = 0, cy = 0;

  // Track mouse position
  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

  // Smooth lerp animation loop
  (function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();

  // Special hover for Mohit Roscen name — slightly larger cursor (80px)
  function attachMohitNameHover(el) {
    el.addEventListener('mouseenter', () => {
      cursor.classList.remove('on-text', 'on-link', 'on-zoom-text');
      cursor.classList.add('on-name');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('on-name');
    });
  }

  // Special hover for statement paragraph — cursor expands to bigger size
  function attachBigTextHover(el) {
    el.addEventListener('mouseenter', () => {
      cursor.classList.remove('on-text', 'on-link', 'on-name');
      cursor.classList.add('on-zoom-text');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('on-zoom-text');
    });
  }

  // Text elements — regular text cursor
  function attachTextHover(el) {
    if (el.classList.contains('about-subtitle') || el.closest('.about-subtitle')) return;
    if (el.classList.contains('pattern-text') || el.closest('.pattern-text')) return;
    if (el.closest('.self-track-row')) return;
    if (el.closest('.tech-stack-section') || el.closest('.tech-marquee-wrapper') || el.closest('.tech-marquee-item')) return;
    el.addEventListener('mouseenter', () => {
      if (!cursor.classList.contains('on-name')) cursor.classList.add('on-text');
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('on-text'));
  }

  // Links & buttons — expand cursor
  function attachLinkHover(el) {
    if (el.classList.contains('pattern-text') || el.closest('.pattern-text')) return;
    if (el.closest('.tech-stack-section') || el.closest('.tech-marquee-wrapper') || el.closest('.tech-marquee-item')) return;
    el.addEventListener('mouseenter', () => {
      cursor.classList.remove('on-text', 'on-zoom-text', 'on-name');
      cursor.classList.add('on-link');
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('on-link'));
  }

  function setupListeners() {
    document.querySelectorAll('.pattern-text, [data-shadow="Mohit Roscen"]')
      .forEach(attachMohitNameHover);
    document.querySelectorAll('.about-subtitle')
      .forEach(attachBigTextHover);
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, label')
      .forEach(attachTextHover);
    document.querySelectorAll('a, button, .flip-wrap, .connect-btn, .self-track-row')
      .forEach(attachLinkHover);
  }

  setupListeners();

  // Re-attach on dynamic DOM changes
  new MutationObserver(() => setupListeners())
    .observe(document.body, { childList: true, subtree: true });
}

/**
 * Blur-in Scroll Reveal System (Bidirectional: scroll down and up)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      } else {
        entry.target.classList.remove('in');
      }
    });
  }, { 
    threshold: 0.2
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Scroll Reveal for Gallery Cards with in-view class toggle
 */
function initGalleryReveal() {
  const cards = document.querySelectorAll('.achievements-grid .card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(card => observer.observe(card));
}

/**
 * Initialize Stats Bar
 */
function initStats() {
  function animCount(id, target, duration, pad) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(ease * target);
      el.textContent = pad ? String(val).padStart(2, '0') : val;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  let animated = false;
  function trigger() {
    if (animated) return;
    animated = true;
    animCount('c1', 2, 1000, false);
    animCount('c2', 10, 1200, true);
    animCount('c3', 15, 1400, true);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trigger();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(statsBar);
  } else {
    setTimeout(trigger, 300);
  }
}





/**
 * Initialize Scroll Arrow
 */
function initScrollArrow() {
  const wrap = document.querySelector('.scroll-arrow-wrap');
  const arrow = document.getElementById('scrollArrow');
  if (!wrap || !arrow) return;

  const THRESHOLD = 120;
  let ticking = false;

  function isNearBottom() {
    return window.innerHeight + window.scrollY >= document.body.scrollHeight - THRESHOLD;
  }

  const BASE_BOTTOM = 36;  // px — normal resting position
  const RING_RADIUS = 20;  // small clearance so rings don't clip footer
  const FOOTER_GAP = 8;   // tight breathing room above footer

  function updateArrow() {
    if (isNearBottom()) {
      arrow.classList.add('is-up');
      arrow.setAttribute('aria-label', 'Back to top');
    } else {
      arrow.classList.remove('is-up');
      arrow.setAttribute('aria-label', 'Scroll down');
    }

    // Lift the whole wrap (arrow + rings) above the footer
    const footer = document.querySelector('.bottom-connect-bar, footer');
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      const distFromBottom = window.innerHeight - footerRect.top;
      const needed = distFromBottom + RING_RADIUS + FOOTER_GAP;
      const newBottom = Math.max(BASE_BOTTOM, needed);
      wrap.style.bottom = newBottom + 'px';
    } else {
      wrap.style.bottom = BASE_BOTTOM + 'px';
    }
    wrap.style.opacity = '1';
    wrap.style.pointerEvents = 'auto';
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateArrow);
      ticking = true;
    }
  }

  // Remove existing listeners to avoid duplicates on reinit
  if (window._scrollArrowClick) arrow.removeEventListener('click', window._scrollArrowClick);
  if (window._scrollArrowUpdate) {
    window.removeEventListener('scroll', window._scrollArrowUpdate);
    window.removeEventListener('resize', window._scrollArrowUpdate);
  }

  window._scrollArrowClick = function () {
    if (isNearBottom()) {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (window.lenis) {
        window.lenis.scrollTo(window.scrollY + window.innerHeight * 0.85, { duration: 1.1 });
      } else {
        window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
      }
    }
  };

  window._scrollArrowUpdate = onScroll;

  arrow.addEventListener('click', window._scrollArrowClick);
  if (window.lenis) {
    window.lenis.on('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateArrow();
}


