/* global TrelloPowerUp, Priority, UI */
(function () {
  'use strict';

  var t = TrelloPowerUp.iframe();
  var el = UI.el;
  var app = document.getElementById('app');
  var canEdit = UI.canWrite(t, 'board');

  UI.applyTheme(t);
  UI.autoSize(t, '#app');

  function draw(current) {
    app.textContent = '';
    var shown = Priority.names(current);

    var inputs = Priority.LEVELS.map(function (l, i) {
      var input = el('input', {
        type: 'text',
        id: 'level-' + l.value,
        maxlength: String(Priority.MAX_NAME_LENGTH),
        placeholder: l.defaultName,
        value: shown[i] === l.defaultName ? '' : shown[i],
        autocomplete: 'off',
      });
      if (!canEdit) input.disabled = true;
      return input;
    });

    var form = el('form', { class: 'settings' }, [
      el('p', { class: 'hint', text: 'Rename the levels for this board. Leave a field empty to use the default.' }),
    ]);

    Priority.LEVELS.forEach(function (l, i) {
      form.appendChild(
        el('label', { class: 'setting-row', for: 'level-' + l.value }, [
          el('span', { class: 'dot level-' + l.value, 'aria-hidden': 'true' }),
          el('span', { class: 'setting-label', text: 'Level ' + l.value }),
          inputs[i],
        ])
      );
    });

    var status = el('p', { class: 'message', id: 'message' });
    var save = el('button', { type: 'submit', class: 'mod-primary', text: 'Save' });
    var reset = el('button', { type: 'button', class: 'link-button', text: 'Reset to defaults' });
    if (!canEdit) {
      save.disabled = true;
      reset.disabled = true;
      status.textContent = 'View only: board members can change these names.';
    }

    reset.addEventListener('click', function () {
      inputs.forEach(function (input) {
        input.value = '';
      });
      inputs[0].focus();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!canEdit) return;
      save.disabled = true;
      var values = Priority.cleanNames(
        inputs.map(function (input) {
          return input.value;
        })
      );
      t.set('board', 'shared', Priority.NAMES_KEY, values)
        .then(function () {
          return t.closePopup();
        })
        .catch(function () {
          save.disabled = false;
          status.textContent = 'Could not save. Only board members can change these names.';
          t.sizeTo('#app');
        });
    });

    form.appendChild(el('div', { class: 'actions' }, [save, reset]));
    form.appendChild(status);
    app.appendChild(form);
    t.sizeTo('#app');
  }

  t.get('board', 'shared', Priority.NAMES_KEY, null).then(draw);
})();
