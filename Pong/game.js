window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');
    let maxSpeed = 0.4

    // Resizing
    function resize() {
        canvas.height = window.innerHeight - 17;
        canvas.width = window.innerWidth - 17;
        player2 = { x: window.innerWidth - 30, y: 10, width: 10, height: 150 };
    }

    // Add resize event listener
    window.addEventListener('resize', resize);

    // Adding shapes
    let player1 = { x: 3, y: 10, width: 10, height: 150 };
    let ball = { x: 100, y: 100, radius: 8, speedX: 9, speedY: 9 };
    let player2 = { x: window.innerWidth, y: 10, width: 10, height: 150 };
    let score = 0;

    // Function to update player1 position
    function updatePlayer1Position() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'blue';
        context.fillRect(player1.x, player1.y, player1.width, player1.height);
        context.beginPath();
        context.fillStyle = 'black';
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        context.fillStyle = 'red';
        context.fill();
        context.fillRect(player2.x, player2.y, player2.width, player2.height);
        context.closePath();
    }

    // Function to update player2 position to follow the ball
    function updatePlayer2Position() {
        if (player2.y < ball.y) {
            player2.y += 8; // Move player2 down
        } else if (player2.y > ball.y) {
            player2.y -= 8; // Move player2 up
        }
    }

    // Function to update the ball position
    function updateBallPosition() {
        // Move the ball horizontally
        ball.x += ball.speedX;
        // Move the ball vertically
        ball.y += ball.speedY;

        // Check collision with the top and bottom edges with padding
        if (ball.y - ball.radius <= canvas.height * 0.01) {
            ball.y = canvas.height * 0.01 + ball.radius; // Reset the ball position with padding at the top edge
            ball.speedY = -ball.speedY - 1; // Reverse the vertical direction
        } else if (ball.y + ball.radius >= canvas.height * 0.99) {
            ball.y = canvas.height * 0.99 - ball.radius; // Reset the ball position with padding at the bottom edge
            ball.speedY = -ball.speedY - 1; // Reverse the vertical direction
        }

        // Check if the ball goes beyond the canvas on the left or right side
        if (ball.x + ball.radius <= 0 || ball.x - ball.radius >= canvas.width) {
            resetBall(); // Reset the ball position
        }
    }

    // Function to draw the border
    function drawBorder() {
        const borderWidth = 5;
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, borderWidth); // Top border
        context.fillRect(0, canvas.height - borderWidth, canvas.width, borderWidth); // Bottom border
    } 

    // Function to reset the ball position
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        score += 1; // Increment the score

        // Randomize the ball's initial direction
        ball.speedX = Math.random() > 0.5 ? 7 : -7; // Randomly sets speedX 
        ball.speedY = Math.random() > 0.5 ? 7 : -7; // Randomly sets speedY 
    }

    // Function to handle game updates
    function updateGame() {
        updateBallPosition();
        updatePlayer2Position();
        updatePlayer1Position();
        detectCollision();
        displayScore();
        drawBorder();
        requestAnimationFrame(updateGame); // Loop the game updates
    }

    // Function to detect collision between the ball and players
    function detectCollision() {
   
        // Check collision with player1
        if (
            ball.x - ball.radius <= player1.x + player1.width &&
            ball.y + ball.radius >= player1.y &&
            ball.y - ball.radius <= player1.y + player1.height
        ) {
            // Calculate the collision point relative to the paddle's height
            const collisionPoint = (ball.y - (player1.y + player1.height / 2)) / (player1.height / 2);

            // Adjust the ball's direction based on the collision point
            ball.speedX = -ball.speedX; // Reverse the horizontal direction when the ball hits player1
            ball.speedY = collisionPoint * maxSpeed; // Adjust the vertical direction based on the collision point
        }

        // Check collision with player2
        if (
            ball.x + ball.radius >= player2.x &&
            ball.y + ball.radius >= player2.y &&
            ball.y - ball.radius <= player2.y + player2.height
        ) {
            // Calculate the collision point relative to the paddle's height
            const collisionPoint = (ball.y - (player2.y + player2.height / 2)) / (player2.height / 2);

            // Adjust the ball's direction based on the collision point
            ball.speedX = -ball.speedX; // Reverse the horizontal direction when the ball hits player2
            ball.speedY = collisionPoint * maxSpeed; // Adjust the vertical direction based on the collision point
        }

    }

    // Function to display the score
    function displayScore() {
        context.font = '20px Arial';
        context.fillStyle = 'black';
        context.fillText('Score: ' + score, canvas.width - 100, 30);
    }

  
    window.addEventListener('mousemove', (e) => {
        e = e || window.event;
        const mouseY = e.clientY;

        if (mouseY < player1.y && player1.y - 15 >= 0) {
            player1.y -= 25;
        } else if (mouseY > player1.y + player1.height && player1.y + player1.height + 15 <= canvas.height) {
            player1.y += 25;
        }

        updatePlayer1Position();
    });


    resize(); // Resize the canvas initially
    updateGame(); // Start the game loop
});
