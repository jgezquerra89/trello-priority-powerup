/*
 * Priority logic: five levels, 1 = Highest ... 5 = Lowest, renameable per board.
 * Pure functions, no Trello dependency. Works in the browser (window.Priority)
 * and in Node (module.exports) so it can be unit tested.
 */
(function (root) {
  'use strict';

  var LEVELS = [
    { value: 1, defaultName: 'Highest', color: 'red' },
    { value: 2, defaultName: 'High', color: 'orange' },
    { value: 3, defaultName: 'Medium', color: 'yellow' },
    { value: 4, defaultName: 'Low', color: 'blue' },
    { value: 5, defaultName: 'Lowest', color: 'light-gray' },
  ];

  var MAX_NAME_LENGTH = 30;

  function isLevel(v) {
    return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= LEVELS.length;
  }

  function customAt(custom, i) {
    if (!Array.isArray(custom) || typeof custom[i] !== 'string') return '';
    return custom[i].trim().slice(0, MAX_NAME_LENGTH);
  }

  // Display names for all five levels: board's custom name, else the default.
  function names(custom) {
    return LEVELS.map(function (level, i) {
      return customAt(custom, i) || level.defaultName;
    });
  }

  // What to save for board settings: trimmed custom names, '' where it matches
  // the default (so a blank always means "use the default").
  function cleanNames(input) {
    return LEVELS.map(function (level, i) {
      var name = customAt(input, i);
      return name === level.defaultName ? '' : name;
    });
  }

  function badge(level, custom) {
    if (!isLevel(level)) return null;
    return { text: names(custom)[level - 1], color: LEVELS[level - 1].color };
  }

  // cards: [{ id, level }] in current list order.
  function sortIds(cards) {
    return cards
      .map(function (card, index) {
        return { id: card.id, rank: isLevel(card.level) ? card.level : Infinity, index: index };
      })
      .sort(function (a, b) {
        if (a.rank !== b.rank) return a.rank < b.rank ? -1 : 1;
        return a.index - b.index;
      })
      .map(function (e) {
        return e.id;
      });
  }

  var Priority = {
    LEVELS: LEVELS,
    MAX_NAME_LENGTH: MAX_NAME_LENGTH,
    CARD_KEY: 'priority',
    NAMES_KEY: 'priorityNames',
    isLevel: isLevel,
    names: names,
    cleanNames: cleanNames,
    badge: badge,
    sortIds: sortIds,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Priority;
  } else {
    root.Priority = Priority;
  }
})(typeof window !== 'undefined' ? window : this);
