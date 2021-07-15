export default class Board {
  constructor(val) {
    this.cells = val
  }

  isGameOver(size) {
    if (size === 3) {
      return this.getPossibleMoves(size).length === 0 || this.playerHas3InARow('x') || this.playerHas3InARow('o');
    }
    else {
      return this.getPossibleMoves(size).length === 0 || this.playerHas4InARow('x') || this.playerHas4InARow('o');
    }
  }

  clone(temp, boardSize) {
    let clone = new Board(JSON.parse(JSON.stringify(temp.cells)));

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        clone.cells[i][j] = this.cells[i][j];
      }
    }

    return clone;
  }

  getPossibleMoves(boardSize) {
    let moves = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (this.cells[i][j] === '') {
          moves.push({ x: i, y: j });
        }
      }
    }
    return moves;
  }

  doMove(x, y, player) {
    if (this.cells[x][y] !== '') {
      return false;
    }

    this.cells[x][y] = player;
    return true;
  }

  getScore(size) {
    let score = 0;
    if (size === 3) {
      if (this.playerHas3InARow('x')) {
        score -= 100;
      }
      if (this.playerHas3InARow('o')) {
        score += 100;
      }
    }
    else {
      if (this.playerHas4InARow('x')) {
        score -= 100;
      }
      if (this.playerHas4InARow('o')) {
        score += 100;
      }
    }
    return score;
  }

  playerHas3InARow(player) {

    // Horizontal rows
    for (let i = 0; i < 3; i++) {
      if (this.cells[0][i] === player && this.cells[1][i] === player && this.cells[2][i] === player) {
        return true;
      }
    }

    // Vertical rows
    for (let i = 0; i < 3; i++) {
      if (this.cells[i][0] === player && this.cells[i][1] === player && this.cells[i][2] === player) {
        return true;
      }
    }

    // Diagonals
    if (this.cells[0][0] === player && this.cells[1][1] === player && this.cells[2][2] === player) {
      return true;
    }
    if (this.cells[2][0] === player && this.cells[1][1] === player && this.cells[0][2] === player) {
      return true;
    }

    return false;
  }

  playerHas4InARow(player) {

    // Horizontal rows
    for (let i = 0; i < 4; i++) {
      if (this.cells[0][i] === player && this.cells[1][i] === player && this.cells[2][i] === player && this.cells[3][i] === player) {
        return true;
      }
    }

    // Vertical rows
    for (let i = 0; i < 4; i++) {
      if (this.cells[i][0] === player && this.cells[i][1] === player && this.cells[i][2] === player && this.cells[i][3] === player) {
        return true;
      }
    }

    // Diagonals
    if (this.cells[0][0] === player && this.cells[1][1] === player && this.cells[2][2] === player && this.cells[3][3] === player) {
      return true;
    }
    if (this.cells[3][0] === player && this.cells[2][1] === player && this.cells[1][2] === player && this.cells[0][3] === player) {
      return true;
    }

    return false;
  }

  toString() {
    let str = "";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        str += this.cells[j][i];
      }
      str += "\n"
    }
    return str;
  }
}