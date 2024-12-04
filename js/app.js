/*-------------- Constants -------------*/

const gridXY = 10; //The grid thickness

/*---------- Variables (state) ---------*/

let gameLevelVar = 0; //The game Level variable to store the number of speed 

let score = 0; //The score variable

let snake = [
    {x:50, y:50},
    {x:49, y:50},
    {x:48, y:50},
    {x:47, y:50}
]; //Snake Array contains x and y of objects first index is the head and the others are the body

let snakeFoodPostion = {x:10, y:10}; // Initial snake food postion

let dx = 0; // variable that changes for x-Axis
let dy = 0;// variable that changes for y-Axis

let gameLoopSpeed; //speed of the snake inside the canvas

/*----- Cached Element References  -----*/

//html elements score, start button and update game massage
const ScoreEl = document.querySelector('#score');
const startGameBtn = document.querySelector('#startGameBtn');
const updategameMassage = document.querySelector('#updategameMassage');

// html game level radio buttons easy and hard
const gameLevelChoiceEasy = document.querySelector('#easy');
const gameLevelChoiceHard = document.querySelector('#hard');

//canvas element and it's context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


/*-------------- Functions -------------*/

// this function will handel the press button arrows to draw the snake
function handelKeyPress(event) {

    if (gameLoopSpeed === undefined) {
        gameLoopSpeed = setInterval(updateSnakeBody, gameLevelVar); // set the speed of snake that depends on the first argment is the function is the update snake body and the second argment is game level variable to control the speed of snake
    }

    let keyEvent = event.key

    switch(keyEvent)
  {
    case 'ArrowUp':
        if (dy !== 1) {
            dx = 0;
            dy = -1;
            break;
        }
    case 'ArrowDown':
        if (dy !== -1) {
            dx = 0;
            dy = 1;
        break;
        }
    case 'ArrowLeft':
        if (dx !== 1) {
            dx = -1;
            dy = 0;
        break; 
        }
    case 'ArrowRight':
        if (dx !== -1) {
            dx = 1;
            dy = 0;
          break;
        }
    default:
      break;
  }
}

//This function is to stop the game and to clear the canvas with white color and stope the game loop speed using clearInterval.
function stopGame() {
    clearInterval(gameLoopSpeed);
    ctx.clearRect(0,0,canvas.width,canvas.width);
    ctx.fillStyle = 'white';
    
    
}

// updating the score variable to use it in the HTML
function updateScore() {
    score += 10; //Increasing the score with 10 while the snake eats food
    gameLevelVar -= 20 //Decrease the number by 20 to make the game harder either in easy or hard level
    ScoreEl.textContent = `Score ${score}`; // update the came score in the HTML 
}

function updateSnakeBody() {

    const snakeHead = {x:snake[0].x + dx, y:snake[0].y + dy}; // This constatnt is to set the snake first element of array of the object head to add the dy for y axies and dx for the x axies these variables will gwt it from the switch function    
    
    //This if statment is to check the head of snake approches the left X-axies wall then it'll change the snake head value by the canvas/ gridXY -1 to draw the snake comes from the right
    if (snakeHead.x < 0) {
        snakeHead.x = canvas.width/ gridXY -1;
        
    //This if statment is to check the head of snake approches the right X-axies wall then it'll keep value of snake head x = 0 and it'll appere from the left
    } else if(snakeHead.x >= canvas.width/ gridXY) {
        snakeHead.x = 0;

    //This if statment is to check the head of snake approches the top Y-axies wall then it'll change the snake head value by the canvas/ gridXY -1 to draw the snake comes from the bottom
    }else if(snakeHead.y < 0){
        snakeHead.y = canvas.width/ gridXY -1;

    //This if statment is to check the head of snake approches the bottom Y-axies wall then it'll keep value of snake head y = 0 and it'll appere from the top
    }else if(snakeHead.y >= canvas.width/ gridXY){
        snakeHead.y = 0;
    }

    // this is for to check the sneake hits it's body
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === snakeHead.x && snake[i].y === snakeHead.y) {
            stopGame(); // calling stop game function 
            startGameBtn.classList.remove('remove'); // remove the class remove th let start game appers again
            updategameMassage.textContent = 'Game is Over Click Start Game button to play again'; // to update the game massage
            return; // to get out from the function
        }
        
    }

    snake.unshift(snakeHead); //Unshift function is return the new length of the snake array object 

    //This is for to check is the food position is equals to head of snake it will increment the score and it'll update the massage in the HTML also it'll create a food on another postion in the canvas via foodCreation function.
    if (snakeHead.x === snakeFoodPostion.x && snakeHead.y === snakeFoodPostion.y) {
        updateScore(); //calling the update score to update the variable for the HTML
        foodCreation(); //calling the food cration function when the food already eaten
       
    }else { // pop fuction is to remove the last body from the snake array and the again will add it in the begining for the array to let snake moving
        snake.pop();
    }

    ctx.clearRect(0,0,canvas.width, canvas.width); // to  clear the canvas square for the next move for the snake

    drawSnake(); // Calling drawsnake every time for update the snake body.
    drawSnakeFood();// Calling drawSnakeFood every time for update the snake body.
}


// This function is to draw the snake and it's called inside the updateSnakeBody function for each object in array will draw it in the canvas 
function drawSnake() {
    snake.forEach((body) => {
        ctx.fillStyle = 'green';
        ctx.fillRect( body.x * gridXY, body.y * gridXY, gridXY, gridXY);

    });
       
}

// This function is to draw the snake food and it's called inside the updateSnakeBody function
function drawSnakeFood() {
    ctx.fillStyle = 'orange';
    ctx.fillRect(snakeFoodPostion.x * gridXY, snakeFoodPostion.y * gridXY, gridXY, gridXY);
}

 // This function to create food randomly in the canvas using the Math package from that package the random function, this fuction will produce a random number will multiply it with canvas width over the gridXY to make sure the food will appear on the canvas and updateing the food postion object.
function foodCreation() {
    snakeFoodPostion = {
        x: Math.floor(Math.random()* (canvas.width/ gridXY)),
        y: Math.floor(Math.random()* (canvas.width/ gridXY)),
    }
}

foodCreation() //calling the food cration function when the game starts

/*----------- Event Listeners ----------*/

//event listner to get the game level variable number and to run the add event listener "Keydown" and passing the event to handelkeypress function to start the game
startGameBtn.addEventListener('click', (event) => {

    if (gameLevelChoiceEasy.checked === true) {
        gameLevelVar = 120
        
    }else if(gameLevelChoiceHard.checked === true){
        gameLevelVar = 50
    }

    startGameBtn.classList.add('remove');
    updategameMassage.textContent = 'Press any arrow buttons to play';


    addEventListener("keydown", (event) => {handelKeyPress(event)});
})

