window.addEventListener('load', () => {
    const canvas = document.querySelector('#snake');
    const context = canvas.getContext('2d');
    const gridSize = 50;

    const canvasWidthInBlocks = Math.floor(canvas.width / gridSize);
    const canvasHeightInBlocks = Math.floor(canvas.height / gridSize);

    let snake = [{ x: 0, y: 0, width: gridSize, height: gridSize }];
    let direction = 'down';
    let score = 0;
    let apple = { x: 0, y: 0, size: gridSize };

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
        // Update the direction based on user input
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down')
                    direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up')
                    direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right')
                    direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left')
                    direction = 'right';
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

        // Check collision with itself
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
            generateRandomApple();
            growSnake();
        }
    }

    function generateRandomApple() {
        // Generate random coordinates for the apple within the canvas grid
        apple.x = Math.floor(Math.random() * canvasWidthInBlocks);
        apple.y = Math.floor(Math.random() * canvasHeightInBlocks);
    }

    function growSnake() {
        // Add a new segment to the snake, extending its length
        const tail = snake[snake.length - 1];
        snake.push({ x: tail.x, y: tail.y, width: gridSize, height: gridSize });
    }

    function gameOver() {
        // Display game over message with the score and reset the game
        alert(`Game over!\nYour score is ${score}!`);
        resetGame();
    }

    function resetGame() {
        // Reset the snake, direction, score, and generate a new apple
        snake = [{ x: 0, y: 0, width: gridSize, height: gridSize }];
        direction = 'down';
        score = 0;
        generateRandomApple();
    }

    function gameLoop() {
        const head = snake[0];
        let newX = head.x;
        let newY = head.y;

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

        // Update the snake by adding a new head segment and removing the tail segment
        snake.unshift(newHead);
        snake.pop();

        updateSnakePosition();
        checkCollision();
        spawnApples();

        setTimeout(gameLoop, 180); // Introduce a delay of 180 milliseconds (18 frames per second)
    }

    document.addEventListener('keydown', handleInput);

    generateRandomApple(); // Generate the initial random apple
    gameLoop(); // Start the game loop
});
