/*
 * Development-only stand-in for Trello's Power-Up client library.
 * Lets dev/preview.html exercise js/client.js and js/section.js locally.
 * Never loaded by the real Power-Up.
 */
(function () {
  'use strict';

  var top = window.top;
  if (!top.__priorityMock) {
    top.__priorityMock = {
      data: {},          // { [cardId]: { [key]: value } }
      activeCard: null,  // card shown in the card-back section
      theme: 'light',
      canEdit: true,
      listeners: [],     // render callbacks from the section frame
      onChange: null,    // preview page redraw hook
      capabilities: null,
    };
  }
  var store = top.__priorityMock;

  function clone(v) {
    return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
  }

  function notify() {
    store.listeners.forEach(function (fn) {
      try { fn(); } catch (e) { /* frame may be gone */ }
    });
    if (store.onChange) store.onChange();
  }

  function makeT(cardId) {
    function resolveId(scope) {
      return scope === 'card' ? cardId || store.activeCard : scope;
    }
    return {
      get: function (scope, visibility, key, def) {
        var bucket = store.data[resolveId(scope)] || {};
        var v = bucket[key];
        return Promise.resolve(v === undefined ? def : clone(v));
      },
      set: function (scope, visibility, key, value) {
        var id = resolveId(scope);
        if (!store.canEdit) return Promise.reject(new Error('read only'));
        store.data[id] = store.data[id] || {};
        store.data[id][key] = clone(value);
        setTimeout(notify, 0);
        return Promise.resolve();
      },
      remove: function (scope, visibility, key) {
        var id = resolveId(scope);
        if (!store.canEdit) return Promise.reject(new Error('read only'));
        if (store.data[id]) delete store.data[id][key];
        setTimeout(notify, 0);
        return Promise.resolve();
      },
      popup: function (opts) {
        if (store.onPopup) store.onPopup(opts);
        return Promise.resolve();
      },
      closePopup: function () {
        if (store.onClosePopup) store.onClosePopup();
        return Promise.resolve();
      },
      render: function (fn) {
        store.listeners.push(fn);
        fn();
      },
      sizeTo: function (selector) {
        var node = document.querySelector(selector);
        if (node && window.frameElement) {
          window.frameElement.style.height = node.scrollHeight + 'px';
        }
        return Promise.resolve();
      },
      signUrl: function (url) { return url; },
      getContext: function () { return { theme: store.theme }; },
      memberCanWriteToModel: function () { return store.canEdit; },
    };
  }

  window.TrelloPowerUp = {
    initialize: function (capabilities) { store.capabilities = capabilities; },
    iframe: function () { return makeT(null); },
    _mock: { store: store, makeT: makeT, notify: notify },
  };
})();
