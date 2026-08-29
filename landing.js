/**
 * KROH (ក្រោះ) — MASTER INTERACTIVE ENGINE
 * Features: Counting Stats + Subview Modals + Live Telegram Scam Simulator + Threat Search
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountUp();
  initMobileMenu();
});

/* ==========================================================================
   1. COUNT-UP ANIMATION FOR STATS
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
  const duration = 1600; // ms
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // easeOutCubic: 1 - pow(1 - progress, 3)
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
   2. VIEW & MODAL NAVIGATION CONTROLLER
   ========================================================================== */
function openView(viewName) {
  closeAllModals();
  
  document.querySelectorAll('.nav-link, .mobile-link').forEach(l => l.classList.remove('active'));

  if (viewName === 'home') {
    document.getElementById('navHome')?.classList.add('active');
  } else if (viewName === 'bot') {
    document.getElementById('navBot')?.classList.add('active');
    openModal('modalBot');
  } else if (viewName === 'radar') {
    document.getElementById('navRadar')?.classList.add('active');
    openModal('modalRadar');
  } else if (viewName === 'docs') {
    document.getElementById('navDocs')?.classList.add('active');
    openModal('modalDocs');
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
  }
});

document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeAllModals();
    }
  });
});

/* ==========================================================================
   3. LIVE TELEGRAM SCAM SIMULATOR
   ========================================================================== */
function simulateScam(type) {
  const chatStream = document.getElementById('chatStream');
  if (!chatStream) return;

  chatStream.innerHTML = '';

  let userMsg = '';
  let botVerdictHtml = '';

  if (type === 'link') {
    userMsg = 'https://aba-bonus2026.top/claim-500usd';
    botVerdictHtml = `
      <div class="tg-bubble bot-alert">
        <p><strong>🚨 ការព្រមានកម្រិតគ្រោះថ្នាក់ខ្ពស់ (99.4% PHISHING):</strong></p>
        <p>• ឈ្មោះ Domain ក្លែងបន្លំធនាគារ ABA (.top TLD ទើបបង្កើតថ្មី)<br>
        • គោលបំណង៖ លួចលេខកូដសម្ងាត់ Password & OTP<br>
        • <strong>អនុសាសន៍៖</strong> សូមកុំចុចជាដាច់ខាត!</p>
      </div>
    `;
  } else if (type === 'loan') {
    userMsg = 'សួស្តីបង! កម្ចីរហ័ស 5000$ គ្មានទ្រព្យបញ្ចាំ ការប្រាក់ 0% ចុច bit.ly/kh-fastloan';
    botVerdictHtml = `
      <div class="tg-bubble bot-alert">
        <p><strong>🚨 ការព្រមានល្បិចកម្ចីបោកប្រាស់ (94.2% LOAN FRAUD):</strong></p>
        <p>• សារទាក់ទាញកម្ចីគ្មានទ្រព្យបញ្ចាំ ដើម្បីទារប្រាក់កក់មុន<br>
        • <strong>អនុសាសន៍៖</strong> សូមកុំផ្ញើប្រាក់កក់ ឬអត្តសញ្ញាណប័ណ្ណ!</p>
      </div>
    `;
  } else if (type === 'voice') {
    userMsg = '🎙️ [Voice Message: 0:14s] "ខ្ញុំបុគ្គលិកធនាគារ សូមផ្ញើលេខ OTP 6 ខ្ទង់..."';
    botVerdictHtml = `
      <div class="tg-bubble bot-alert">
        <p><strong>🚨 ការព្រមានលួចលេខសម្ងាត់ OTP (98.9% SOCIAL ENGINEERING):</strong></p>
        <p>• បុគ្គលិកធនាគារពិតប្រាកដមិនដែលទាមទារលេខ OTP តាមសំឡេងឡើយ<br>
        • <strong>អនុសាសន៍៖</strong> សូមកុំប្រាប់លេខ OTP ទៅអ្នកដទៃជាដាច់ខាត!</p>
      </div>
    `;
  } else if (type === 'clean') {
    userMsg = '🧾 [Bakong QR Payment Receipt - $4.50 to Brown Coffee]';
    botVerdictHtml = `
      <div class="tg-bubble bot-safe">
        <p><strong>✅ សុវត្ថិភាពខ្ពស់ (CLEARED):</strong></p>
        <p>• វិក្កយបត្រ Bakong ពិតប្រាកដ (EMVCo Checksum ត្រឹមត្រូវ)<br>
        • គ្មានការកែឆ្នៃ Font ឬរូបភាពឡើយ។</p>
      </div>
    `;
  }

  // Inject User Msg
  chatStream.innerHTML += `<div class="tg-bubble user-msg"><p>${userMsg}</p></div>`;

  // Simulate 200ms Triage Delay
  setTimeout(() => {
    chatStream.innerHTML += botVerdictHtml;
  }, 220);
}

/* ==========================================================================
   4. THREAT SEARCH & FILTER ENGINE
   ========================================================================== */
function filterThreats() {
  const input = document.getElementById('threatInput').value.toLowerCase();
  const rows = document.querySelectorAll('#threatTableBody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(input) ? '' : 'none';
  });
}

/* ==========================================================================
   5. MOBILE MENU CONTROLLER
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  const overlay = document.getElementById('mobileOverlay');

  if (!burger || !overlay) return;

  function toggleMenu(isOpen) {
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    overlay.classList.toggle('open', isOpen);
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.contains('active');
    toggleMenu(!isOpen);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      toggleMenu(false);
    }
  });
}
