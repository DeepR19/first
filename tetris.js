const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = 10;
const SQ = 30;
const VACANT = "white";

var done = new Audio();
done.src = "Weekend_In_The_City.mp3";
var done1 = new Audio();
done1.src = "Smart_Riot.mp3";
done.play();

// draw the square

function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// crearte the board

let board = [];
for(r = 0; r< ROW; r++ ) {
    board[r] = [];
    for(c = 0; c < COL ;c++){
        board[r][c] = VACANT;
    }
}

//  draw the board

function drawBoard(){
    for( r= 0; r< ROW ; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}
drawBoard();




// all pieces with there color
const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
]

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0] , PIECES[r][1])
}

let p = randomPiece();

function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}

// draw the piece

Piece.prototype.fill = function(color){
    for( r= 0; r< this.activeTetromino.length ; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r,color)
            }
        }
    }
}
Piece.prototype.Draw = function(){
    this.fill(this.color);
}
Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}



// lock the piece 
let score = 0;
Piece.prototype.lock = function(){
    for( r= 0; r< this.activeTetromino.length ; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant piece
            if(!this.activeTetromino[r][c])
            {
                continue;
            }
            if(this.y + r < 0){
                alert("Game over");
                // stop animation frame
                gameover  = true;
                break;
            }

            // we lock the piece
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // remove full rows
    
    for(r = 0; r <ROW; r++){
        let isRowFull = true;
        for(c= 0 ; c < COL ; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
            if(isRowFull){
                // if all the rows are full
                // we move all the above rows down
                for(y= r ; y > 1; y--){
                    for(c= 0 ; c < COL ; c++){
                       board[y][c] = board[y-1][c];
                       done1.play();
                       done.pause();
                    }
                }
                // top row board[0] ahs no row above it
                for(c= 0 ; c < COL ; c++){
                    board[0][c] = VACANT;
                }

                // need to increment the score
                score += 10;
        }
    }
    // update the board
    drawBoard();

    scoreElement.innerHTML = score;
    
}

// move down the piece

Piece.prototype.moveDown  = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.Draw();
    }
    else{
        this.lock();
        p = randomPiece();
    }
    
}
Piece.prototype.moveRight  = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.Draw();
    }
   
}
Piece.prototype.moveLeft  = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.Draw();   
    }
   
}
Piece.prototype.rotate  = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            kick = -1;
        }
        else if(this.x < COL/2){

            kick = 1;
        }
    }
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.Draw();
    }
   
}

// collosion function 

Piece.prototype.collision = function(x,y,piece){
    for( r= 0; r< piece.length ; r++){
        for(c = 0; c < piece.length ; c++){
            if(!piece[r][c]){
                continue;
            }
            
            // cooordinate of the piece
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            // coooridate

            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            if(newY < 0){
                continue;

            }
            // check if there is a lock piece

            if(board[newY][newX] != VACANT){
                return true;
            }
        }
    }
}




// control the piece

document.addEventListener("keydown", (event) => {
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }
    else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }
    else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }
    else if(event.keyCode == 40){
        p.moveDown();
    }
    
})

// drop the piece 
let dropStart = Date.now()
let gameover = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        dropStart = Date.now();
         p.moveDown();
    }
   if(!gameover){
       requestAnimationFrame(drop);
   }
    
}
drop();