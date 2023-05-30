window.addEventListener('load', () => {
    const canvas = document.querySelector('#snake');
    const context = canvas.getContext('2d');
    const gridSize = 25;
    const snakeSpeed = 25;

    const canvasWidthInBlocks = Math.floor(canvas.width / gridSize);
    const canvasHeightInBlocks = Math.floor(canvas.height / gridSize);

    let snake = { x: 0, y: 0, width: gridSize, height: gridSize };
    let direction = 'down';
    let score = 0;
    let apple = { x: 0, y: 0, size: gridSize };

    function drawGrid() {
        context.strokeStyle = 'black';

        for (let x = 0; x < canvasWidthInBlocks; x++) {
            for (let y = 0; y < canvasHeightInBlocks; y++) {
                context.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }

    function updateSnakePosition() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        context.fillStyle = 'green';
        context.fillRect(snake.x, snake.y, snake.width, snake.height);
    }

    function spawnApples() {
        context.clearRect(apple.x * gridSize, apple.y * gridSize, apple.size, apple.size); // Clear previous apple
        context.fillStyle = 'red';
        context.fillRect(apple.x * gridSize, apple.y * gridSize, apple.size, apple.size);
    }


    function handleInput(event) {
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

        // Convert snake's position to grid units
        const snakeGridX = Math.floor(snake.x / gridSize);
        const snakeGridY = Math.floor(snake.y / gridSize);

        if (snakeGridX === apple.x && snakeGridY === apple.y) {
            // Snake has collided with an apple
            score++;
            generateRandomApple(); // Generate a new random apple
        }
    }

    function generateRandomApple() {
        apple.x = Math.floor(Math.random() * canvasWidthInBlocks);
        apple.y = Math.floor(Math.random() * canvasHeightInBlocks);
        console.log('spawned')
        spawnApples(); // Draw the initial apple on the canvas

    }

    function gameLoop() {
        const deltaTime = 1.8 / snakeSpeed;

        if (snake.y >= 0 && direction === 'up') {
            snake.y -= snakeSpeed * deltaTime;
        } else if (snake.y + gridSize <= canvas.height && direction === 'down') {
            snake.y += snakeSpeed * deltaTime;
        } else if (snake.x >= 0 && direction === 'left') {
            snake.x -= snakeSpeed * deltaTime;
        } else if (snake.x + gridSize <= canvas.width && direction === 'right') {
            snake.x += snakeSpeed * deltaTime;
        }

        updateSnakePosition();

        spawnApples(); // Draw the initial apple on the canvas

        checkCollision(); // Check for collision with apple
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', handleInput);

    generateRandomApple(); // Generate the initial random apple

    gameLoop();
});
