var topBtn = document.getElementById('topBtn');
  function toggleTopBtn(){ if (window.scrollY > 600) topBtn.classList.add('visible'); else topBtn.classList.remove('visible'); }
  window.addEventListener('scroll', toggleTopBtn); toggleTopBtn();
  topBtn.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  var themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  var navHamburger = document.getElementById('navHamburger');
  var navLinksEl = document.querySelector('.navlinks');
  if (navHamburger && navLinksEl) {
    navHamburger.addEventListener('click', function(){
      var isOpen = navLinksEl.classList.toggle('mobile-open');
      navHamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinksEl.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        navLinksEl.classList.remove('mobile-open');
        navHamburger.setAttribute('aria-expanded', 'false');
      });
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 860) {
        navLinksEl.classList.remove('mobile-open');
        navHamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var revealSelectors = '.section-head, .svc-card, .skill-card, .pkg-card, .proj-card, .testi-card, .faq-entry, .stat, .calc-card, .blog-card, .review-placeholder, .review-card';
  var revealEls = document.querySelectorAll(revealSelectors);
  revealEls.forEach(function(el, i){ el.classList.add('reveal'); el.style.transitionDelay = (i % 4) * 70 + 'ms'; });
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
    }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else { revealEls.forEach(function(el){ el.classList.add('in-view'); }); }

  // Count-up animation for stat numbers (213+, 6 Years, etc.)
  var countEls = document.querySelectorAll('[data-count]');
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1200;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if (countEls.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) { animateCount(entry.target); countObserver.unobserve(entry.target); }
      });
    }, {threshold:0.4});
    countEls.forEach(function(el){ countObserver.observe(el); });
  } else {
    countEls.forEach(function(el){ el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix')||''); });
  }

  // Staggered line-by-line reveal for the hero terminal
  var termBody = document.getElementById('termBody');
  if (termBody) {
    var lines = Array.prototype.slice.call(termBody.children);
    termBody.classList.add('type-reveal');
    function playTerminal(){
      lines.forEach(function(line, i){
        setTimeout(function(){ line.classList.add('show'); }, i * 260);
      });
    }
    if ('IntersectionObserver' in window) {
      var termObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){ if (entry.isIntersecting) { playTerminal(); termObserver.unobserve(entry.target); } });
      }, {threshold:0.3});
      termObserver.observe(termBody);
    } else { lines.forEach(function(line){ line.classList.add('show'); }); }
  }

  // Slowly rotate a highlight glow between track-record cards on the Testimonials page
  var trackGrid = document.getElementById('trackRecordGrid');
  if (trackGrid) {
    var trackCards = Array.prototype.slice.call(trackGrid.querySelectorAll('.testi-card'));
    var glowIndex = 0;
    function pulseGlow(){
      trackCards.forEach(function(c){ c.classList.remove('glow'); });
      trackCards[glowIndex].classList.add('glow');
      glowIndex = (glowIndex + 1) % trackCards.length;
    }
    if (trackCards.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pulseGlow();
      setInterval(pulseGlow, 3200);
    }
  }
