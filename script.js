/* ==========================================================================
   ALAN DIGITAL — The Parahyangan Estate
   script.js — Vanilla JS (no dependencies)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     0. PRELOADER
  ------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (preloader) preloader.classList.add('hidden');
  });
  // Fallback in case 'load' already fired or is delayed
  setTimeout(() => { if (preloader) preloader.classList.add('hidden'); }, 1200);


  /* ------------------------------------------------------------------
     1. STICKY HEADER ON SCROLL
  ------------------------------------------------------------------ */
  const siteHeader = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });


  /* ------------------------------------------------------------------
     2. MOBILE NAV TOGGLE
  ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked (smooth scroll then close)
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  /* ------------------------------------------------------------------
     3. ACTIVE NAV LINK ON SCROLL (highlight current section)
  ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const highlightNav = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };
  highlightNav();
  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ------------------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
     Adds ".observe-fade" behaviour to key elements as they enter view.
  ------------------------------------------------------------------ */
  const animateTargets = document.querySelectorAll(
    '.spec-card, .gallery-item, .nb-card, .section-head, .survey-info, .survey-form'
  );
  animateTargets.forEach((el) => el.classList.add('observe-fade'));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  animateTargets.forEach((el) => revealObserver.observe(el));


  /* ==================================================================
     5. LEAD GENERATION FORM → REDIRECT TO WHATSAPP
     ==================================================================
     HOW TO EDIT THIS SECTION IN CURSOR:
     - Ganti nilai WHATSAPP_NUMBER di bawah ini dengan nomor WhatsApp
       agen properti Anda (gunakan format internasional TANPA "+",
       TANPA spasi, dan TANPA angka 0 di depan).
       Contoh: nomor 0812-3456-7890 menjadi "6281234567890"
     - Ganti isi function buildWhatsAppMessage() di bawah untuk
       mengubah format teks pesan yang akan terkirim ke WhatsApp.
  ================================================================== */

  // 🔧 EDIT DI SINI: Nomor WhatsApp tujuan (format internasional, tanpa "+")
  const WHATSAPP_NUMBER = '6281234567890'; // <-- Ganti dengan nomor WA agen properti Anda

  const surveyForm = document.getElementById('surveyForm');

  // Ambil elemen-elemen input & wadah error untuk validasi
  const fullNameInput = document.getElementById('fullName');
  const waNumberInput = document.getElementById('waNumber');
  const surveyDaySelect = document.getElementById('surveyDay');
  const notesInput = document.getElementById('notes');

  /**
   * Menampilkan / menyembunyikan pesan error pada sebuah field.
   * @param {HTMLElement} inputEl - elemen input yang divalidasi
   * @param {boolean} isValid - true jika valid, false jika tidak
   */
  function toggleFieldError(inputEl, isValid) {
    const formGroup = inputEl.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.toggle('has-error', !isValid);
  }

  /**
   * Validasi sederhana: pastikan Nama Lengkap dan No. WhatsApp tidak kosong.
   * Nomor WhatsApp juga divalidasi agar hanya berisi angka, spasi, +, dan -.
   * @returns {boolean} true jika semua field valid
   */
  function validateForm() {
    let isValid = true;

    const nameValue = fullNameInput.value.trim();
    const waValue = waNumberInput.value.trim();
    const waPattern = /^[0-9+\-\s]{9,15}$/; // minimal 9 - maksimal 15 karakter angka/format telepon

    if (nameValue === '') {
      toggleFieldError(fullNameInput, false);
      isValid = false;
    } else {
      toggleFieldError(fullNameInput, true);
    }

    if (waValue === '' || !waPattern.test(waValue)) {
      toggleFieldError(waNumberInput, false);
      isValid = false;
    } else {
      toggleFieldError(waNumberInput, true);
    }

    return isValid;
  }

  /**
   * 🔧 EDIT DI SINI jika ingin mengubah FORMAT TEKS pesan WhatsApp.
   * Susun pesan yang rapi & profesional dari data form.
   * @param {{name: string, wa: string, day: string, notes: string}} data
   * @returns {string} teks pesan siap dikirim (belum di-encode)
   */
  function buildWhatsAppMessage(data) {
    const notesLine = data.notes !== '' ? data.notes : '-';

    return (
      `Halo, saya tertarik dengan unit properti *The Parahyangan Estate* di Kota Baru Parahyangan (KBP).\n` +
      `Berikut detail jadwal survei saya:\n\n` +
      `Nama: ${data.name}\n` +
      `No. WA: ${data.wa}\n` +
      `Waktu Survei: ${data.day}\n` +
      `Catatan: ${notesLine}\n\n` +
      `Mohon informasi lanjutan mengenai jadwal survei unit. Terima kasih.`
    );
  }

  surveyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm()) {
      // Fokus otomatis ke field pertama yang bermasalah
      const firstError = surveyForm.querySelector('.has-error input');
      if (firstError) firstError.focus();
      return;
    }

    // Kumpulkan data form
    const formData = {
      name: fullNameInput.value.trim(),
      wa: waNumberInput.value.trim(),
      day: surveyDaySelect.value,
      notes: notesInput.value.trim(),
    };

    // Susun pesan & lakukan URL encoding
    const message = buildWhatsAppMessage(formData);
    const encodedMessage = encodeURIComponent(message);

    // Susun URL WhatsApp API dan redirect
    const whatsappURL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

    // Buka di tab baru agar pengguna tidak kehilangan halaman ini
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');

    // Reset form setelah berhasil dikirim
    surveyForm.reset();
  });

  // Hilangkan status error saat pengguna mulai mengetik ulang
  [fullNameInput, waNumberInput].forEach((input) => {
    input.addEventListener('input', () => {
      const formGroup = input.closest('.form-group');
      if (formGroup && formGroup.classList.contains('has-error')) {
        formGroup.classList.remove('has-error');
      }
    });
  });


  /* ------------------------------------------------------------------
     6. FOOTER YEAR (auto update)
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
