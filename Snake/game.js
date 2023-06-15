window.addEventListener('load', () => {
  const canvas = document.querySelector('#snake');
  const context = canvas.getContext('2d');
  const gridSize = 75;

  const canvasWidthInBlocks = Math.floor(canvas.width / gridSize);
  const canvasHeightInBlocks = Math.floor(canvas.height / gridSize);

  let snake = [{ x: 0, y: 0, width: gridSize, height: gridSize }];
  let direction = 'down';
  let nextDirection = 'down'; // Store the next direction to be applied
  let score = 0;
  let apple = { x: 0, y: 0, size: gridSize };
  let isGameOver = false;
  let gameTimer = null;
  let isGameWon = false;

  function updateGameScore(score) {
    let scoreElement = document.getElementById('game-score');
    scoreElement.textContent = `Apples eaten: ${score}`;
  }

   function updateSnakePosition() {
    // Clear the canvas and redraw the grid
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each segment of the snake
    context.fillStyle = 'green';
    for (let i = 0; i < snake.length; i++) {
      const segment = snake[i];
      context.fillRect(segment.x, segment.y, segment.width, segment.height);
    }
  }

function gameOver() {
  isGameOver = true;
  if(score == 63){
      isGameWon = true;
      canvas.style.backgroundColor = 'gold';
    } else{
    canvas.style.backgroundColor = 'red';
    }
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
 
  // Set the text properties
  context.font = '40px Arial';
  context.fillStyle = 'white';
  context.textAlign = 'center';

  if (isGameWon) {
    // Display "You WON" message
    context.fillText(`You WON! Score: ${score}`, canvas.width / 2, canvas.height / 2);
    context.font = '20px Arial';
    context.fillText('Thanks For Playing!', canvas.width / 2, canvas.height / 2 + 30);
  } else {
    // Display "Game Over" message
    context.fillText(`Game Over! Score: ${score}`, canvas.width / 2, canvas.height / 2);
    context.font = '20px Arial';
    context.fillText('Click any key to restart', canvas.width / 2, canvas.height / 2 + 30);
  }

    // Listen for any keydown event to restart the game
    document.addEventListener('keydown', restartGame);
  }

  function restartGame(event) {
    clearTimeout(gameTimer);
    score = 0;
    updateGameScore(score);
    canvas.style.backgroundColor = 'grey'
    // Check if the game is over and a key is pressed
    if (isGameOver) {
      // Remove the event listener
      document.removeEventListener('keydown', restartGame);

      // Reset the game state
      snake = [{ x: 0, y: 0, width: gridSize, height: gridSize }];
      direction = 'down';
      nextDirection = 'down';
      score = 0;
      generateRandomApple();
      isGameOver = false;
      gameLoop(); // Start the game loop
    }
  }

function handleInput(event) {
    // Update the next direction based on user input
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'down')
          nextDirection = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up')
          nextDirection = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right')
          nextDirection = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left')
          nextDirection = 'right';
        break;
    }
  }

  function gameLoop() {
    const head = snake[0];
    let newX = head.x;
    let newY = head.y;

    // Update the direction based on the nextDirection if it's a valid direction
    if (
      (nextDirection === 'up' && direction !== 'down') ||
      (nextDirection === 'down' && direction !== 'up') ||
      (nextDirection === 'left' && direction !== 'right') ||
      (nextDirection === 'right' && direction !== 'left')
    ) {
      direction = nextDirection;
    }

    // Update the head position based on the current direction
    if (direction === 'up') {
      newY -= gridSize;
    } else if (direction === 'down') {
      newY += gridSize;
    } else if (direction === 'left') {
      newX -= gridSize;
    } else if (direction === 'right') {
      newX += gridSize;
    }

    const newHead = { x: newX, y: newY, width: gridSize, height: gridSize };
    const isPositionValid = !snake.some((segment, index) => index !== 0 && segment.x === newX && segment.y === newY);

    if (isPositionValid) {
      snake.unshift(newHead);
      snake.pop();
    } else {
      gameOver();
      return;
    }
    
    updateSnakePosition();
    checkCollision();
    spawnApples();

    gameTimer = setTimeout(gameLoop, 200); // Introduce a delay of 200 milliseconds (5 frames per second)
  }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomApple() {
  const occupiedPositions = new Set(snake.map((segment) => `${segment.x},${segment.y}`));

  // Get all the valid positions where the apple can be placed
  const validPositions = [];
  for (let x = 0; x < canvasWidthInBlocks; x++) {
    for (let y = 0; y < canvasHeightInBlocks; y++) {
      const positionKey = `${x},${y}`;
      if (!occupiedPositions.has(positionKey)) {
        validPositions.push({ x, y });
      }
    }
  }

  // Randomly select one of the valid positions
  const randomIndex = getRandomInt(0, validPositions.length - 1);
  const { x, y } = validPositions[randomIndex];

  apple.x = x;
  apple.y = y;

  spawnApples();
}


  function spawnApples() {
    // Draw the apple on the canvas
    const appleArt = new Image();
    appleArt.src = 'PixelArt/apple.png';
    context.drawImage(appleArt, apple.x * gridSize, apple.y * gridSize, apple.size, apple.size);
  }

  function checkCollision() {
    const head = snake[0];

    // Check collision with the walls
    if (
      head.x < 0 ||
      head.x + head.width > canvas.width ||
      head.y < 0 ||
      head.y + head.height > canvas.height
    ) {
      gameOver();
    }

    // Check collision with itself (excluding the head)
    for (let i = 1; i < snake.length; i++) {
      const segment = snake[i];
      if (head.x === segment.x && head.y === segment.y) {
        gameOver();
        return;
      }
    }

    // Check collision with the apple
    if (head.x === apple.x * gridSize && head.y === apple.y * gridSize) {
      score++;
      updateGameScore(score);

      // Add a new segment to the snake
      const tail = snake[snake.length - 1];
      const newSegment = { x: tail.x, y: tail.y, width: gridSize, height: gridSize };
      snake.push(newSegment);

      // Generate a new apple
      generateRandomApple();
    }
  }

  document.addEventListener('keydown', handleInput);

  // Start the game
  generateRandomApple();
  gameLoop();
});

