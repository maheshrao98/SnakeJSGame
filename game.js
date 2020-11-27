// Declaration of required global variables.
let width;
let height;
let fps;
let tileSize;
let canvas;
let ctx;
let snake;
let food;
let score;
let isPaused;
let interval;


// Loading the browser window
window.addEventListener("load",function(){

    game();

});

// Adding an event listener for key presses.
window.addEventListener("keydown", function (evt) {
    if (evt.key === " ") {
        evt.preventDefault();
        isPaused = !isPaused;
        showPaused();
    }
    else if (evt.key === "ArrowUp") {
        evt.preventDefault();
        if (snake.velY != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, -1);
    }
    else if (evt.key === "ArrowDown") {
        evt.preventDefault();
        if (snake.velY != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, 1);
    }
    else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        if (snake.velX != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(-1, 0);
    }
    else if (evt.key === "ArrowRight") {
        evt.preventDefault();
        if (snake.velX != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(1, 0);
    }

});

// Determining a random spawn location on the grid.
function spawnLocation() {

    // Breaking the entire canvas into a grid of tiles.
    let rows = width / tileSize;
    let cols = height / tileSize;

    let xPos, yPos;

    xPos = Math.floor(Math.random() * rows) * tileSize;
    yPos = Math.floor(Math.random() * cols) * tileSize;

    return { x: xPos, y: yPos };

}

// Showing the score of the player.
function showScore() {

    ctx.textAlign = "center";
    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("SCORE: " + score, width - 120, 30);

}

// Showing if the game is paused.
function showPaused() {

    ctx.textAlign = "center";
    ctx.font = "35px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("PAUSED", width / 2, height / 2);

}

// Treating the snake as an object.
class Snake {

    // Initialization of object properties.
    constructor(pos, color) {

        this.x = pos.x;
        this.y = pos.y;
        this.tail = [{ x: pos.x - tileSize, y: pos.y }, { x: pos.x - tileSize * 2, y: pos.y }];
        this.velX = 1;
        this.velY = 0;
        this.color = color;

    }

    // Drawing the snake on the canvas.
    draw() {

        //Green colored square represents the snake
        // Drawing the head of the snake.
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        // Drawing the tail of the snake.
        for (var i = 0; i < this.tail.length; i++) {

            ctx.beginPath();
            ctx.rect(this.tail[i].x, this.tail[i].y, tileSize, tileSize);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();

        }


    }

    // Moving the snake by updating position.
    //In order to make the snake follow a certain path
    //We need to store the position of different segments of the tail
    //Which is achieved by assigning the segment of the tail the same position as the segment before it
    //This way the tail of snake follows the path that the head has retraced sometimes in the past
    //The position of the snake is incremented by the velocities velX and velY multilied by tilesize  
    move() {

        // Movement of the tail.    
        for (var i = this.tail.length - 1; i > 0; i--) {

            this.tail[i] = this.tail[i - 1];

        }

        // Updating the start of the tail to acquire the position of head.
        if (this.tail.length != 0)
            this.tail[0] = { x: this.x, y: this.y };

        // Movement of the head.   
        this.x += this.velX * tileSize;
        this.y += this.velY * tileSize;

    }

    // Changing the direction of movement of the snake.
    dir(dirX, dirY) {

        this.velX = dirX;
        this.velY = dirY;

    }

    //Determining whether the snake has eaten a piece of food.
    //Achieved by looking for an overlap of the snake's head and the food
    //Since tilesize match to the dimension of the grid 
    //We can check the difference in the position of the head and food
    //Matching the difference to the tilesize we can return true or false
    //And by the same way, increase the length of snake tail
    eat() {

        if (Math.abs(this.x - food.x) < tileSize && Math.abs(this.y - food.y) < tileSize) {

            // Adding to the tail.
            this.tail.push({});
            return true;
        }

        return false;

    }

    // Checking if the snake has died.
    //The snake dies when it bites a some portion of its tail
    //So we are looking for an overlap of the head and tail portion
    die() {

        for (var i = 0; i < this.tail.length; i++) {

            if (Math.abs(this.x - this.tail[i].x) < tileSize && Math.abs(this.y - this.tail[i].y) < tileSize) {
                return true;
            }

        }

        return false;

    }

    //Checks if the snake is within the bounds on the screen
    //If the snake is out of the bound of the screen
    //We made the snake appear magically from the opposite end of the screen
    border() {

        if (this.x + tileSize > width && this.velX != -1 || this.x < 0 && this.velX != 1)
            this.x = width - this.x;

        else if (this.y + tileSize > height && this.velY != -1 || this.velY != 1 && this.y < 0)
            this.y = height - this.y;

    }

}

// Treating the food as an object.
class Food {

    // Initialization of object properties.
    // Positioning the food object 
    constructor(pos, color) {

        this.x = pos.x;
        this.y = pos.y;
        this.color = color;

    }

    //Drawing the food on the canvas
    //The food is a red square which is in the width and height of tilesize
    draw() {

        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

    }

}

// Initialization of the game objects.
function init() {

    tileSize = 20;

    // Dynamically controlling the size of canvas.
    // By using tilesize, we divide the entire screen size measuremnet to grids 
    // By approximating the width and height to nearest multiple of tilesize
    width = tileSize * Math.floor(window.innerWidth / tileSize);
    height = tileSize * Math.floor(window.innerHeight / tileSize);;

    fps = 10;

    canvas = document.getElementById("game-area");
    canvas.width = width;
    canvas.height = height;
    //Specifying the coordinates as 2D coordinate
    ctx = canvas.getContext("2d");

    isPaused = false;
    score = 0;
    //Snake
    snake = new Snake({ x: tileSize * Math.floor(width / (2 * tileSize)), y: tileSize * Math.floor(height / (2 * tileSize)) }, "#39ff14");
    //Food 
    food = new Food(spawnLocation(), "red");

}

// Updating the position and redrawing of game objects.
function update() {

    // Checking if game is paused.
    if (isPaused) {
        return;
    }

    //When the snake dies, we need to get rid of interval which is done using clearInterval
    //Then display Game Over and reload the window
    if (snake.die()) {
        alert("GAME OVER!!!");
        clearInterval(interval);
        window.location.reload();
    }

    snake.border();

    if (snake.eat()) {
        score += 10;
        food = new Food(spawnLocation(), "red");
    }

    // Clearing the canvas for redrawing.
    ctx.clearRect(0, 0, width, height);

    food.draw();
    snake.draw();
    snake.move();
    showScore();

}

//The actual game function
//That takes care about drawing the objects on the canvas and running the game continuosly
//We add the number of times the game screen will be rendered per second
//In this case it will be 10fps
function game() {

    init();

    //The game loop
    //setInterval function periodically calls a certain function after a specific number of milliseconds
    //This reference is stored in the variable called interval
    interval = setInterval(update,1000/fps);

}

