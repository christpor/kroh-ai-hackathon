/**
 * KROH (ក្រោះ) — MASTER INTERACTIVE SUITE
 * Features: Zero-Flicker View Switcher + Live Telegram Simulator + Threat Radar Search + EaseOutCubic Stats
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountUp();
  initMobileMenu();
  initRouting();
});

/* ==========================================================================
   1. ZERO-RELOAD SPA ROUTER
   ========================================================================== */
function navigate(viewName, event) {
  if (event) event.preventDefault();

  // Update URL Hash
  window.location.hash = viewName;

  // Update Nav Links
  document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    link.classList.remove('active');
  });

  const activeDesktop = document.getElementById(`nav-${viewName}`);
  if (activeDesktop) activeDesktop.classList.add('active');

  // Switch View Panel
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // Close Mobile Menu if Open
  const overlay = document.getElementById('mobileOverlay');
  const burger = document.getElementById('burgerBtn');
  if (overlay && overlay.classList.contains('open')) {
    overlay.classList.remove('open');
    if (burger) burger.classList.remove('active');
  }
}

function initRouting() {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash);

  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '') || 'home';
    navigate(newHash);
  });
}

/* ==========================================================================
   2. COUNT-UP ANIMATION FOR STATS
   ========================================================================== */
function initCountUp() {
  const counters = document.querySelectorAll('.count');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(counter => observer.observe(counter));
}

function startCount(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const duration = 1600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const currentVal = (target * ease).toFixed(decimals);
    
    el.textContent = currentVal;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toFixed(decimals);
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   3. LIVE TELEGRAM SCAM SIMULATOR
   ========================================================================== */
function simulateScam(type, btnEl) {
  // Update Active Preset Card
  if (btnEl) {
    document.querySelectorAll('.preset-card').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }

  const tgMessages = document.getElementById('tgMessages');
  if (!tgMessages) return;

  tgMessages.innerHTML = '';

  let userMsg = '';
  let botVerdictHtml = '';

  if (type === 'link') {
    userMsg = 'https://aba-bonus2026.top/claim-500usd';
    botVerdictHtml = `
      <div class="msg alert">
        <p><strong>🚨 ការព្រមានកម្រិតគ្រោះថ្នាក់ខ្ពស់ (99.4% PHISHING):</strong></p>
        <p>• ឈ្មោះ Domain ក្លែងបន្លំធនាគារ ABA (.top TLD ទើបបង្កើតថ្មី)<br>
        • គោលបំណង៖ លួចលេខសម្ងាត់ Password & OTP<br>
        • <strong>អនុសាសន៍៖</strong> សូមកុំចុចជាដាច់ខាត!</p>
      </div>
    `;
  } else if (type === 'loan') {
    userMsg = 'សួស្តីបង! កម្ចីរហ័ស 5000$ គ្មានទ្រព្យបញ្ចាំ ការប្រាក់ 0% ចុច bit.ly/kh-fastloan';
    botVerdictHtml = `
      <div class="msg alert">
        <p><strong>🚨 ការព្រមានល្បិចកម្ចីបោកប្រាស់ (94.2% LOAN FRAUD):</strong></p>
        <p>• សារទាក់ទាញកម្ចីគ្មានទ្រព្យបញ្ចាំ ដើម្បីទារប្រាក់កក់មុន<br>
        • <strong>អនុសាសន៍៖</strong> សូមកុំផ្ញើប្រាក់កក់ ឬអត្តសញ្ញាណប័ណ្ណ!</p>
      </div>
    `;
  } else if (type === 'voice') {
    userMsg = '🎙️ [Voice Message: 0:14s] "ខ្ញុំបុគ្គលិកធនាគារ សូមផ្ញើលេខ OTP 6 ខ្ទង់..."';
    botVerdictHtml = `
      <div class="msg alert">
        <p><strong>🚨 ការព្រមានលួចលេខសម្ងាត់ OTP (98.9% SOCIAL ENGINEERING):</strong></p>
        <p>• បុគ្គលិកធនាគារពិតប្រាកដមិនដែលទាមទារលេខ OTP តាមសំឡេងឡើយ<br>
        • <strong>អនុសាសន៍៖</strong> សូមកុំប្រាប់លេខ OTP ទៅអ្នកដទៃជាដាច់ខាត!</p>
      </div>
    `;
  } else if (type === 'clean') {
    userMsg = '🧾 [Bakong QR Payment Receipt - $4.50 to Brown Coffee]';
    botVerdictHtml = `
      <div class="msg safe">
        <p><strong>✅ សុវត្ថិភាពខ្ពស់ (CLEARED):</strong></p>
        <p>• វិក្កយបត្រ Bakong ពិតប្រាកដ (EMVCo Checksum ត្រឹមត្រូវ)<br>
        • គ្មានការកែឆ្នៃ Font ឬរូបភាពឡើយ។</p>
      </div>
    `;
  }

  // Inject User Message
  tgMessages.innerHTML += `
    <div class="msg bot">
      <p><strong>🛡️ KROH Shield:</strong> សួស្តី! សូម Forward សារ Link, សំឡេង ឬរូបភាព Screenshot មកទីនេះដើម្បីស្កេនពិនិត្យសុវត្ថិភាពភ្លាមៗ។</p>
    </div>
    <div class="msg user"><p>${userMsg}</p></div>
  `;

  // Simulate 200ms Triage Delay
  setTimeout(() => {
    tgMessages.innerHTML += botVerdictHtml;
    tgMessages.scrollTop = tgMessages.scrollHeight;
  }, 220);
}

/* ==========================================================================
   4. RADAR THREAT FILTER
   ========================================================================== */
function filterRadar() {
  const input = document.getElementById('radarFilterInput').value.toLowerCase();
  const rows = document.querySelectorAll('#radarTableBody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(input) ? '' : 'none';
  });
}

/* ==========================================================================
   5. MOBILE DRAWER
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  const overlay = document.getElementById('mobileOverlay');

  if (!burger || !overlay) return;

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    overlay.classList.toggle('open', isOpen);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      burger.classList.remove('active');
      overlay.classList.remove('open');
    }
  });
}
