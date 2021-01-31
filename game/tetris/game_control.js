var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const TETRIS_TABLE_ROW = 20;
const TETRIS_TABLE_COL = 10;
const GAME_INTERVAL = 10; // fps = 1 / GAME_INTERVAL ms
const TETRIS_SPEED = 80; // tetris block move down 1 block in TETRIS_SPEED * GAME_INTERVAL ms
const ACTIVE_BLOCK_TAG = 'A';
const STATIC_BLOCK_TAG_o = 'o';
const STATIC_BLOCK_TAG_l = 'l';
const STATIC_BLOCK_TAG_s = 's';
const STATIC_BLOCK_TAG_z = 'z';
const STATIC_BLOCK_TAG_L = 'L';
const STATIC_BLOCK_TAG_J = 'J';
const STATIC_BLOCK_TAG_T = 'T';
const BLOCK_TAG_TO_COLOR = new Map([
    [ACTIVE_BLOCK_TAG, "#FFFFFF"],
    [STATIC_BLOCK_TAG_o, "#FFFF3C"],
    [STATIC_BLOCK_TAG_l, "#38FEFF"],
    [STATIC_BLOCK_TAG_s, "#19FF14"],
    [STATIC_BLOCK_TAG_z, "#F63F3C"],
    [STATIC_BLOCK_TAG_L, "#FF8D14"],
    [STATIC_BLOCK_TAG_J, "#1421FF"],
    [STATIC_BLOCK_TAG_T, "#D922FF"]
]);
var tetris_table = [
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '']
];
// a 20 x 10 grid for tetris
// '' stands for no block, otherwise follow block tag above
var frame_count = 0;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class tetrisBlock {
    constructor(initial_coord, rotate_origin, block_tag) {
        this.block_coord = initial_coord;
        this.rotate_origin = rotate_origin;
        this.block_tag = block_tag;
    }

    rotate() {
        var rotated_coord = []
        for(var i = 0; i < this.block_coord.length; i++) {
            var coord = this.block_coord[i];
            var calib_x = coord[0] - this.rotate_origin[0];
            var calib_y = coord[1] - this.rotate_origin[1];
            var rotate_x = -calib_y;
            var rotate_y = calib_x;
            var a = rotate_y + this.rotate_origin[1];
            rotated_coord.push([rotate_x + this.rotate_origin[0], rotate_y + this.rotate_origin[1]]);
        }
        this.block_coord = rotated_coord;
    }

    length(){
        var min = 1000;
        var max = -1000;
        for(var i = 0; i < this.block_coord.length; i++) {
            var coord = this.block_coord[i];
            if(coord[0] < min) {
                min = coord[0];
            }
            if(coord[0] > max) {
                max = coord[0];
            }
        }
        return (max - min + 1);
    }

    height() {
        var min = 1000;
        var max = -1000;
        for(var i = 0; i < this.block_coord.length; i++) {
            var coord = this.block_coord[i];
            if(coord[1] < min) {
                min = coord[1];
            }
            if(coord[1] > max) {
                max = coord[1];
            }
        }
        return (max - min + 1);
    }

    copy() {
        return new tetrisBlock(this.block_coord, this.rotate_origin, this.block_tag);
    }
}

class tetrisBlockGenerator {
    constructor(num_wait) {
        this.legal_block = [
            new tetrisBlock([[0, 0], [1, 0], [0, 1], [1, 1]], [0.5, 0.5], STATIC_BLOCK_TAG_o), // block o
            new tetrisBlock([[0, 0], [1, 0], [2, 0], [3, 0]], [1.5, -0.5], STATIC_BLOCK_TAG_l), // block l
            new tetrisBlock([[1, 0], [2, 0], [0, 1], [1, 1]], [1, 0], STATIC_BLOCK_TAG_s), // block s
            new tetrisBlock([[0, 0], [1, 0], [1, 1], [2, 1]], [1, 0], STATIC_BLOCK_TAG_z), // block z
            new tetrisBlock([[2, 0], [0, 1], [1, 1], [2, 1]], [1, 1], STATIC_BLOCK_TAG_L), // block L
            new tetrisBlock([[0, 0], [0, 1], [1, 1], [2, 1]], [1, 1], STATIC_BLOCK_TAG_J), // block J
            new tetrisBlock([[0, 0], [1, 0], [2, 0], [1, 1]], [1, 0], STATIC_BLOCK_TAG_T)  // block T
        ]

        this.wait_list = [];
        for(var i = 0; i < num_wait; i++) {
            this.wait_list.push(this.legal_block[getRandomInt(7)].copy());
        }
    }

