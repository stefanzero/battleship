const chalk = require('chalk');
const constants = require('./constants');
const Board = require('./board');
const Tile = require('./tile');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes, totalCount } = constants;
const { isRowValid, isColumnValid, getRandomShipPosition } = utils;

const fontColor = 'white';
const bgColor = 'bgBlack';
const bannerFontColor = 'black';
const bannerBgColor = 'bgWhite';
const dash = '-';
const pipe = '|';
const space = ' ';
const width = maxColumns * 3;

const square = chalk`{${fontColor}.${bgColor} ${dash}}`;
const edge = chalk`{${fontColor}.${bgColor} ${pipe}}`;
const blank = chalk`{${bannerFontColor}.${bannerBgColor} ${space}}`;
const border = square.repeat(width);

class Game {

  /**
   * If no array of ships is provide, all necessary ships will be added to
   * the board at random positions that do not overlap.
   *
   * @param {?[Ship]} ships optional array of ships
   */
  constructor(ships = []) {
    /**
     * @type {Board}
     */
    this.board = new Board();
    this.board.setUp(ships);
    /**
     * @type {string[]}
     * @desc array of html strings for game output
     */
    this.html = [];
    /**
     * @type {boolean}
     * @desc send output to the console
     */
    this.toConsole = true;
  }

  /**
   * Return random position on the board.
   * @returns {{column: number, row: number}}
   */
  static randomPosition() {
    const row = Math.floor(maxRows * Math.random())
    const column = Math.floor(maxColumns * Math.random())
    return { row, column };
  }

  /**
   * Return random position that has not been attacked.
   *
   * @returns {{column: number, row: number}}
   */
  randomAvailablePosition() {
    /**
     * @type {number}
     */
    let row;
    /**
     * @type {number}
     */
    let column;
    const { board } = this;
    do {
      ({ row, column } = Game.randomPosition());
    } while (board.isAttacked({ row, column }))
    return { row, column };
  }

  /**
   * Return array of positions that are neighbors to the given position and
   * that have not been attacked.
   *
   * @param {Object} obj
   * @param {number} obj.row
   * @param {number} obj.column
   * @returns {Array<{column: number, row: number}>}
   */
  availableNeighbors({row, column}) {
    const neighbors = [
      {row: row - 1, column},
      {row: row + 1, column},
      {row, column: column - 1},
      {row, column: column + 1}
    ];
    const { board } = this;
    const available = neighbors.reduce((acc, next) => {
      const { row, column } = next;
      if (isRowValid(row) && isColumnValid(column) && !board.isAttacked({ row, column })) {
        acc.push({ row, column })
      }
      return acc;
    }, []);
    if (Game.logStack) {
      const s = available.map(a => `(${a.row}, ${a.column})`).join(', ');
      console.log(`availableNeighbors(${row}, ${column}): ${s}`);
    }
    return available;
  }

  /**
   * Simulate game play using this strategy:
   *   * store positions to try next on a stack
   *   * if the stack is empty, push a random available position onto the stack
   *   * pop the next position from the stack
   *   * if the attack was a hit, push the next available neighbors onto the stack
   *   * store the last hit position
   *   * if there was a last hit, then filter the stack to keep positions in line with
   *   the last hit
   *
   * @param {boolean} toConsole
   * @returns {string[]}
   */
  play(toConsole = true) {
    this.toConsole = toConsole;
    let currentString = '';
    this.log('Initial Board')
    this.log(this.board);
    let stack = [];
    let lastStack = [];
    let current;
    let numMoves = 0;
    let lastHit;
    while (!this.board.isWon()) {
      if (!stack.length) {
        if (lastStack.length) {
          stack = lastStack;
        } else {
          this.log('Random attack');
          stack.push(this.randomAvailablePosition())
        }
      }
      if (Game.logStack) {
        const s = stack.map(a => `(${a.row}, ${a.column})`).join(', ');
        this.log(`stack: ${s}`);
      }
      current = stack.pop();
      const {row, column} = current;
      if (!this.board.isAttacked({row, column})) {
        numMoves++;
        const attackResult = this.board.attack(current);
        this.log(`move #${numMoves}:  attack (${row}, ${column})`);
        this.log(attackResult.toUpperCase());
        this.log(this.board);
        if (attackResult === 'Hit') {
          stack.push(...this.availableNeighbors(current));
          if (lastHit) {
            /*
             * remove items from the stack that are not in a line with the last hit
             * save the stack in case the filter does not end up in a ship being sunk
             */
            lastStack = stack;
            if (lastHit.row === row) {
              stack = stack.filter(item => item.row === row);
            } else {
              stack = stack.filter(item => item.column === column);
            }
          }
          if (Game.logStack) {
            const s = stack.map(a => `(${a.row}, ${a.column})`).join(', ');
            this.log(`filtered stack: ${s}`);
          }
          lastHit = current;
        } else if (attackResult === 'Sunk') {
          /*
           * empty the stack if we just sunk a ship
           */
          stack = [];
          lastHit = null;
        }
      }
    }
    this.log(`Win in ${numMoves} moves`);
    return this.html;
  }

  /**
   * Save string as html to output array and to console.
   *
   * @param {string} s
   */
  log(s) {
    let html = `<p>${s}</p>`;
    if (s instanceof Object) {
      if (typeof s.toHtml === 'function') {
        html = s.toHtml();
      }
    }
    this.html.push(html);
    this.toConsole && console.log(s);
  }

  static getHtmlStyleType() {
    return Tile.getHtmlStyleTag();
  }

  /**
   * Return string with banner for a given game number.
   *
   * @param {number} gameNumber
   */
  static gameBanner(gameNumber) {
    const heading = `Game #${gameNumber}`;
    const banner = chalk`{${bannerFontColor}.${bannerBgColor} ${heading}}`;
    const leadingSpace = Math.floor((width - heading.length - 2) / 2);
    const trailingSpace = width - heading.length - leadingSpace - 2;
    return '\n' + border + '\n' +
      edge +
      blank.repeat(leadingSpace) +
      banner +
      blank.repeat(trailingSpace) +
      edge + '\n' +
      border;
  }
}

Game.logStack = false;

module.exports = Game;

/*
strategy:


stack of tiles to pick next

list of tiles with hits

      n
     nxn
      n

if x is a hit, then put neighbors on stack
pop until stack is empty
attack if not was attacked
when stack is empty, push random pick on stack

 */

