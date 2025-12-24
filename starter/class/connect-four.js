const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    // Replace this with real commands
    // Screen.addCommand('t', 'test command (remove)', ConnectFour.testCommand);

    // this.cursor.setBackgroundColor();
    Screen.addCommand('a', 'move left', () => this.cursor.left());
    Screen.addCommand('d', 'move right', () => this.cursor.right());
    Screen.addCommand('s', 'move down', () => this.cursor.down());
    Screen.addCommand('w', 'move up', () => this.cursor.up());

    Screen.addCommand('space', 'drop piece', () => this.dropPiece());

    this.cursor.setBackgroundColor();
    Screen.setMessage(`Player ${this.playerTurn}'s turn`);
    Screen.render();

    // Screen.render();
  }

  // Remove this
  static testCommand() {
    console.log("TEST COMMAND");
  }

  static checkWin(grid) {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1]   // diagonal /
    ];

    const inBounds = (r, c) =>
      r >= 0 && r < 6 && c >= 0 && c < 7;

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const player = grid[row][col];
        if (player === ' ') continue;

        for (let [dr, dc] of directions) {
          let count = 1;
          let r = row + dr;
          let c = col + dc;

          while (inBounds(r, c) && grid[r][c] === player) {
            count++;
            if (count === 4) return player;
            r += dr;
            c += dc;
          }
        }
      }
    }

    // Check tie
    if (grid.every(row => row.every(cell => cell !== ' '))) {
      return 'T';
    }

    return false;
  }

  dropPiece() {
    const col = this.cursor.col;

    for (let row = 5; row >= 0; row--) {
      if (this.grid[row][col] === ' ') {
        this.grid[row][col] = this.playerTurn;
        Screen.setGrid(row, col, this.playerTurn);

        const winner = ConnectFour.checkWin(this.grid);
        if (winner) {
          ConnectFour.endGame(winner);
          return;
        }

        this.playerTurn = this.playerTurn === 'O' ? 'X' : 'O';
        Screen.setMessage(`Player ${this.playerTurn}'s turn`);
        Screen.render();
        return;
      }
    }
  }


  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;
