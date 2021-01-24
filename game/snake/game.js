import {SNAKE_SPEED, update as updateSnake, draw as drawSnake, getSnakeHead, snakeIntersection} from './snake.js'
import {update as updateFood, draw as drawFood} from './food.js'
import {outsideGrid} from './grid.js'

var lastRenderTime = 0;
const gameBoard = document.getElementById('game_board');
let gameOver = false;

function main(currentTime){
    if(gameOver){
        if(confirm('You lost. Press ok to restart game.')){ // Pop up a confirm box
            window.location = '/'  // means to refresh the page i.e. to restart the game
        }
        return;  // return to avoid running the rest of the code.
    }
    window.requestAnimationFrame(main);
    const secondsElapsed = (currentTime-lastRenderTime)/1000;
    if(secondsElapsed < 1/SNAKE_SPEED) return;
    
    lastRenderTime = currentTime;

    update();
    draw();
}

window.requestAnimationFrame(main);

function update(){
    updateSnake();
    updateFood();
    checkDeath();
}

function draw(){
    gameBoard.innerHTML = ''; // set gameBoard to initial state
    drawSnake(gameBoard);
    drawFood(gameBoard);
}

function checkDeath(){
    gameOver = (snakeIntersection() || outsideGrid(getSnakeHead()));
}
