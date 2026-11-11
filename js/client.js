/* global TrelloPowerUp, Priority */
(function () {
  'use strict';

  // Trello needs absolute icon URLs; resolve them against this script's own location
  // (js/client.js) so they work wherever the Power-Up is hosted.
  var BASE = (document.currentScript && document.currentScript.src) || window.location.href;
  var ICON = new URL('../img/icon.svg', BASE).href;
  var ICON_WHITE = new URL('../img/icon-white.svg', BASE).href;

  function getLevel(t, scope) {
    return t.get(scope || 'card', 'shared', Priority.CARD_KEY, null);
  }

  function getNames(t) {
    return t.get('board', 'shared', Priority.NAMES_KEY, null);
  }

  TrelloPowerUp.initialize({
    // Front of the card: the level name in its color. No badge when unset.
    'card-badges': function (t) {
      return Promise.all([getLevel(t), getNames(t)]).then(function (r) {
        var b = Priority.badge(r[0], r[1]);
        return b ? [{ text: b.text, color: b.color, icon: ICON_WHITE }] : [];
      });
    },

    // Back of the card: one-click level picker.
    'card-back-section': function (t) {
      return {
        title: 'Priority',
        icon: ICON,
        content: {
          type: 'iframe',
          url: t.signUrl('./section.html'),
          height: 44,
        },
      };
    },

    // List menu > Sort By... > "Priority (highest first)".
    'list-sorters': function (t) {
      return [
        {
          text: 'Priority (highest first)',
          callback: function (t, opts) {
            return Promise.all(
              opts.cards.map(function (card) {
                return getLevel(t, card.id).then(function (level) {
                  return { id: card.id, level: level };
                });
              })
            ).then(function (cards) {
              return { sortedIds: Priority.sortIds(cards) };
            });
          },
        },
      ];
    },

    // Power-Ups menu > Priority > Settings: rename the levels for this board.
    'show-settings': function (t) {
      return t.popup({
        title: 'Priority settings',
        url: './settings.html',
        height: 300,
      });
    },
  });
})();
