import {getInputDirection} from './input.js'
export const SNAKE_SPEED = 8; // how many grids per second

const snakeBody = [{x:26, y:26}]; // initial snake position and with length 1

export function update() {
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