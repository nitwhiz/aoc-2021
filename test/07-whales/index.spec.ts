import Whales from '../../src/07-whales';

test('alignCrabs', () => {
  const w = new Whales(['16,1,2,0,4,2,7,1,2,14']);

  expect(w.alignCrabs()).toBe(168);
});
