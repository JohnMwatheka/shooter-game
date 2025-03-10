const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth < 500 ? window.innerWidth - 20 : 500; // Responsive width
canvas.height = window.innerHeight < 600 ? window.innerHeight - 20 : 600; // Responsive height

// Game Variables
let gunX = canvas.width / 2 - 25;
let bullets = [];
let fallingObjects = [];
let score = 0;
let level = 1;
let objectSpeed = 2;
const bulletSpeed = 5;
let gameOver = false;

// Mouse Move Event - Gun follows mouse position
canvas.addEventListener("mousemove", (event) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    gunX = event.clientX - rect.left - 25;

    // Keep gun within bounds
    if (gunX < 0) gunX = 0;
    if (gunX > canvas.width - 50) gunX = canvas.width - 50;
});

// Touch Support for Mobile - Move gun
canvas.addEventListener("touchmove", (event) => {
    if (gameOver) return;

    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    gunX = touch.clientX - rect.left - 25;

    // Keep gun within bounds
    if (gunX < 0) gunX = 0;
    if (gunX > canvas.width - 50) gunX = canvas.width - 50;

    event.preventDefault();
});

// Touch to Fire Bullet (for mobile)
canvas.addEventListener("touchstart", () => {
    if (!gameOver) {
        bullets.push({ x: gunX + 20, y: canvas.height - 60, width: 5, height: 10 });
    }
});

// Function to spawn falling objects
function spawnFallingObject() {
    if (gameOver) return;

    let x = Math.random() * (canvas.width - 30);
    fallingObjects.push({ x, y: 0, width: 30, height: 30 });
}

// Bullet Shooting Mechanism
let bulletInterval = setInterval(() => {
    if (!gameOver) {
        bullets.push({ x: gunX + 20, y: canvas.height - 60, width: 5, height: 10 });
    }
}, 500);

// Function to End Game
function endGame() {
    gameOver = true;
    clearInterval(bulletInterval); // Stop bullet shooting

    // Display "Game Over" message for 5 seconds
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Restarting in 5s...", canvas.width / 2 - 90, canvas.height / 2 + 20);

    setTimeout(restartGame, 5000); // Restart after 5 seconds
}

// Function to Restart Game
function restartGame() {
    gameOver = false;
    score = 0;
    level = 1;
    objectSpeed = 2;
    bullets = [];
    fallingObjects = [];

    // Restart bullet interval
    bulletInterval = setInterval(() => {
        if (!gameOver) {
            bullets.push({ x: gunX + 20, y: canvas.height - 60, width: 5, height: 10 });
        }
    }, 500);

    update(); // Restart game loop
}

// Game Loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        return; // Stop rendering if game is over
    }

    // Draw Gun
    ctx.fillStyle = "red";
    ctx.fillRect(gunX, canvas.height - 50, 50, 20);

    // Draw and Move Bullets
    ctx.fillStyle = "yellow";
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullets off screen
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Draw and Move Falling Objects
    ctx.fillStyle = "white";
    fallingObjects.forEach((object, objIndex) => {
        object.y += objectSpeed;
        ctx.fillRect(object.x, object.y, object.width, object.height);

        // Check if object reaches the bottom (game over condition)
        if (object.y + object.height >= canvas.height) {
            endGame();
        }

        // Collision Detection
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < object.x + object.width &&
                bullet.x + bullet.width > object.x &&
                bullet.y < object.y + object.height &&
                bullet.y + bullet.height > object.y
            ) {
                // Remove bullet and object on collision
                bullets.splice(bulletIndex, 1);
                fallingObjects.splice(objIndex, 1);
                score += 5;

                // Increase Level
                if (score % 20 === 0) {
                    level++;
                    objectSpeed += 0.5;
                }
            }
        });
    });

    // Display Score and Level
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText("Level: " + level, 10, 60);

    requestAnimationFrame(update);
}

// Spawning Objects Every 2 Seconds
setInterval(spawnFallingObject, 2000);

// Start Game
update();
