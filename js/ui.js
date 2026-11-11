/* Small DOM helpers shared by the card-back section and the settings popup. */
(function (root) {
  'use strict';

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      node.appendChild(c);
    });
    return node;
  }

  // Follow Trello's light/dark theme when it tells us; CSS falls back to the OS setting.
  function applyTheme(t) {
    try {
      var ctx = t.getContext && t.getContext();
      if (ctx && (ctx.theme === 'dark' || ctx.theme === 'light')) {
        document.documentElement.setAttribute('data-theme', ctx.theme);
      }
    } catch (e) {
      /* no theme info: keep the default */
    }
  }

  function canWrite(t, model) {
    try {
      if (typeof t.memberCanWriteToModel === 'function') {
        return t.memberCanWriteToModel(model) !== false;
      }
    } catch (e) {
      /* unknown: allow, Trello will reject the write if not permitted */
    }
    return true;
  }

  // Keep the Trello iframe as tall as its content, including after late
  // layout changes (stylesheets/fonts loading, wrapping on narrow cards).
  function autoSize(t, selector) {
    var node = document.querySelector(selector);
    if (!node) return;
    t.sizeTo(selector);
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(function () {
        t.sizeTo(selector);
      }).observe(node);
    } else {
      window.addEventListener('load', function () {
        t.sizeTo(selector);
      });
    }
  }

  root.UI = { el: el, applyTheme: applyTheme, canWrite: canWrite, autoSize: autoSize };
})(window);
