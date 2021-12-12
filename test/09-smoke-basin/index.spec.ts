import SmokeBasin from '../../src/09-smoke-basin';

test('getRiskLevelSum', () => {
  const sb = new SmokeBasin([
    '2199943210',
    '3987894921',
    '9856789892',
    '8767896789',
    '9899965678',
  ]);

  expect(sb.getRiskLevelSum()).toBe(15);
});

test('getBasinSizes', () => {
  const sb = new SmokeBasin([
    '2199943210',
    '3987894921',
    '9856789892',
    '8767896789',
    '9899965678',
  ]);

  const sizes = [3, 9, 14, 9];
  const returns = [];

  for (const size of sb.getBasinSizes()) {
    returns.push(size);
  }

  expect(returns).toStrictEqual(sizes);
});
