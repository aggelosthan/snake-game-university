// Welcome to
// ______         _    _  .__                               __
// \______   \_____ /  |__/  |_|  |   _   __
//  |    |  /\_  \\   \   __\  | _/ _ \ /  __//    \\  \ |  |/ // __ \
//  |    |   \ / _ \|  |  |  | |  |_\  __/ \_ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log('INFO');

  return {
    apiversion: '1',
    author: 'aggelos',
    name: 'John Cena The Snaky Snake Snicker',
    color: '#FF69B4',  // Hot pink color
    head: 'pixel',     // Retro pixel head
    tail: 'pixel',     // Matching pixel tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log('GAME START');
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log('GAME OVER\n');
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    // Neck is left of head, don't move left
    isMoveSafe.left = false;
  } else if (myNeck.x > myHead.x) {
    // Neck is right of head, don't move right
    isMoveSafe.right = false;
  } else if (myNeck.y < myHead.y) {
    // Neck is below head, don't move down
    isMoveSafe.down = false;
  } else if (myNeck.y > myHead.y) {
    // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  // boardWidth = gameState.board.width;
  // boardHeight = gameState.board.height;
  // Prevent your Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  // Check if moving in each direction would hit a wall
  if (myHead.x === 0) {
    isMoveSafe.left = false;
  }
  if (myHead.x === boardWidth - 1) {
    isMoveSafe.right = false;
  }
  if (myHead.y === 0) {
    isMoveSafe.down = false;
  }
  if (myHead.y === boardHeight - 1) {
    isMoveSafe.up = false;
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  // myBody = gameState.you.body
  const myBody = gameState.you.body;

  // Check if any move would collide with our own body
  myBody.forEach((segment) => {
    if (segment.x === myHead.x - 1 && segment.y === myHead.y) {
      isMoveSafe.left = false;
    }
    if (segment.x === myHead.x + 1 && segment.y === myHead.y) {
      isMoveSafe.right = false;
    }
    if (segment.x === myHead.x && segment.y === myHead.y - 1) {
      isMoveSafe.down = false;
    }
    if (segment.x === myHead.x && segment.y === myHead.y + 1) {
      isMoveSafe.up = false;
    }
  });

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // opponents = gameState.board.snakes;
  // Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;

  opponents.forEach((snake) => {
    // Only check collision with non-tail segments if snake will eat food
    const food = gameState.board.food;
    const willEatFood = food.some(f => 
      (f.x === myHead.x - 1 && f.y === myHead.y && isMoveSafe.left) ||
      (f.x === myHead.x + 1 && f.y === myHead.y && isMoveSafe.right) ||
      (f.x === myHead.x && f.y === myHead.y - 1 && isMoveSafe.down) ||
      (f.x === myHead.x && f.y === myHead.y + 1 && isMoveSafe.up)
    );

    snake.body.forEach((segment, index) => {
      const isTail = index === snake.body.length - 1;
      if (willEatFood || !isTail) {
        if (segment.x === myHead.x - 1 && segment.y === myHead.y) {
          isMoveSafe.left = false;
        }
        if (segment.x === myHead.x + 1 && segment.y === myHead.y) {
          isMoveSafe.right = false;
        }
        if (segment.x === myHead.x && segment.y === myHead.y - 1) {
          isMoveSafe.down = false;
        }
        if (segment.x === myHead.x && segment.y === myHead.y + 1) {
          isMoveSafe.up = false;
        }
      }
    });
  });
  // Step 3.5 - Avoid standing next to heads of larger or equal snakes
  const myLength = gameState.you.length;

  opponents.forEach((snake) => {
    const theirHead = snake.body[0];
    const theirLength = snake.length;

    if (theirLength >= myLength) {
      if (myHead.x - 1 === theirHead.x && myHead.y === theirHead.y)                       isMoveSafe.left = false;
      if (myHead.x + 1 === theirHead.x && myHead.y === theirHead.y)                       isMoveSafe.right = false;
      if (myHead.x === theirHead.x && myHead.y - 1 === theirHead.y)                       isMoveSafe.down = false;
      if (myHead.x === theirHead.x && myHead.y + 1 === theirHead.y) isMoveSafe.up = false;
    }
  });

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: 'down' };
  }

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  const food = gameState.board.food;

  let closestFood = null;
  let minDistance = Infinity;

  food.forEach((f) => {
    const distance = Math.abs(myHead.x - f.x) + Math.abs(myHead.y - f.y);
    if (distance < minDistance) {
      minDistance = distance;
      closestFood = f;
    }
  });

  let nextMove = 'down'; // default fallback

  if (closestFood) {
    const dx = closestFood.x - myHead.x;
    const dy = closestFood.y - myHead.y;

    const preferredMoves = [];

    if (dx < 0) preferredMoves.push('left');
    if (dx > 0) preferredMoves.push('right');
    if (dy < 0) preferredMoves.push('down');
    if (dy > 0) preferredMoves.push('up');

    for (const move of preferredMoves) {
      if (isMoveSafe[move]) {
        nextMove = move;
        break;
      }
    }

    if (!isMoveSafe[nextMove]) {
      nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    }
  } else {
    nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
  }

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

function floodFill(board, start) {
  const visited = new Set();
  const queue = [start];

  function isValid(point) {
    if (point.x < 0 || point.x >= board.width || point.y < 0 || point.y >= board.height) {
      return false;
    }

    const key = `${point.x},${point.y}`;
    if (visited.has(key)) {
      return false;
    }

    // Check if point collides with any snake
    return !board.snakes.some(snake => 
      snake.body.some(segment => segment.x === point.x && segment.y === point.y)
    );
  }

  while (queue.length > 0) {
    const current = queue.shift();
    const key = `${current.x},${current.y}`;

    if (!isValid(current)) {
      continue;
    }

    visited.add(key);

    // Add adjacent cells
    queue.push(
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 }
    );
  }

  return visited.size;
}

export { info, move, floodFill };
export default runServer({
  info,
  start,
  move,
  end,
});