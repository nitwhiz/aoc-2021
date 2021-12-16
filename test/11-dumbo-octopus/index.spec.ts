import OctopusMap, {
  hasFlashed,
  setFlashed,
  unsetFlashed,
} from '../../src/11-dumbo-octopus/OctopusMap';

test('hasFlashed', () => {
  expect(hasFlashed(0b00010101)).toBe(true);
  expect(hasFlashed(0b00000101)).toBe(false);
  expect(hasFlashed(0b01000101)).toBe(false);
});

test('setFlashed', () => {
  expect(setFlashed(0b00000101)).toBe(0b00010101);
  expect(setFlashed(0b00010101)).toBe(0b00010101);
  expect(setFlashed(0b00000000)).toBe(0b00010000);
});

test('unsetFlashed', () => {
  expect(unsetFlashed(0b00000101)).toBe(0b00000101);
  expect(unsetFlashed(0b00010101)).toBe(0b00000101);
  expect(unsetFlashed(0b00000000)).toBe(0b00000000);
});

test('fromInput', () => {
  const octoMap = OctopusMap.fromInput(
    [
      '5483143223',
      '2745854711',
      '5264556173',
      '6141336146',
      '6357385478',
      '4167524645',
      '2176841721',
      '6882881134',
      '4846848554',
      '5283751526',
    ].map((l) => l.split('').map((x) => Number(x))),
  );

  expect(octoMap.stringify()).toBe(
    '5483143223\n' +
      '2745854711\n' +
      '5264556173\n' +
      '6141336146\n' +
      '6357385478\n' +
      '4167524645\n' +
      '2176841721\n' +
      '6882881134\n' +
      '4846848554\n' +
      '5283751526\n',
  );
});

test('ticking 1', () => {
  const octoMap = OctopusMap.fromInput(
    ['11111', '19991', '19191', '19991', '11111'].map((l) =>
      l.split('').map((x) => Number(x)),
    ),
  );

  octoMap.tick();

  expect(octoMap.stringify()).toBe(
    '34543\n' + '40004\n' + '50005\n' + '40004\n' + '34543\n',
  );

  octoMap.tick();

  expect(octoMap.stringify()).toBe(
    '45654\n' + '51115\n' + '61116\n' + '51115\n' + '45654\n',
  );
});

test('ticking 2', () => {
  const octoMap = OctopusMap.fromInput(
    [
      '5483143223',
      '2745854711',
      '5264556173',
      '6141336146',
      '6357385478',
      '4167524645',
      '2176841721',
      '6882881134',
      '4846848554',
      '5283751526',
    ].map((l) => l.split('').map((x) => Number(x))),
  );

  octoMap.tick();

  expect(octoMap.stringify()).toBe(
    '6594254334\n' +
      '3856965822\n' +
      '6375667284\n' +
      '7252447257\n' +
      '7468496589\n' +
      '5278635756\n' +
      '3287952832\n' +
      '7993992245\n' +
      '5957959665\n' +
      '6394862637\n',
  );

  octoMap.tick();

  expect(octoMap.stringify()).toBe(
    '8807476555\n' +
      '5089087054\n' +
      '8597889608\n' +
      '8485769600\n' +
      '8700908800\n' +
      '6600088989\n' +
      '6800005943\n' +
      '0000007456\n' +
      '9000000876\n' +
      '8700006848\n',
  );

  octoMap.tick();

  expect(octoMap.stringify()).toBe(
    '0050900866\n' +
      '8500800575\n' +
      '9900000039\n' +
      '9700000041\n' +
      '9935080063\n' +
      '7712300000\n' +
      '7911250009\n' +
      '2211130000\n' +
      '0421125000\n' +
      '0021119000\n',
  );

  octoMap.tick();

  expect(octoMap.stringify()).toBe(
    '2263031977\n' +
      '0923031697\n' +
      '0032221150\n' +
      '0041111163\n' +
      '0076191174\n' +
      '0053411122\n' +
      '0042361120\n' +
      '5532241122\n' +
      '1532247211\n' +
      '1132230211\n',
  );
});

test('multitick', () => {
  const octoMap = OctopusMap.fromInput(
    [
      '5483143223',
      '2745854711',
      '5264556173',
      '6141336146',
      '6357385478',
      '4167524645',
      '2176841721',
      '6882881134',
      '4846848554',
      '5283751526',
    ].map((l) => l.split('').map((x) => Number(x))),
  );

  octoMap.tick(4);

  expect(octoMap.stringify()).toBe(
    '2263031977\n' +
      '0923031697\n' +
      '0032221150\n' +
      '0041111163\n' +
      '0076191174\n' +
      '0053411122\n' +
      '0042361120\n' +
      '5532241122\n' +
      '1532247211\n' +
      '1132230211\n',
  );
});

test('flashcount', () => {
  const octoMap = OctopusMap.fromInput(
    [
      '5483143223',
      '2745854711',
      '5264556173',
      '6141336146',
      '6357385478',
      '4167524645',
      '2176841721',
      '6882881134',
      '4846848554',
      '5283751526',
    ].map((l) => l.split('').map((x) => Number(x))),
  );

  octoMap.tick(100);

  expect(octoMap.getFlashCount()).toBe(1656);
});
