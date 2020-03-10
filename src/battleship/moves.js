// const utils = require('./utils');
// const { isRowValid } = utils;

class Moves {

  constructor({board, toConsole}) {
    /**
     * @type Board
     * @desc board
     */
    this.board = board;
    /**
     * @type {{row: number, column: number}[]}
     * @desc tiles attacked
     */
    this.moves = [];
    /**
     * @type {string[]}
     * @desc result of attack
     */
    this.results = [];
    /**
     * @type {{game: string, player: string}[]}
     * @desc string representation board for game view and player view
     */
    this.boardString = [];
    /**
     * @type {{game: string, player: string}[]}
     * @desc HTML representation board for game view and player view
     */
    this.boardHtml = [];
    /**
     * @type {boolean[]}
     * @desc optional array to display strategy in game.play
     */
    this.random = [];
    /**
     * @type boolean
     * @desc if true, print moves and board game view to the console
     */
    this.toConsole = toConsole;
  }

  setIsRandom(isRandom) {
    this.isRandom = isRandom;
  }

  /**
   *
   * @param {number} row
   * @param {number} column
   * @param {string} result
   * @param {boolean} isRandom
   */
  addMove({row, column, result}) {
    this.moves.push({row, column});
    this.results.push(result);
    this.boardString.push({
      game: this.board.toString(),
      player: this.board.toString(true)
    });
    this.boardHtml.push({
      game: this.board.toHtml(),
      player: this.board.toHtml(true)
    });
    this.random.push(this.isRandom);

    if (this.toConsole) {
      const move = this.moves.length - 1;
      if (this.isRandom) {
        console.log('Random attack');
      }
      if (move > 0) {
        console.log(`Move #${move}:  attack(${row}, ${column})`)
      }
      console.log(result.toUpperCase());
      console.log(this.boardString[move].game);
      if (this.board.gameOver) {
        console.log(`Win in ${move} moves`);
      }
    }
    this.isRandom = false;
  }

  formatDescription(move) {
    if ((move < 0) || (move > this.results.length)) {
      return ''
    }
    const items = [];
    const position = this.moves[move];
    if (position.row !== null) {
      items.push(`Move #${move}`);
      if (this.random[move]) {
        items.push('Random attack');
      }
      items.push(`Attack(${position.row}, ${position.column})`);
    }
    items.push(this.results[move].toUpperCase());
    return items;
  }

  descriptionHtml(move) {
    if ((move < 0) || (move > this.results.length)) {
      return ''
    }
    return this.formatDescription(move)
      .map(item => {
        return `<p>${item}</p>`
      })
      .join('')
  }

}

module.exports = Moves;