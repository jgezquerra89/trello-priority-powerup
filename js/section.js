/* global TrelloPowerUp, Priority, UI */
(function () {
  'use strict';

  var t = TrelloPowerUp.iframe();
  var el = UI.el;
  var app = document.getElementById('app');
  var level = null;
  var names = Priority.names();
  var canEdit = UI.canWrite(t, 'card');
  var pending = 0; // saves in flight; while > 0, local state wins over re-renders

  UI.applyTheme(t);
  UI.autoSize(t, '#app');

  function setMessage(text) {
    var msg = document.getElementById('message');
    if (msg) msg.textContent = text;
    t.sizeTo('#app');
  }

  function choose(value) {
    if (!canEdit) return;
    // Clicking the selected level again clears it.
    var next = level === value ? null : value;
    level = next;
    pending++;
    draw();
    var write =
      next === null
        ? t.remove('card', 'shared', Priority.CARD_KEY)
        : t.set('card', 'shared', Priority.CARD_KEY, next);
    write
      .catch(function () {
        setMessage('Could not save. Only workspace members can change priority.');
      })
      .then(function () {
        pending--;
      });
  }

  function draw() {
    app.textContent = '';
    var buttons = Priority.LEVELS.map(function (l, i) {
      var selected = level === l.value;
      var btn = el(
        'button',
        {
          type: 'button',
          class: 'level level-' + l.value + (selected ? ' is-selected' : ''),
          'aria-pressed': selected ? 'true' : 'false',
          title: selected ? 'Click again to clear' : 'Set priority to ' + names[i],
        },
        [el('span', { class: 'dot', 'aria-hidden': 'true' }), el('span', { text: names[i] })]
      );
      if (!canEdit) btn.disabled = true;
      btn.addEventListener('click', function () {
        choose(l.value);
      });
      return btn;
    });

    app.appendChild(el('div', { class: 'levels', role: 'group', 'aria-label': 'Priority' }, buttons));
    app.appendChild(
      el('p', {
        id: 'message',
        class: 'message',
        text: canEdit ? '' : 'View only: workspace members can change priority.',
      })
    );
    t.sizeTo('#app');
  }

  // Trello calls this on load and whenever card or board plugin data changes.
  t.render(function () {
    return Promise.all([
      t.get('card', 'shared', Priority.CARD_KEY, null),
      t.get('board', 'shared', Priority.NAMES_KEY, null),
    ]).then(function (r) {
      if (!pending) level = Priority.isLevel(r[0]) ? r[0] : null;
      names = Priority.names(r[1]);
      draw();
    });
  });
})();
