(function () {
  'use strict';

  var CONTACT_EMAIL = 'contato.salvattorepb@gmail.com';

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Floating CTA (mobile): show only after the hero ---------- */
  var fabCta = document.querySelector('.fab-cta');
  var heroSection = document.getElementById('topo');
  if (fabCta && heroSection) {
    function onFabScroll() {
      var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (window.scrollY > heroBottom - 200) {
        fabCta.classList.add('is-visible');
      } else {
        fabCta.classList.remove('is-visible');
      }
    }
    window.addEventListener('scroll', onFabScroll, { passive: true });
    onFabScroll();
  }

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function closeMenu() {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggleMenu() {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  navToggle.addEventListener('click', toggleMenu);
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () {
              el.classList.add('is-visible');
            }, (i % 6) * 70);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Gallery: hide whole section if no photos exist yet ---------- */
  var galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    var galleryPhotos = galleryGrid.querySelectorAll('.gallery-photo');
    var gallerySettled = 0;

    function checkGalleryEmpty() {
      gallerySettled += 1;
      if (gallerySettled < galleryPhotos.length) return;

      var anyVisible = Array.prototype.some.call(
        galleryGrid.querySelectorAll('[data-gallery-item]'),
        function (item) { return item.style.display !== 'none'; }
      );
      if (!anyVisible) {
        document.getElementById('galeria').style.display = 'none';
      }
    }

    if (galleryPhotos.length === 0) {
      document.getElementById('galeria').style.display = 'none';
    } else {
      galleryPhotos.forEach(function (img) {
        if (img.complete) {
          checkGalleryEmpty();
        } else {
          img.addEventListener('load', checkGalleryEmpty);
          img.addEventListener('error', checkGalleryEmpty);
        }
      });
    }
  }

  /* ---------- Editais: hide card (or whole section) when the PDF is missing ---------- */
  var editaisGrid = document.getElementById('editaisGrid');
  if (editaisGrid) {
    var editalItems = editaisGrid.querySelectorAll('[data-edital-item]');
    var editaisSettled = 0;

    function checkEditaisEmpty() {
      editaisSettled += 1;
      if (editaisSettled < editalItems.length) return;

      var anyVisible = Array.prototype.some.call(editalItems, function (item) {
        return item.style.display !== 'none';
      });
      if (!anyVisible) {
        document.getElementById('editais').style.display = 'none';
      }
    }

    if (editalItems.length === 0) {
      document.getElementById('editais').style.display = 'none';
    } else {
      editalItems.forEach(function (item) {
        var link = item.querySelector('a[href]');
        fetch(link.getAttribute('href'), { method: 'HEAD' })
          .then(function (res) {
            if (!res.ok) item.style.display = 'none';
          })
          .catch(function () {
            item.style.display = 'none';
          })
          .finally(checkEditaisEmpty);
      });
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form: submits directly via Netlify Forms (AJAX) ---------- */
  var form = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');

  function encodeFormData(formEl) {
    var params = new URLSearchParams(new FormData(formEl));
    return params.toString();
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        formNote.textContent = 'Por favor, preencha os campos obrigatórios (*) antes de enviar.';
        formNote.style.color = '#E4A0A0';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      formNote.style.color = '';
      formNote.textContent = 'Enviando...';

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Falha no envio');
          formNote.style.color = '';
          formNote.textContent = 'Solicitação enviada com sucesso! Em breve nossa equipe entrará em contato.';
          form.reset();
        })
        .catch(function () {
          formNote.style.color = '#E4A0A0';
          formNote.textContent = 'Não foi possível enviar agora. Tente novamente ou escreva para ' + CONTACT_EMAIL + '.';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
