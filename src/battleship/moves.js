/**
 * Data storage class for each move (attack) in the game.
 * Sample usage is in scripts/create-demo, where a game is played and
 * the results displayed as HTML.
 */
class Moves {

  /**
   * @param {Board} board instance of Board
   * @param {?boolean} toConsole if true, addMove displays result to console
   * @param {?boolean} playerView if true, the ships are not displayed
   */
  constructor({board, toConsole= false, playerView = false}) {
    /**
     * @type {Board}
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
     * @type {boolean}
     * @desc display strategy in game.play
     */
    this.isRandom = false;
    /**
     * @type {boolean[]}
     * @desc optional array to display strategy in game.play
     */
    this.random = [];
    /**
     * @type {boolean}
     * @desc if true, print moves and board game view to the console
     */
    this.toConsole = toConsole;
    /**
     * @type {boolean}
     * @desc if true, player view is displayed (no ships)
     */
    this.playerView = playerView;
  }

  /**
   * Optional property set from game.play
   * @param {boolean} isRandom
   */
  setIsRandom(isRandom) {
    this.isRandom = isRandom;
  }

  /**
   * Called from board.attack
   * @private
   * @param {Object} obj
   * @param {number} obj.row
   * @param {number} obj.column
   * @param {string} obj.result
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
      const view = this.playerView ? 'player' : 'game';
      if (this.isRandom) {
        console.log('Random attack');
      }
      if (move > 0) {
        console.log(`Move #${move}:  attack(${row}, ${column})`)
      }
      console.log(result.toUpperCase());
      console.log(this.boardString[move][view]);
      if (this.board.gameOver) {
        console.log(`Win in ${move} moves`);
      }
    }
    this.isRandom = false;
  }

  /**
   * Create an array of strings describing the move
   * @param {number} move array index
   * @returns {string[]}
   */
  formatDescription(move) {
    if ((move < 0) || (move > this.results.length)) {
      return [];
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

  /**
   * Create HTML describing the move
   * @param {number} move array index
   * @returns {string}
   */
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