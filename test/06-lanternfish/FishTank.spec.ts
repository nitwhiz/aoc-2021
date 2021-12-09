import FishTank from '../../src/06-lanternfish/FishTank';

test('evolution', () => {
  const tf = new FishTank([3, 4, 3, 1, 2]);

  expect(tf.tickUntil(18).getFishCount()).toBe(26);
  expect(tf.tickUntil(80).getFishCount()).toBe(5934);
  expect(tf.tickUntil(256).getFishCount()).toBe(26984457539);
});
