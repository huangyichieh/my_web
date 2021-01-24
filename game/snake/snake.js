import {getInputDirection} from './input.js';
export const SNAKE_SPEED = 5; // how many grids per second

const snakeBody = [{x:11, y:11}]; // initial snake position and with length 1
let newSegment = 0;

export function update() {
    addSegment();
    const currentDirection = getInputDirection();
    moveSnake(snakeBody, currentDirection);
}

function moveSnake(body,dir) {
    var prev_x = body[0].x;
    var prev_y = body[0].y;

    switch(dir){
        case 'NORTH':
            prev_y-=1;
            break;
        case 'SOUTH':
            prev_y+=1;
            break;
        case 'EAST':
            prev_x+=1;
            break;
        case 'WEST':
            prev_x-=1;
            break;
        default:
            break;
    }
    body.forEach(part => {
        var temp_x = part.x;
        var temp_y = part.y;
        part.x = prev_x;
        part.y = prev_y;
        prev_x = temp_x;
        prev_y = temp_y;
    })
}

export function draw(gameboard) {
    snakeBody.forEach(part => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = part.y;
        snakeElement.style.gridColumnStart = part.x;
        snakeElement.classList.add('snake');
        gameboard.appendChild(snakeElement);
    })
}

export function expandSnake(amount){
    newSegment+=amount;
}

export function onSnake(position, {ignoreHead = false} = {}){ // Second arg. is an optional input so assign it to {}
    return snakeBody.some((part, index) => {
        if(ignoreHead && index === 0) return false;
        return equalPositions(part,position);
    })
}

export function snakeIntersection(){
    return onSnake(getSnakeHead(), {ignoreHead : true});
}

export function getSnakeHead(){
    return snakeBody[0];
}

function addSegment(){
    for(let i = 0; i < newSegment; i++){
        snakeBody.push({...snakeBody[snakeBody.length-1]});
    }
    newSegment = 0;
}

function equalPositions(pos1, pos2){
    return (pos1.x === pos2.x && pos1.y === pos2.y);
}