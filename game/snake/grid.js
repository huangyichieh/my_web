const GRID_SIZE = 21;

export function randomGridPosition(){
    return {
        x: Math.floor(Math.random()*GRID_SIZE)+1,
        y: Math.floor(Math.random()*GRID_SIZE)+1
    }
}

export function outsideGrid(headPos){
    return ((headPos.x > GRID_SIZE || headPos.x < 1)||(headPos.y > GRID_SIZE || headPos.y < 1));
}