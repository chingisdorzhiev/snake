const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

// Переменные и константы

const box = 30;
let score = 0;
let direction;
let over = true;
let snakeX;
let snakeY;
const eatSound = new Audio("sounds/eat.mp3");
const failSound = new Audio("sounds/fail.mp3");
const bgSound = new Audio("sounds/snowy.mp3");

let snake = [];
snake[0] = {
  x: 10 * box,
  y: 9 * box,
};

// Отрисовка борда, генерация еды, рестарт

function drawDesk() {
  ctx.fillStyle = "#FDFAF6";
  ctx.fillRect(0, 0, 600, 600);
  ctx.fillStyle = "#E4EFE7";
  for (let i = 0; i <= 19; i += 2) {
    for (let j = 0; j <= 19; j += 2) {
      ctx.fillRect(i * box, j * box, box, box);
    }
  }
  for (let i = 1; i <= 19; i += 2) {
    for (let j = 1; j <= 19; j += 2) {
      ctx.fillRect(i * box, j * box, box, box);
    }
  }
}

function drawStartDesk() {
  drawDesk();
  ctx.textAlign = "center";
  ctx.font = "100px prstart";
  ctx.fillStyle = "#064420";
  ctx.fillText("Snake", 300, 300);
  ctx.font = "20px prstart";
  ctx.fillText("press space to start", 300, 350);
}

function drawGameOver() {
  failSound.play();
  drawDesk();
  ctx.textAlign = "center";
  ctx.font = "50px prstart";
  ctx.fillStyle = "#064420";
  ctx.fillText("Game Over", 300, 250);
  ctx.font = "20px prstart";
  ctx.fillText("You have scored:", 300, 300);
  ctx.fillText(score, 300, 350);
  ctx.fillText("press space to try again", 300, 400);
}

function Food() {
  this.x = Math.floor(Math.random() * 19) * box;
  this.y = Math.floor(Math.random() * 19) * box;
}

let food = new Food();

function restart() {
  ctx.clearRect(0, 0, 600, 600);
  drawDesk();
  food = new Food();
  snake = [];
  snake[0] = {
    x: 10 * box,
    y: 9 * box,
  };
  score = 0;
  document.getElementById("score").innerHTML = score;
  direction = "";
  over = false;
}

// Обработка событий

function readKey(event) {
  if (event.keyCode === 32 && over) {
    restart();
    bgSound.play();
    game = setInterval(drawGame, 100);
  }

  if (game) {
    if (event.keyCode === 37 && direction !== "right") {
      direction = "left";
    } else if (event.keyCode === 38 && direction !== "down") {
      direction = "up";
    } else if (event.keyCode === 39 && direction !== "left") {
      direction = "right";
    } else if (event.keyCode === 40 && direction !== "up") {
      direction = "down";
    }
  }
}

document.addEventListener("keydown", readKey);

// Игра

function eatItself(head, body) {
  for (let i = 1; i < body.length; i++) {
    if (head.x == body[i].x && head.y == body[i].y) {
      clearInterval(game);
      drawGameOver();
      over = true;
    }
  }
}

function drawGame() {
  ctx.clearRect(0, 0, 600, 600);
  drawDesk();
  ctx.fillStyle = "#F97B22";
  ctx.fillRect(food.x, food.y, box, box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = "#064420";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  snakeX = snake[0].x;
  snakeY = snake[0].y;

  if (snakeX === food.x && snakeY === food.y) {
    eatSound.play();
    score++;
    document.getElementById("score").innerHTML = score;
    food = new Food();
  } else {
    snake.pop();
  }

  switch (direction) {
    case "left":
      snakeX -= box;
      break;
    case "right":
      snakeX += box;
      break;
    case "up":
      snakeY -= box;
      break;
    case "down":
      snakeY += box;
      break;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (snakeX == -30 || snakeY == -30 || snakeX == 600 || snakeY == 600) {
    clearInterval(game);
    drawGameOver();
    over = true;
  }
  eatItself(newHead, snake);

  snake.unshift(newHead);
}

// Запуск игры
drawStartDesk();