    genBlock() {
        var next_block = this.wait_list.pop();
        this.wait_list.push(this.legal_block[getRandomInt(7)].copy());
        return next_block;
    }
}

class activeBlock {
    constructor(block) {
        if (block instanceof tetrisBlock) {
            this.block = block;
            this.position = [0, 0];
            this.settle = false;
        }
        else {
            alert("Javascript: something went wrong!!!");
        }
    }

    draw(settle) {
        if(this.settle) {
            // block already settle
            return 0;
        }

        // erase previous block
        for(var h = 0; h < TETRIS_TABLE_ROW; h++) {
            for(var w = 0; w < TETRIS_TABLE_COL; w++) {
                if (tetris_table[h][w] == ACTIVE_BLOCK_TAG) {
                    tetris_table[h][w] = '';
                }
            }
        }

        // set new position to 2
        var fill_number = settle? this.block.block_tag : ACTIVE_BLOCK_TAG;
        for(var i = 0; i < this.block.block_coord.length; i++) {
            var coord = this.block.block_coord[i];
            if (
                this.position[0] + coord[0] >= 0 && this.position[0] + coord[0] < 10 &&
                this.position[1] + coord[1] >= 0 && this.position[1] + coord[1] < 20
            ) {
                tetris_table[this.position[1] + coord[1]][this.position[0] + coord[0]] = fill_number;
            }
        }
        this.settle = settle ? true : false;
    }

    init() {
        var x_offset = Math.floor((TETRIS_TABLE_COL - this.block.length()) / 2);
        var y_offset = 0;
        for(;; y_offset--) {
            var legal_block = true;
            for(var i = 0; i < this.block.block_coord.length; i++) {
                var coord = this.block.block_coord[i];
                var a = y_offset + coord[1];
                var b = x_offset + coord[0];
                if(y_offset + coord[1] >= 0) {
                    if(
                        tetris_table[y_offset + coord[1]][x_offset + coord[0]] != '' &&
                        tetris_table[y_offset + coord[1]][x_offset + coord[0]] != 'A'
                    ) {
                        legal_block = false;
                        break;
                    }
                }
            }
            if(legal_block == true) {
                break;
            }
        }

        if(y_offset <= -this.block.height()) {
            // init fail game end
            this.settle = true;
            return 0;
        }
        else {
            // draw block
            this.position[0] = x_offset;
            this.position[1] = y_offset;
            this.draw();
            return 1;
        }
    }

    down() {
        var x_offset = this.position[0];
        var y_offset = this.position[1];
        var legal_block = true;
        
        if(legal_block) {
            for(var i = 0; i < this.block.block_coord.length; i++) {
                var coord = this.block.block_coord[i];
                if(y_offset + coord[1] + 1 >= TETRIS_TABLE_ROW) {
                    legal_block = false;
                    break;
                }
                if(y_offset + coord[1] + 1 >= 0) {
                    if(
                        tetris_table[y_offset + coord[1] + 1][x_offset + coord[0]] != '' &&
                        tetris_table[y_offset + coord[1] + 1][x_offset + coord[0]] != 'A'
                    ) {
                        legal_block = false;
                        break;
                    }
                }
            }
        }

        if(legal_block) {
            this.position[1] += 1;
            this.draw();
            return 1;
        }
        else {
            // block settle
            this.draw(true);
            return 0;
        }
    }

