<template>
  <div>
    <div class="heading">
      <h1>Tic-Tac-Toe</h1>
    </div>
    <div class="game-over-text" v-if="gameOver">
      {{ gameOverText }}
    </div>
    <div class="tictactoe-board">
      <div :key="n" v-for="(n, i) in boardSize">
        <div :key="n" v-for="(n, j) in boardSize">
          <cell @click="performMove(j, i)" :value="board.cells[j][i]" />
        </div>
      </div>
    </div>
    <div class="menu">
      <button class="minus-btn" @click="decrease">-</button>
      <button class="plus-btn" @click="increase">+</button>
      <button class="history-btn" @click="getHistory">View Game History</button>
      <button class="newgame-btn" @click="newGame">New Game</button>
    </div>

    <div v-if="showHistory">
      <ul class="history">
        <li class="list" v-for="item in history" :key="item.id">
          <div class="sub">
            {{ item.id }}: {{ item.position }}
            <button @click="viewHistory(item.position)">View Game</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Board from "./Board";
import axios from "axios";
export default {
  data() {
    return {
      gameOver: false,
      gameOverText: "",
      board: new Board([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]),
      temp: [],
      boardSize: 3,
      history: [],
      showHistory: false,
      baseUrl: 'http://localhost:3000',
    };
  },
  methods: {
    newGame() {
      this.gameOver = false;
      this.gameOverText = "";
      this.board.cells =
        this.boardSize === 3
          ? [
              ["", "", ""],
              ["", "", ""],
              ["", "", ""],
            ]
          : [
              ["", "", "", ""],
              ["", "", "", ""],
              ["", "", "", ""],
              ["", "", "", ""],
            ];
    },
    viewHistory(position) {
      this.gameOverText = "";
      let usingSplit = position.split(",");
      let replay = this.board;
      if (this.boardSize === 3 && usingSplit.length === 9) {
        replay = [
          [usingSplit[0], usingSplit[1], usingSplit[2]],
          [usingSplit[3], usingSplit[4], usingSplit[5]],
          [usingSplit[6], usingSplit[7], usingSplit[8]],
        ];
      } else if (this.boardSize === 4 && usingSplit.length === 16) {
        replay = [
          [usingSplit[0], usingSplit[1], usingSplit[2], usingSplit[3]],
          [usingSplit[4], usingSplit[5], usingSplit[6], usingSplit[7]],
          [usingSplit[8], usingSplit[9], usingSplit[10], usingSplit[11]],
          [usingSplit[12], usingSplit[13], usingSplit[14], usingSplit[15]],
        ];
      } else {
        return;
      }

      this.board.cells = replay;
    },
    getHistory() {
      this.showHistory = !this.showHistory
      return axios.get(`${this.baseUrl}/history`).then((response) => {
        this.history = response.data;
      });
    },
    saveHistory(position) {
      return axios.post(`${this.baseUrl}/history`, {
        position: position.toString(),
      });
    },
    increase() {
      if (this.boardSize === 4) {
        return;
      }
      this.gameOver = false;
      this.temp = [];
      this.boardSize += 1;
      for (let i = 0; i < this.boardSize; i++) {
        let t = [];
        for (let j = 0; j < this.boardSize; j++) {
          t.push("");
        }
        this.temp.push(t);
      }

      this.board = new Board(this.temp);
    },
    decrease() {
      if (this.boardSize === 3) {
        return;
      }
      this.gameOver = false;
      this.temp = [];
      this.boardSize -= 1;
      for (let i = 0; i < this.boardSize; i++) {
        let t = [];
        for (let j = 0; j < this.boardSize; j++) {
          t.push("");
        }
        this.temp.push(t);
      }

      this.board = new Board(this.temp);
    },
    saveGame() {
      this.saveHistory(this.board.cells);
    },
    performMove(x, y) {
      if (this.gameOver) {
        return;
      }
      if (!this.board.doMove(x, y, "x")) {
        // Invalid move.
        return;
      }
      this.$forceUpdate();

      if (this.board.isGameOver(this.boardSize)) {
        this.gameOver = true;
        this.saveGame();
        if (this.boardSize === 3) {
          this.gameOverText = this.board.playerHas3InARow("x")
            ? "You win!"
            : "Draw";
          return;
        } else {
          this.gameOverText = this.board.playerHas4InARow("x")
            ? "You win!"
            : "Draw";
          return;
        }
      }
      let aiMove = this.minimax(this.board.clone(this.board), "o");
      this.board.doMove(aiMove.move.x, aiMove.move.y, "o");
      if (this.board.isGameOver(this.boardSize)) {
        this.gameOver = true;
        this.saveGame();
        if (this.boardSize === 3) {
          this.gameOverText = this.board.playerHas3InARow("o")
            ? "You lose!"
            : "Draw";
        } else {
          this.gameOverText = this.board.playerHas4InARow("o")
            ? "You lose!"
            : "Draw";
          return;
        }
      }
      this.$forceUpdate();
    },
    minimax(board, player, depth = 1) {
      if (this.boardSize === 3 ? depth === 7 : depth === 5) {
        return {
          score: board.getScore(this.boardSize) + depth,
        };
      }
      // If the board has 3 in a row return the score of the board.
      if (board.isGameOver(this.boardSize)) {
        return {
          score: board.getScore(this.boardSize) + depth,
          move: null,
        };
      }
      // The 'o' player wants to maximize its score, the 'x' player wants to
      // minimize its score.
      let bestScore = player === "o" ? -10000 : 10000;
      let bestMove = null;
      let moves = board.getPossibleMoves(this.boardSize);

      for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let newBoard = board.clone(board);
        newBoard.doMove(move.x, move.y, player);
        // Recursively call the minimax function for the new board.
        const score = this.minimax(
          newBoard,
          player === "x" ? "o" : "x",
          depth + 1
        ).score;
        // If the score is better than the best saved score update the best saved
        // score to this move.
        if (
          (player === "o" && score > bestScore) ||
          (player === "x" && score < bestScore)
        ) {
          bestScore = score;
          bestMove = move;
        }
      }
      // Return the best found score & move!
      return {
        score: bestScore,
        move: bestMove,
      };
    },
  },
};
</script>
<style>
.tictactoe-board {
  margin: 0 auto;
  display: flex;
  /* flex-wrap: wrap; */
  width: 304px;
  height: auto;
}
.game-over-text {
  font-weight: bold;
  color: black;
  margin: 0 auto;
  display: flex;
  width: 304px;
  height: auto;
}
.heading {
  text-align: center;
  width: 320px;
  color: black;
}
.menu {
  display: flex;
}
.history {
  border: 1px solid #eee;
  border-radius: 2px;
  text-align: left;
  width: 404px;
}
.sub {
  display: flex;
  justify-content: space-between;
}
.list {
  display: list-item;
}
.plus-btn {
  background-color: #e7e7e7;
  height: 30px;
  width: 50px;
}
.minus-btn {
  color: white;
  background-color: #555555;
  height: 30px;
  width: 50px;
}
.newgame-btn {
  color: white;
  background-color: #1dab39;
  height: 30px;
}
.history-btn {
  color: white;
  background-color: #1d93ab;
  height: 30px;
}
</style>