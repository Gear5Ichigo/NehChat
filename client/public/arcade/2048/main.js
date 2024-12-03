class Block {
    //hooo
    constructor(row,col) {
        this.tile = 0;
        this.row = row;
        this.col = col;
    }

    printHTML() {
        //returns html needed for block
        let ret = `<div class="col-1 block">`
        if(this.tile>0) {
            ret+=this.printtileHTML();
        }
        ret+=`</div>`
        return ret;
    }

    printtileHTML() {
        //returns html needed for number tile
        let ret = `<div class="tile-${this.tile}">
                        <h2 class="align-middle">${this.tile}</h2>
                    </div>`;

        return ret;
    }


    chkMerge(block) {
        //checks if block given can be merged with this
        if(this.tile == block.tile) {
            //console.log("The same");
            let tmp = this.tile + block.tile;
            this.tile = tmp;
            block.tile = 0;
			return tmp;
        }
        return 0;
		
    }



}


let user = null;
const _get_user = async () => {
    await fetch('/api/users/get_user')
    .then(res => res.json())
    .then(data => user = data.user);
}; _get_user();
class Game {
    constructor() {
        //4x4 grid of block objects
        this.blocks = [
            [new Block(0,0),new Block(0,1),new Block(0,2),new Block(0,3)],
            [new Block(1,0),new Block(1,1),new Block(1,2),new Block(1,3)],
            [new Block(2,0),new Block(2,1),new Block(2,2),new Block(2,3)],
            [new Block(3,0),new Block(3,1),new Block(3,2),new Block(3,3)]
        ];

        this.Reset();//resets board
        this.cntTiles();
        this.ismoved = false;

    }

    start() {
        //adds two tiles to board
        this.addTile();
        this.addTile();
        this.draw(); //draws all the html to display properly
    }

    Reset() {
        //resets board for new game
        this.score = 0;//sets score to 0
		this.boardWipe(); //wipes board
        this.start();
    }
    cntTiles() {
        //counts all tiles more than 0 and sets it to this.tiles
        let count = 0;
        for(var x = 0; x < this.blocks.length; x++) {
            for(var y = 0; y < this.blocks.length; y++) {
                let block = this.blocks[x][y];
                //asks if block.tile is not 0
                if(block.tile != 0) {
                    count++;
                }
            }
        }
        //sets this.tiles to count
        this.tiles = count;

        //asks if this.tiles is 16 so it can check for loss
        if(this.tiles == 16) {
            this.chkLoss();
        }
    }
    boardWipe() {
        //wipes board 
        for(var x = 0; x < this.blocks.length; x++) {
            for(var y = 0; y < this.blocks.length; y++) {
                this.blocks[x][y].tile=0;
            }
        }
        //counts tiles then draws
        this.cntTiles();
        this.draw();
    }

    addTile() {
        //adds a tile in a random spot based on if this.tiles is less than 16
        let rngCoords = [Math.floor(Math.random()*4), Math.floor(Math.random()*4)];
        while(this.blocks[rngCoords[0]][rngCoords[1]].tile != 0 && this.tiles < 16) {
            rngCoords = [Math.floor(Math.random()*4), Math.floor(Math.random()*4)];

        }
        //checking if tiles less than 16 to make sure no tile is overridden
        if(this.tiles < 16) {
            this.blocks[rngCoords[0]][rngCoords[1]].tile = 2;
        } 
        
    }


    chkLoss() {
        //checks loss by if chkMerge returns true in any direction
        let lis = [this.chkMerge(0),this.chkMerge(1),this.chkMerge(2),this.chkMerge(3)];
        let canMerge = false;
        for(var x = 0; x < lis.length; x++) {
            if(lis[x]) {
                canMerge = true;
            }
        }
        //if canMerge is false you lose
        if(canMerge==false) {
            alert("lost game");
        }
    }

    printHTML() {
        //prints html to properly display board
        let html = ``;
        for(var r = 0; r < this.blocks.length; r++) {
            html += `<div class="row blockrow justify-content-md-center">`;
            for(var c = 0; c < this.blocks[r].length; c++) {
                html += this.blocks[r][c].printHTML();
            }
            html += `</div>`;
        }
        return html;
    }


    draw() {
        //uses queryselector to draw the printhtml method to screen
        let html = this.printHTML();
        document.querySelector(".gameContainer").innerHTML = html;
		this.drawScore();
    }


    shiftTiles(dir) {
        //runs move merge move to get best result
        this.ismoved = false;
        this.moveTiles(dir);
        this.chkMerge(dir, true);
        this.moveTiles(dir);

        //checks if moved can add tile
        if(this.ismoved) {
            this.addTile();
        }
        //draws and counts tile
        this.draw();
        this.cntTiles();
    }


    moveTiles(dir) {
        //loops over board to move tiles
        for(var row = 0; row < this.blocks.length; row++) {
            for(var col = 0; col < this.blocks[row].length; col++) {
                let block = this.blocks[row][col];
                this.dirShift(dir,row,col);
            }
        }
    }

