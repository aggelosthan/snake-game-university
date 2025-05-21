
import { info, move, floodFill } from './index.js';

describe('Battlesnake API', () => {
  test('info() returns correct snake information', () => {
    const result = info();
    expect(result).toHaveProperty('apiversion', '1');
    expect(result).toHaveProperty('author');
    expect(result).toHaveProperty('color');
    expect(result).toHaveProperty('head');
    expect(result).toHaveProperty('tail');
  });

  describe('move()', () => {
    const baseGameState = {
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

    test('returns valid move', () => {
      const result = move(baseGameState);
      expect(result).toHaveProperty('move');
      expect(['up', 'down', 'left', 'right']).toContain(result.move);
    });

    test('avoids walls', () => {
      const wallState = {...baseGameState};
      wallState.you.head = { x: 0, y: 5 };
      wallState.you.body = [{ x: 0, y: 5 }, { x: 0, y: 4 }];
      
      const result = move(wallState);
      expect(result.move).not.toBe('left');
    });

    test('avoids self collision', () => {
      const selfCollisionState = {...baseGameState};
      selfCollisionState.you.body = [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 4, y: 4 },
        { x: 4, y: 5 }
      ];
      
      const result = move(selfCollisionState);
      expect(result.move).not.toBe('down');
    });

    test('moves towards food when available', () => {
      const foodState = {...baseGameState};
      foodState.board.food = [{ x: 7, y: 5 }];
      
      const result = move(foodState);
      expect(result.move).toBe('right');
    });
  });

  describe('floodFill()', () => {
    test('returns correct count of accessible spaces', () => {
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
      expect(floodFill(board, start)).toBe(7);
    });

    test('handles blocked paths correctly', () => {
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

      const start = { x: 0, y: 0 };
      expect(floodFill(blockedBoard, start)).toBe(3);
    });

    test('handles edge cases', () => {
      const emptyBoard = {
        width: 3,
        height: 3,
        snakes: []
      };

      expect(floodFill(emptyBoard, { x: 0, y: 0 })).toBe(9);
      expect(floodFill(emptyBoard, { x: -1, y: 0 })).toBe(0);
    });
  });
});
