let inputDirection = 'NONE';
let lastInputDirection = 'NONE'

window.addEventListener('keydown', e => {
    switch(e.key){
        case 'ArrowUp':
            if(lastInputDirection == 'SOUTH')break;
            inputDirection = 'NORTH';
            break;
        case 'ArrowDown':
            if(lastInputDirection == 'NORTH')break;
            inputDirection = 'SOUTH';
            break;
        case 'ArrowLeft':
            if(lastInputDirection == 'EAST')break;
            inputDirection = 'WEST';
            break;
        case 'ArrowRight':
            if(lastInputDirection == 'WEST')break;
            inputDirection = 'EAST';
            break;
        default:
            break;
    }
})

export function getInputDirection(){
    lastInputDirection = inputDirection
    return inputDirection;
}