    chkMerge(dir, ismerging) {
        //loops over board and checks if can merge if bool true merges else no
        let merged = false;
        for(var x = 0; x < this.blocks.length; x++) {
            for(var y = 0; y < this.blocks.length; y++) {
                let block = this.blocks[x][y];
                let r = this.chngRow(x,dir);
                let c = this.chngCol(y,dir);
                if(block.tile != 0 && ((r >= 0 && r < this.blocks.length) && (c >= 0 && c < this.blocks.length))) {
                    if(ismerging) {
                        let tmp = block.chkMerge(this.blocks[r][c]);
                        if(tmp > 0) {
                            this.ismoved = true;
                            this.score += tmp;
                        }
                    } else {
                        if(block.tile == this.blocks[r][c].tile) {
                            merged = true
                        }
                    }
                    
                }
            }
        }
        return merged;
    }

    dirShift(dir,row,col) {
        //determins which direction to push to
        switch(dir) {
            case 0:
                this.pushUp(col,row);
                break;
            case 1:
                this.pushRight(col,row);
                break
            case 2:
                this.pushDown(col,row);
                break;
            case 3:
                this.pushLeft(col,row);
                break;
        }
    }

    pushLeft(col,row) {
        //pushes tiles left
        let block = this.blocks[col][row];
        if(row > 0 && block.tile > 0) {
            this.pushTileBack(col,row,3);
        }
    }
    pushRight(row,col) {
        //pushes tiles right
        let opprow = this.getReverseTile(row);
        let oppcol = this.getReverseTile(col);
        let block = this.blocks[oppcol][opprow];
        if(row < this.blocks.length && block.tile > 0) {
            this.pushTileBack(oppcol,opprow,1);
        }
    }
    pushUp(row,col) {
        //pushes tiles up
        let block = this.blocks[row][col];
        if(row > 0 && block.tile > 0) {
            this.pushTileBack(row,col,0);
        }
    }
    pushDown(row,col) {
        //pushes tiles down
        let opprow = this.getReverseTile(row);
        let oppcol = this.getReverseTile(col);
        let block = this.blocks[opprow][oppcol];
        if(row < this.blocks.length && block.tile > 0) {
            this.pushTileBack(opprow,oppcol,2);
            
        }
    }

    pushTileBack(row,col,dir) {
        //starts at tile and loops until tile can no longer move
        let block = this.blocks[row][col];
        let chngrow = this.chngRow(row,dir);
        let chngcol = this.chngCol(col,dir);
        let swap;
        
        while(((chngcol >= 0 && chngcol < this.blocks.length) && (chngrow >= 0 && chngrow < this.blocks.length))) {
            if(this.blocks[chngrow][chngcol].tile == 0) {
                swap = this.blocks[chngrow][chngcol];
                chngrow = this.chngRow(chngrow,dir);
                chngcol = this.chngCol(chngcol,dir);
                this.draw();
                this.ismoved = true;
                
            } else {
                break;
            }
            

        }
        if(swap!=null) {
            this.swapTile(block,swap);
        }        
    }

    swapTile(block1,block2) {
        //swaps the tiles
        let tmp = block1.tile;
        block2.tile = tmp;
        block1.tile = 0;  
    }

    getReverseTile(num) {
        //gets the row or col in the opposite direction
        let tmp = (this.blocks.length-1)-num;
        return tmp;
    }

    chngCol(col,dir) {
        //chooses what to do to col based on direction
        if(dir == 3) {col--;}
        if(dir == 1) {col++;}
        return col;
        
    }
    chngRow(row,dir) {
        //chooses what to do to row based on direction
        if(dir == 2) {row++;}
        if(dir == 0) {row--;}
        return row;
    }

	drawScore() {
        //draws score to the board
		let html = this.printHTML();
        document.querySelector(".score").innerHTML = `Score: ${this.score}`;
	}


    getScoreBoard(didlose) {
        document.querySelector(".scoreboard").innerHTML = ``;
        (async () => {
            await fetch('/api/games/2048_score_submit', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({score: this.score})
            })
            .then( res => res.json() )
            .then( scores => {
                const scoreboard = document.querySelector("ol.scoreboard");
                scores.forEach(element => {
                    console.log(element)
                    const newlisting = document.createElement("li");
                    newlisting.className = "text-light font-bold"
                    newlisting.innerText = `${element[0]}: ${element[1]}`
                    scoreboard.appendChild(newlisting)
                });
            });
        })();
        if(didlose) {
            alert(`${user.username} why did you lose...`);
        }
        
    }


    
}

let game = new Game()

game.draw();

    
let res = document.getElementById("reset");
    res.addEventListener("click", function() {
        game.Reset();
});



document.addEventListener('load', () => {

})

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 87 ||  event.keyCode == 38) {
        game.shiftTiles(0);
       // console.log(event.keyCode);
    } else if(event.keyCode == 65 ||  event.keyCode == 37) {
        game.shiftTiles(3);
       // console.log(event.keyCode);
    } else if(event.keyCode == 68 ||  event.keyCode == 39) {    
        game.shiftTiles(1);
       // console.log(event.keyCode);
    } else if(event.keyCode == 83  ||  event.keyCode == 40) {
        game.shiftTiles(2);
       // console.log(event.keyCode);
    }
});