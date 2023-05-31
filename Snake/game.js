window.addEventListener('load', () => {
    const canvas = document.querySelector('#snake');
    const context = canvas.getContext('2d');
    const gridSize = 50;
    const delay = 200

    const canvasWidthInBlocks = Math.floor(canvas.width / gridSize);
    const canvasHeightInBlocks = Math.floor(canvas.height / gridSize);

    let snake = [{ x: 0, y: 0, width: gridSize, height: gridSize }];
    let direction = 'down';
    let nextDirection = 'down'; // Store the next direction to be applied
    let score = 0;
    let apple = { x: 0, y: 0, size: gridSize };
    let isGameOver = false;

    function drawGrid() {
        // Draw the grid lines on the canvas
        context.strokeStyle = 'black';

        for (let x = 0; x < canvasWidthInBlocks; x++) {
            for (let y = 0; y < canvasHeightInBlocks; y++) {
                context.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }

    function updateSnakePosition() {
        // Clear the canvas and redraw the grid
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();

        // Draw each segment of the snake
        context.fillStyle = 'green';
        for (let i = 0; i < snake.length; i++) {
            const segment = snake[i];
            context.fillRect(segment.x, segment.y, segment.width, segment.height);
        }
    }

    function spawnApples() {
        // Draw the apple on the canvas
        context.fillStyle = 'red';
        context.fillRect(apple.x * gridSize, apple.y * gridSize, apple.size, apple.size);
    }

    function handleInput(event) {
        // Restart the game if it's over and any key is pressed
        if (isGameOver) {
            resetGame();
            return;
        }

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
            }
        }

        // Check collision with the apple
        if (head.x === apple.x * gridSize && head.y === apple.y * gridSize) {
            // Snake has collided with an apple
            score++;
            growSnake();
            generateRandomApple();
        }
    }

    function generateRandomApple() {
        let appleX, appleY;
        let isSnakeOverlap = true;

        // Keep generating random coordinates until a valid spot is found
        while (isSnakeOverlap) {
            appleX = Math.floor(Math.random() * canvasWidthInBlocks);
            appleY = Math.floor(Math.random() * canvasHeightInBlocks);

            // Check if the generated apple coordinates overlap with the snake's body
            isSnakeOverlap = snake.some((segment) => segment.x === appleX && segment.y === appleY);
        }

        apple.x = appleX;
        apple.y = appleY;
    }

    function growSnake() {
        // Add a new segment to the snake, extending its length
        const tail = snake[snake.length - 1];
        snake.push({ x: tail.x, y: tail.y, width: gridSize, height: gridSize });
    }

    function gameOver() {
        // Set the game over flag and redraw the game over message
        isGameOver = true;
        context.font = '40px Arial';
        context.fillStyle = 'white';
        context.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
        context.font = '20px Arial';
        context.fillText('Click any key to restart', canvas.width / 2 - 100, canvas.height / 2 + 30);

    }

    function resetGame() {
        // Reset the snake length and generate a new apple
        snake = [{ x: 0, y: 0, width: gridSize, height: gridSize }];
        direction = 'down';
        nextDirection = 'down';
        score = 0;
        generateRandomApple();
        isGameOver = false;
        delay = 200;
        gameLoop(); // Start the game loop
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

        // Check if the new position is valid (not colliding with the snake's body)
        const isPositionValid = !snake.some((segment, index) => index !== 0 && segment.x === newX && segment.y === newY);

        // Update the snake only if the new position is valid
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

        setTimeout(gameLoop, delay); // Introduce a delay of 200 milliseconds (5 frames per second)
    }

    canvas.addEventListener('click', () => {
        if (isGameOver) {
            resetGame();
            gameLoop();
        }
    });

    document.addEventListener('keydown', handleInput);

    generateRandomApple(); // Generate the initial random apple
    gameLoop(); // Start the game loop
});