    left() {
        var x_offset = this.position[0];
        var y_offset = this.position[1];
        var legal_block = true;
        
        if(legal_block) {
            for(var i = 0; i < this.block.block_coord.length; i++) {
                var coord = this.block.block_coord[i];
                if(x_offset + coord[0] - 1 < 0) {
                    legal_block = false;
                    break;
                }
                if(y_offset + coord[1] >= 0) {
                    if(
                        tetris_table[y_offset + coord[1]][x_offset + coord[0] - 1] != '' &&
                        tetris_table[y_offset + coord[1]][x_offset + coord[0] - 1] != 'A'
                    ) {
                        legal_block = false;
                        break;
                    }
                }
            }
        }

        if(legal_block) {
            this.position[0] -= 1;
            this.draw();
            return 1;
        }
        else {
            return 0;
        }
    }

    right() {
        var x_offset = this.position[0];
        var y_offset = this.position[1];
        var legal_block = true;
        
        if(legal_block) {
            for(var i = 0; i < this.block.block_coord.length; i++) {
                var coord = this.block.block_coord[i];
                if(x_offset + coord[0] + 1 >= TETRIS_TABLE_COL) {
                    legal_block = false;
                    break;
                }
                if(y_offset + coord[1] >= 0) {
                    if(
                        tetris_table[y_offset + coord[1]][x_offset + coord[0] + 1] != '' &&
                        tetris_table[y_offset + coord[1]][x_offset + coord[0] + 1] != 'A'
                    ) {
                        legal_block = false;
                        break;
                    }
                }
            }
        }

        if(legal_block) {
            this.position[0] += 1;
            this.draw();
            return 1;
        }
        else {
            return 0;
        }
    }

    rotate() {
        var try_rotate = this.block.copy();
        try_rotate.rotate();
        
        var x_offset = this.position[0];
        var y_offset = this.position[1];
        var acceptable_d = [];

        // try move left or right if not rotatable
        var half_length = Math.ceil(try_rotate.length() / 2);
        for(var d = -half_length; d <= half_length; d++) {
            x_offset = this.position[0] + d;
            y_offset = this.position[1];
            var legal_block = true;

            for(var i = 0; i < try_rotate.block_coord.length; i++) {
                var coord = try_rotate.block_coord[i];
                if(y_offset + coord[1] >= 0) { 
                    if(
                        x_offset + coord[0] >= TETRIS_TABLE_COL || x_offset + coord[0] < 0 ||
                        (tetris_table[y_offset + coord[1]][x_offset + coord[0]] != '' &&
                        tetris_table[y_offset + coord[1]][x_offset + coord[0]] != 'A')
                    ) {
                        legal_block = false;
                        break;
                    }
                }
            }

            if(legal_block) {
                acceptable_d.push(d);
            }
        }

        // not rotatble
        if(acceptable_d.length == 0) {
            return 0;
        }

        // rotatable
        var min_d = 1000;
        for(var i = 0; i < acceptable_d.length; i++) {
            if(Math.abs(min_d) > Math.abs(acceptable_d[i])) {
                min_d = acceptable_d[i];
            }
        }
        this.position[0] += min_d;
        this.block.rotate();
        this.draw();
        return 1;
    }

    illegal_settle() {
        if(this.settle) {
            for(var i = 0; i < this.block.block_coord.length; i++) {
                var coord = this.block.block_coord[i];
                if(this.position[1] + coord[1] < 0) {
                    return true;
                }
            }
        }
        return false;
    }
}

