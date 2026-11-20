/* Silvester 2026 – čistý JavaScript, bez knižníc. */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Mobilné menu ---------- */
  var toggle = $('.nav-toggle');
  var nav = $('#nav');

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    // pri roztiahnutí okna na šírku počítača menu zavrieme
    window.matchMedia('(min-width: 62.001rem)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Odpočítavanie ---------- */
  var cd = $('#countdown');

  function plural(n, forms) {
    if (n === 1) return forms[0];
    if (n >= 2 && n <= 4) return forms[1];
    return forms[2];
  }

  if (cd) {
    var start = new Date(cd.dataset.start).getTime();
    var end = new Date(cd.dataset.end).getTime();
    var words = {
      days: ['deň', 'dni', 'dní'],
      hours: ['hodina', 'hodiny', 'hodín'],
      minutes: ['minúta', 'minúty', 'minút']
    };
    var timer = null;

    var tick = function () {
      var now = Date.now();

      if (isNaN(start) || isNaN(end) || now >= end) {      // po skončení odpočítavanie schováme
        cd.hidden = true;
        if (timer) clearInterval(timer);
        return;
      }

      if (now >= start) {                                   // počas púte
        cd.textContent = '';
        var live = document.createElement('p');
        live.className = 'countdown__live';
        live.textContent = 'Práve prebieha';
        cd.appendChild(live);
        cd.hidden = false;
        if (timer) clearInterval(timer);
        return;
      }

      var mins = Math.floor((start - now) / 60000);
      var values = {
        days: Math.floor(mins / 1440),
        hours: Math.floor((mins % 1440) / 60),
        minutes: mins % 60
      };
      Object.keys(values).forEach(function (unit) {
        var num = $('[data-unit="' + unit + '"]', cd);
        var label = $('[data-label="' + unit + '"]', cd);
        if (num) num.textContent = values[unit];
        if (label) label.textContent = plural(values[unit], words[unit]);
      });
      cd.hidden = false;
    };

    tick();
    timer = setInterval(tick, 15000);
  }

  /* ---------- Program: prepínanie dní (použije sa, keď bude program zverejnený) ---------- */
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root);

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  /* ---------- Galéria: zväčšenie fotky ---------- */
  var links = $$('#gallery a');

  if (links.length && typeof HTMLDialogElement === 'function') {
    var dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', 'Fotka z galérie');

    var figure = document.createElement('div');
    figure.className = 'lightbox__figure';
    var img = document.createElement('img');
    img.className = 'lightbox__img';
    img.alt = '';
    figure.appendChild(img);

    var count = document.createElement('p');
    count.className = 'lightbox__count';
    count.setAttribute('aria-live', 'polite');

    function button(cls, label, text) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = cls;
      b.setAttribute('aria-label', label);
      b.textContent = text;
      return b;
    }
    var btnClose = button('lightbox__close', 'Zavrieť', '×');
    var btnPrev = button('lightbox__prev', 'Predošlá fotka', '‹');
    var btnNext = button('lightbox__next', 'Ďalšia fotka', '›');

    dialog.appendChild(figure);
    dialog.appendChild(count);
    dialog.appendChild(btnPrev);
    dialog.appendChild(btnNext);
    dialog.appendChild(btnClose);
    document.body.appendChild(dialog);

    var current = 0;

    var show = function (i) {
      current = (i + links.length) % links.length;
      var link = links[current];
      var thumb = $('img', link);
      img.src = link.href;
      img.width = Number(link.dataset.w) || 1600;
      img.height = Number(link.dataset.h) || 1067;
      img.alt = thumb ? thumb.alt : '';
      count.textContent = (current + 1) + ' / ' + links.length;
      // vopred načítame susednú fotku, aby listovanie nečakalo
      var nextLink = links[(current + 1) % links.length];
      var pre = new Image();
      pre.src = nextLink.href;
    };

    links.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;     // otvorenie v novej karte necháme na prehliadač
        e.preventDefault();
        show(i);
        dialog.showModal();
      });
    });

    btnClose.addEventListener('click', function () { dialog.close(); });
    btnPrev.addEventListener('click', function () { show(current - 1); });
    btnNext.addEventListener('click', function () { show(current + 1); });

    dialog.addEventListener('click', function (e) {             // klik mimo fotky zatvára
      if (e.target === dialog || e.target === figure) dialog.close();
    });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    dialog.addEventListener('close', function () {
      img.removeAttribute('src');
      if (links[current]) links[current].focus();
    });

    // listovanie potiahnutím prsta
    var startX = null, startY = null;
    figure.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { startX = null; return; }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    figure.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
})();
