import { info, move } from './index.js';

describe('Battlesnake API', () => {
  test('info() returns correct snake information', () => {
    const result = info();
    expect(result).toHaveProperty('apiversion', '1');
    expect(result).toHaveProperty('author');
    expect(result).toHaveProperty('color');
    expect(result).toHaveProperty('head');
    expect(result).toHaveProperty('tail');
  });

  test('move() returns valid move', () => {
    const gameState = {
      game: { id: '1234' },
      turn: 1,
      board: {
        height: 11,
        width: 11,
        food: [],
        snakes: []
      },
      you: {
        id: 'you',
        head: { x: 5, y: 5 },
        body: [
          { x: 5, y: 5 },
          { x: 5, y: 4 }
        ],
        length: 2
      }
    };

    const result = move(gameState);
    expect(result).toHaveProperty('move');
    expect(['up', 'down', 'left', 'right']).toContain(result.move);
  });

test('floodFill should return correct count of accessible spaces', () => {
    const board = {
      width: 3,
      height: 3,
      snakes: [{
        body: [
          { x: 1, y: 1 },
          { x: 1, y: 0 }
        ]
      }]
    };

    const start = { x: 0, y: 0 };
    expect(floodFill(board, start)).toBe(7); // Should access 7 spaces

    const blockedBoard = {
      width: 3,
      height: 3,
      snakes: [{
        body: [
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 2 }
        ]
      }]
    };

    expect(floodFill(blockedBoard, start)).toBe(3); // Should only access left side
  });
});