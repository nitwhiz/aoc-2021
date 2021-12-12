import { autocompleteLine, validateLine } from '../../src/10-syntax-scoring';

test('validateLine', () => {
  expect(validateLine('{([(<{}[<>[]}>{[]{[(<()>')).toBe(1197);
  expect(validateLine('[[<[([]))<([[{}[[()]]]')).toBe(3);
  expect(validateLine('[{[{({}]{}}([{[{{{}}([]')).toBe(57);
  expect(validateLine('[<(<(<(<{}))><([]([]()')).toBe(3);
  expect(validateLine('<{([([[(<>()){}]>(<<{{')).toBe(25137);
});

test('autocompleteLine', () => {
  expect(autocompleteLine('[({(<(())[]>[[{[]{<()<>>')).toBe(288957);
  expect(autocompleteLine('[(()[<>])]({[<{<<[]>>(')).toBe(5566);
  expect(autocompleteLine('(((({<>}<{<{<>}{[]{[]{}')).toBe(1480781);
  expect(autocompleteLine('{<[[]]>}<{[{[{[]{()[[[]')).toBe(995444);
  expect(autocompleteLine('<{([{{}}[<[[[<>{}]]]>[]]')).toBe(294);
});
