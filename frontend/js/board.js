class Board {
    constructor(size) {
        this.size = size;
        this.board = new Array(size);
        this.turn = 1;
        this.winner = 0;
        this.tile_size = 40;
        this.init();
    }

    init() {
        // Create a 2D array to store the board state
        for (let i = 0; i < this.size; i++) {
            this.board[i] = new Array(this.size).fill(0);
        }

        // Create the board element and add it to the page
        this.boardEl = document.createElement('div');
        this.boardEl.classList.add('board');

        // Create the tiles and add them to the board element
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let tile = document.createElement('div');
                tile.classList.add('tile');
                if (i === (this.size - 1) / 2 && j === (this.size - 1) / 2) {
                    tile.classList.add('center-tile');
                }
                tile.style.width = this.tile_size + 'px';
                tile.style.height = this.tile_size + 'px';
                tile.style.left = j * this.tile_size + 'px';
                tile.style.top = i * this.tile_size + 'px';
                tile.dataset.row = i;
                tile.dataset.col = j;
                this.boardEl.appendChild(tile);
            }
        }
    }

    addEventListeners() {
        let tiles = document.querySelectorAll('.tile');
        console.log(tiles);

        tiles.forEach(tile => {
            tile.addEventListener('mouseup', event => {
                tile.classList.remove('player' + this.turn + '-ghost');
                // Get row and col from the tile's data attributes
                let row = parseInt(tile.dataset.row);
                let col = parseInt(tile.dataset.col);
                tile.style.opacity = 1;
                console.log(row, col);
                if (this.placeTile(row, col)) {
                    this.checkWin(row, col);
                }
            });
            tile.addEventListener('mouseenter', event => {
                let row = parseInt(tile.dataset.row);
                let col = parseInt(tile.dataset.col);
                tile.style.opacity = this.isValidMove(row, col) ? 0.5 : 1;
                // if its a valid move, show the current player's tile
                if (this.isValidMove(row, col))
                    tile.classList.add('player' + this.turn + '-ghost');

            });
            tile.addEventListener('mouseleave', event => {
                tile.style.opacity = 1;
                tile.classList.remove('player' + this.turn + '-ghost');
            });
        });
    }


    isValidMove(row, col) {
        return this.board[row][col] === 0;
    }

    placeTile(row, col) {
        console.log(row, col);
        if (this.isValidMove(row, col)) {
            this.board[row][col] = this.turn;
            let tiles = document.querySelectorAll('.tile');
            let tile = tiles[row * this.size + col];
            tile.classList.add(this.turn === 1 ? 'player1' : 'player2');
            this.turn = this.turn === 1 ? 2 : 1;
            return true;
        }
        return false;
    }

    checkWin(row, col) {
        let player = this.board[row][col];
        const directions = [
            { dr: -1, dc: -1 },
            { dr: -1, dc: 0 },
            { dr: -1, dc: 1 },
            { dr: 0, dc: 1 },
        ];

        for (let dir of directions) {
            let count = 1;
            for (let i = 1; i < 5; i++) {
                let r = row + dir.dr * i;
                let c = col + dir.dc * i;
                if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }

            for (let i = 1; i < 5; i++) {
                let r = row - dir.dr * i;
                let c = col - dir.dc * i;
                if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                this.displayWin(player);
                return;
            }
        }
    }


    displayWin(player) {
        setTimeout(() => {
            alert('Player ' + player + ' wins!');
            this.resetBoard();
        }, 100);
    }

    resetBoard() {
        for (let i = 0; i < this.size; i++) {
            this.board[i] = new Array(this.size).fill(0);
        }
        let tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.classList.remove('player1');
            tile.classList.remove('player2');
        });
        this.turn = 1;
    }
}


class ComputerBoard extends Board {
    constructor(size) {
        super(size);
    }

    addEventListeners() {
        let tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.addEventListener('mouseup', event => {
                tile.classList.remove('player' + this.turn + '-ghost');
                // Get row and col from the tile's data attributes
                let row = parseInt(tile.dataset.row);
                let col = parseInt(tile.dataset.col);
                tile.style.opacity = 1;
                console.log(row, col);
                if (this.placeTile(row, col)) {
                    this.checkWin(row, col);
                    this.computerMove();
                }
            });
            tile.addEventListener('mouseenter', event => {
                let row = parseInt(tile.dataset.row);
                let col = parseInt(tile.dataset.col);
                tile.style.opacity = this.isValidMove(row, col) ? 0.5 : 1;
                // if its a valid move, show the current player's tile
                if (this.isValidMove(row, col))
                    tile.classList.add('player' + this.turn + '-ghost');

            });
            tile.addEventListener('mouseleave', event => {
                tile.style.opacity = 1;
                tile.classList.remove('player' + this.turn + '-ghost');
            });
        });
    }

    computerMove() {
        this.mediumAI();
        this.checkWin(row, col);
    }

    mediumAI() {
        let player = this.turn;
        let opponent = player === 1 ? 2 : 1;

        // Check for any immediate opportunities to win
        let move = this.checkImmediateWin(player);
        if (move) {
            this.placeTile(move.row, move.col);
            this.checkWin(move.row, move.col);
            return;
        }

        // Check if the opponent has three pieces in a row and block that row
        move = this.checkImmediateWin(opponent);
        if (move) {
            this.placeTile(move.row, move.col);
            return;
        }

        // Place a piece in the center of the board
        let center = Math.floor(this.size / 2);
        if (this.isValidMove(center, center)) {
            this.placeTile(center, center);
            return;
        }

        // Randomly place a piece on the board
        let centerRow = Math.floor(this.size / 2);
        let centerCol = Math.floor(this.size / 2);
      
        let attempts = 0;
        while (attempts < 10) {
          // Move one tile away from the center in a random direction
          let row = centerRow + Math.floor(Math.random() * 3) - 1;
          let col = centerCol + Math.floor(Math.random() * 3) - 1;
      
          // Check if the tile is a valid move
          if (this.isValidMove(row, col)) {
            this.placeTile(row, col);
            this.checkWin(row, col);
            return;
          }
      
          attempts++;
        }
      
        // If no valid move is found, fall back to the original random placement algorithm
        let row = Math.floor(Math.random() * this.size);
        let col = Math.floor(Math.random() * this.size);
        while (!this.isValidMove(row, col)) {
          row = Math.floor(Math.random() * this.size);
          col = Math.floor(Math.random() * this.size);
        }
        this.placeTile(row, col);
        this.checkWin(row, col);
    }

    checkImmediateWin(player) {
        const directions = [
            { dr: -1, dc: -1 },
            { dr: -1, dc: 0 },
            { dr: -1, dc: 1 },
            { dr: 0, dc: 1 },
        ];

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === 0) {
                    for (let dir of directions) {
                        let count = 1;
                        for (let i = 1; i < 4; i++) {
                            let r = row + dir.dr * i;
                            let c = col + dir.dc * i;
                            if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === player) {
                                count++;
                            } else {
                                break;
                            }
                        }

                        for (let i = 1; i < 4; i++) {
                            let r = row - dir.dr * i;
                            let c = col - dir.dc * i;
                            if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === player) {
                                count++;
                            } else {
                                break;
                            }
                        }

                        if (count >= 4) {
                            return { row, col };
                        }
                    }
                }
            }
        }
        return null;
    }
}
