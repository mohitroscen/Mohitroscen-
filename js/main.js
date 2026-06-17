document.addEventListener('DOMContentLoaded', () => {
  // 0. Initial Page Loader Screen
  initLoader();

  // 1. Theme Toggle System
  initTheme();

  // 2. Audio Pronunciation
  initPronunciation();

  // 3. Project Filter System (For projects.html)
  initProjectFilters();

  // 4. Contact Form Handler (For contact.html)
  initContactForm();

  // 5. Active Link Indicator
  initNavLinks();
  highlightActiveLink();

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
});

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
 * Filter project items on projects.html
 */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterButtons.length === 0 || projectCards.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Hide or show cards
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          // Smooth fade back in
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Handle form inputs, floating labels, validation, and submission
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

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
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const text = link.textContent.trim();
    link.innerHTML = `<span class="nav-link-inner" data-text="${text}">${text}</span>`;
  });
}

/**
 * Highlights active page link in navigation menu
 */
function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
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
 * Initialize Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.querySelector('header nav');
  if (!menuToggle || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('open');
    menuToggle.classList.add('open');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  // Hamburger toggle button
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menuToggle.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking outside the nav panel
  document.addEventListener('click', (e) => {
    if (menuToggle.classList.contains('open')) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Close menu on window resize if switching to desktop layout
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
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
  if (!loaderOverlay) return;

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

  // Text elements — shrink cursor
  function attachTextHover(el) {
    el.addEventListener('mouseenter', () => cursor.classList.add('on-text'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('on-text'));
  }

  // Links & buttons — expand cursor
  function attachLinkHover(el) {
    el.addEventListener('mouseenter', () => {
      cursor.classList.remove('on-text');
      cursor.classList.add('on-link');
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('on-link'));
  }

  function setupListeners() {
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, label')
      .forEach(attachTextHover);
    document.querySelectorAll('a, button, .flip-wrap, .project-item, .filter-btn, .connect-btn')
      .forEach(attachLinkHover);
  }

  setupListeners();

  // Re-attach on dynamic DOM changes
  new MutationObserver(() => setupListeners())
    .observe(document.body, { childList: true, subtree: true });
}

/**
 * Scroll Reveal — elements with .sr-item are hidden until they scroll into view.
 */
function initScrollReveal() {
  const items = document.querySelectorAll('.sr-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        observer.unobserve(entry.target); // only trigger once
      }
    });
  }, {
    threshold: 0.15,       // trigger when 15% is visible
    rootMargin: '0px 0px -40px 0px'  // trigger slightly before fully in view
  });

  items.forEach(el => observer.observe(el));
}
