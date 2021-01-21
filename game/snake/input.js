let inputDirection = 'NONE';

window.addEventListener('keydown', e => {
    switch(e.key){
        case 'ArrowUp':
            inputDirection = 'NORTH';
            break;
        case 'ArrowDown':
            inputDirection = 'SOUTH';
            break;
        case 'ArrowLeft':
            inputDirection = 'WEST';
            break;
        case 'ArrowRight':
            inputDirection = 'EAST';
            break;
        default:
            break;
    }
})

export function getInputDirection(){
    return inputDirection;
}