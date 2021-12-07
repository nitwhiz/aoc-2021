import HydrothermalVenture from '../../src/05-hydrothermal-venture';

test('build map correctly - no diagonals', () => {
  const hv = new HydrothermalVenture([
    '0,9 -> 5,9',
    '8,0 -> 0,8',
    '9,4 -> 3,4',
    '2,2 -> 2,1',
    '7,0 -> 7,4',
    '6,4 -> 2,0',
    '0,9 -> 2,9',
    '3,4 -> 1,4',
    '0,0 -> 8,8',
    '5,5 -> 8,2',
  ]);

  hv.parseInput(false);

  expect(hv.getMapAsString()).toBe(
    '.......1..\n' +
      '..1....1..\n' +
      '..1....1..\n' +
      '.......1..\n' +
      '.112111211\n' +
      '..........\n' +
      '..........\n' +
      '..........\n' +
      '..........\n' +
      '222111....\n',
  );
});

test('build map correctly - w/ diagonals', () => {
  const hv = new HydrothermalVenture([
    '0,9 -> 5,9',
    '8,0 -> 0,8',
    '9,4 -> 3,4',
    '2,2 -> 2,1',
    '7,0 -> 7,4',
    '6,4 -> 2,0',
    '0,9 -> 2,9',
    '3,4 -> 1,4',
    '0,0 -> 8,8',
    '5,5 -> 8,2',
  ]);

  hv.parseInput(true);

  expect(hv.getMapAsString()).toBe(
    '1.1....11.\n' +
      '.111...2..\n' +
      '..2.1.111.\n' +
      '...1.2.2..\n' +
      '.112313211\n' +
      '...1.2....\n' +
      '..1...1...\n' +
      '.1.....1..\n' +
      '1.......1.\n' +
      '222111....\n',
  );
});
