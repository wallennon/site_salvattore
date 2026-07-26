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

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        formNote.textContent = 'Por favor, preencha os campos obrigatórios (*) antes de enviar.';
        formNote.style.color = '#E4A0A0';
        return;
      }

      var data = {
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        telefone: form.telefone.value.trim(),
        instituicao: form.instituicao.value.trim(),
        servico: form.servico.value,
        mensagem: form.mensagem.value.trim()
      };

      var bodyLines = [
        'Nome: ' + data.nome,
        'E-mail: ' + data.email,
        'Telefone: ' + (data.telefone || 'não informado'),
        'Instituição/Empresa: ' + (data.instituicao || 'não informado'),
        'Serviço de interesse: ' + (data.servico || 'não informado'),
        '',
        'Mensagem:',
        data.mensagem
      ];

      var subject = encodeURIComponent('Solicitação de Consultoria — ' + data.nome);
      var body = encodeURIComponent(bodyLines.join('\n'));
      var mailtoLink = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;

      window.location.href = mailtoLink;

      formNote.style.color = '';
      formNote.textContent = 'Abrindo seu aplicativo de e-mail para concluir o envio para ' + CONTACT_EMAIL + '...';
    });
  }
})();
