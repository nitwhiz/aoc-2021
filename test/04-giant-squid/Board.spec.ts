import Board from '../../src/04-giant-squid/Board';

const data = [
  {
    name: 'win 1',
    board: ['1 2 3', '4 5 6', '7 8 9'],
    marked: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    win: true,
  },
  {
    name: 'win 2',
    board: ['1 2 3', '4 5 6', '7 8 9'],
    marked: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    win: true,
  },
  {
    name: 'win 3',
    board: ['1 2 3', '4 5 6', '7 8 9'],
    marked: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    win: true,
  },
  {
    name: 'win 4',
    board: ['1 2 3', '4 5 6', '7 8 9'],
    marked: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    win: true,
  },
  {
    name: 'win 5: too many marks',
    board: ['1 2 3', '4 5 6', '7 8 9'],
    marked: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
    ],
    win: true,
  },
  {
    name: 'win 6: input formatting',
    board: ['10  2 30', ' 4  5  6', ' 7 18  9'],
    marked: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    win: true,
  },
  {
    name: 'loss 1: not enough marks',
    board: ['1 2 3', '4 5 6', '7 8 9'],
    marked: [
      { x: 2, y: 0 },
      { x: 2, y: 2 },
    ],
    win: false,
  },
  {
    name: 'loss 2: misplaced marks',
    board: ['1 2 3', '4 5 6', '7 8 9'],
    marked: [
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    win: false,
  },
];

test.each(data)('isWon', ({ board, marked, win }) => {
  const b = new Board(board);

  for (const m of marked) {
    b.markXY(m.x, m.y);
  }

  expect(b.isWon()).toBe(win);
});

test('markNumber: unmarked number', () => {
  const b = new Board(['1 2 3', '40 5 6', '7 8 9']);

  b.markNumber(40);

  expect(b.isMarkedXY(0, 1)).toBe(true);
  expect(b.getXY(0, 1)).toBe(40);
});

test('getUnmarkedSum', () => {
  const b = new Board(['1 2 3', '4 5 6', '7 8 9']);

  b.markNumber(4);
  b.markNumber(5);
  b.markNumber(1);

  expect(b.getUnmarkedSum()).toBe(35);
});
