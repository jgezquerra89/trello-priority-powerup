const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../js/priority.js');

test('there are five levels, Highest (1) to Lowest (5), each with a color', () => {
  assert.deepEqual(
    P.LEVELS.map((l) => [l.value, l.defaultName, l.color]),
    [
      [1, 'Highest', 'red'],
      [2, 'High', 'orange'],
      [3, 'Medium', 'yellow'],
      [4, 'Low', 'blue'],
      [5, 'Lowest', 'light-gray'],
    ]
  );
});

test('isLevel accepts only integers 1-5', () => {
  [1, 2, 3, 4, 5].forEach((v) => assert.equal(P.isLevel(v), true));
  [0, 6, 2.5, '1', null, undefined, NaN].forEach((v) => assert.equal(P.isLevel(v), false, String(v)));
});

test('names falls back to defaults for missing or blank custom names', () => {
  assert.deepEqual(P.names(), ['Highest', 'High', 'Medium', 'Low', 'Lowest']);
  assert.deepEqual(P.names(null), ['Highest', 'High', 'Medium', 'Low', 'Lowest']);
  assert.deepEqual(P.names(['P0', '  ', null, 'Later', 42]), ['P0', 'High', 'Medium', 'Later', 'Lowest']);
  assert.deepEqual(P.names(['  Urgent  ']), ['Urgent', 'High', 'Medium', 'Low', 'Lowest']);
});

test('names truncates very long custom names', () => {
  const long = 'x'.repeat(100);
  assert.equal(P.names([long])[0].length, P.MAX_NAME_LENGTH);
});

test('cleanNames stores blanks for names equal to the default, so defaults can change later', () => {
  assert.deepEqual(P.cleanNames(['Highest', ' P1 ', '', 'Low', 'Someday']), ['', 'P1', '', '', 'Someday']);
  assert.deepEqual(P.cleanNames(null), ['', '', '', '', '']);
});

test('badge shows the level name and color, or nothing when unset', () => {
  assert.deepEqual(P.badge(1), { text: 'Highest', color: 'red' });
  assert.deepEqual(P.badge(4, ['', '', '', 'Later']), { text: 'Later', color: 'blue' });
  assert.equal(P.badge(null), null);
  assert.equal(P.badge(9), null);
});

test('sortIds puts highest priority first, unset last, ties keep list order', () => {
  const cards = [
    { id: 'a', level: 3 },
    { id: 'b', level: null },
    { id: 'c', level: 1 },
    { id: 'd', level: 5 },
    { id: 'e', level: 3 },
    { id: 'f', level: 'junk' },
    { id: 'g', level: 2 },
  ];
  assert.deepEqual(P.sortIds(cards), ['c', 'g', 'a', 'e', 'd', 'b', 'f']);
});