// frame manager to control animation for games
var block_gen = new tetrisBlockGenerator(2);
var active_block = null;
var game_status = 1; // 1 for start, 0 for pause, -1 for end
var frame_count = 0;
function frame_manage() {
    // draw background
    ctx.beginPath();
    ctx.rect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();

    // draw game area
    var tetris_area_w = 0.5 * canvas.offsetHeight;
    var tetris_area_h = canvas.offsetHeight;
    var tetris_area_offset = 0.5 * canvas.offsetWidth - 0.5 * tetris_area_w;
    var tetris_block_w = tetris_area_w / 10; // same as block height
    ctx.beginPath();
    ctx.rect(tetris_area_offset, 0, tetris_area_w, tetris_area_h);
    ctx.fillStyle = "#111111";
    ctx.fill();
    ctx.closePath();

    for(var h = 0; h < TETRIS_TABLE_ROW; h++) {
        for(var w = 0; w < TETRIS_TABLE_COL; w++) {
            if (tetris_table[h][w] != '') {
                ctx.beginPath();
                ctx.rect(tetris_area_offset + w * tetris_block_w, h * tetris_block_w, tetris_block_w, tetris_block_w);
                ctx.fillStyle = BLOCK_TAG_TO_COLOR.get(tetris_table[h][w]);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#383838";
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    if (game_status == 1) {
        // Game on progress
        if (active_block == null) {
            active_block = new activeBlock(block_gen.genBlock());
            var init_status = active_block.init();
            game_status = init_status == 1? 1 : -1;
        }
        else {
            frame_count++;
            if(frame_count >= TETRIS_SPEED) {
                var is_block_active = active_block.down();
                if(is_block_active == 0) {
                    if(active_block.illegal_settle()) {
                        game_status = -1;
                    }
                    else {
                        // check any complete row
                        for(var h = 0; h < TETRIS_TABLE_ROW; h++) {
                            var complete_row = true;
                            for(var w = 0; w < TETRIS_TABLE_COL; w++) {
                                if(tetris_table[h][w] == 0) {
                                    complete_row = false;
                                }
                            }
                            if(complete_row) {
                                tetris_table.splice(h, 1);
                                tetris_table.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                            }
                        }
                        // reset block
                        active_block = null;
                    }
                }
                frame_count = 0;
            }
        }
    }
    else if(game_status == 0) {
        // Game pause
        ctx.beginPath();
        ctx.font = "35px Cabin Sketch";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("PAUSE", canvas.offsetWidth / 2,  canvas.offsetHeight / 2 - 3 * tetris_block_w);
        
        ctx.font = "20px Cabin Sketch";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Press \"Enter\" to continue", canvas.offsetWidth / 2,  canvas.offsetHeight / 2);
    }
    else {
        // Game end
        ctx.font = "35px Cabin Sketch";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("YOU LOOSE", canvas.offsetWidth / 2,  canvas.offsetHeight / 2 - 3 * tetris_block_w);
        
        ctx.font = "20px Cabin Sketch";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Press \"Enter\" to restart", canvas.offsetWidth / 2,  canvas.offsetHeight / 2);
    }
}
setInterval(frame_manage, GAME_INTERVAL);

// keyboard events
window.addEventListener('keydown', e => {
    switch(e.key){
        case 'ArrowUp':
            // Rotate
            if(active_block != null) {
                active_block.rotate();
            }
            break;
        case 'ArrowLeft':
            if(active_block != null) {
                active_block.left();
            }
            break;
        case 'ArrowRight':
            if(active_block != null) {
                active_block.right();
            }
            break;
        case 'ArrowDown':
            if(active_block != null) {
                active_block.down();
            }
            break;
        case 'Enter':
            if(game_status == 1) {
                // PAUSE
                game_status = 0;
            }
            else if(game_status == 0) {
                // CONTINUE
                game_status = 1;
            }
            else if(game_status == -1) {
                // RESTART
                for(var h = 0; h < TETRIS_TABLE_ROW; h++) {
                    for(var w = 0; w < TETRIS_TABLE_COL; w++) {
                        tetris_table[h][w] = 0;
                    }
                }
                active_block = null;
                game_status = 1;
            }
    } 
});