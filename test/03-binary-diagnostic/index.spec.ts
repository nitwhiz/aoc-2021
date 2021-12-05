import BinaryDiagnostic from '../../src/03-binary-diagnostic';

const bd = new BinaryDiagnostic([
  '00100',
  '11110',
  '10110',
  '10111',
  '10101',
  '01111',
  '00111',
  '11100',
  '10000',
  '11001',
  '00010',
  '01010',
]);

test('getPowerConsumption', () => {
  expect(bd.getPowerConsumption()).toStrictEqual({
    g: 22,
    e: 9,
    pc: 198,
  });
});

test('getLifeSupportRating', () => {
  expect(bd.getLifeSupportRating()).toStrictEqual({
    o2: 23,
    co2: 10,
    ls: 230,
  });
});
