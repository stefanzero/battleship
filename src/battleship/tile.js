/**
 * @type function
 */
const chalk = require('chalk');
/**
 * @type {parameters}
 */
const parameters = require('./parameters');
/**
 * @type {Utils}
 */
const utils = require('./utils');
/**
 * @type {Object}
 */
const { numRows, numColumns, shipTypes } = parameters;
/**
 * @type {Object}
 */
const { isRowValid, isColumnValid } = utils;

/**
 *
 * A Tile is an object of the board representing:
 *   * the position,
 *   * the ship object (if any), and
 *   * if this object has been attacked
 */
class Tile {

  /**
   * @param {number} row zero-based index of row on board matrix
   * @param {number} column zero-based index of column on board matrix
   * @throws if row or column is invalid
   */
  constructor(row, column) {
    if (!isRowValid(row)) {
      throw new Error(`invalid tile row ${row}`)
    }
    if (!isColumnValid(column)) {
      throw new Error(`invalid tile column ${column}`)
    }
    /**
     * @type {number}
     * @desc zero-based row number
     */
    this.row = row;
    /**
     * @type {number}
     * @desc zero-based column number
     */
    this.column = column;
    /**
     * @type {Ship|null}
     * @desc ship object if this tile belongs to a ship
     */
    this.ship = null;
    /**
     * @type {boolean}
     * @desc true if this tile has been attacked
     */
    this.attacked = false;
  }

  /**
   * Return string representation of the tile, where ships are colored acccording
   * to the ship type.  The character is "o" for a tile that has not been attacked,
   * and "x" for a tile that has been attacked.
   *
   * @param {boolean} playerView if true, then the color only shows if a tile was
   * attacked or hit
   * @returns {string}
   */
  toString(playerView = false) {
    /*
     * code:
     *
     *   symbol:
     *   o  unattacked
     *   x  attacked
     *
     *   font color not-attacked, hit or sunk:
     *   black:   non-playerView
     *   white:   playerView
     *
     *   font color attacked:
     *   white:   non-playerView
     *   black:   playerView
     *
     *   background color non-playerView:
     *   white:   non-ship tile
     *   red:     aircraft carrier
     *   orange:  battleship (yellow)
     *   yellow:  cruiser (yellowBright)
     *   cyan:    destroyer
     *   magenta: submarine
     *
     *   background color playerView:
     *   green:   ship
     *   red:     ship && ship.sunk
     *   blackBright:   attacked
     */
    let fontColor = 'black';
    let bgColor = 'bgWhite';
    const symbol = this.attacked ? 'x' : 'o';
    if (playerView) {
      if (this.ship) {
        if (this.attacked) {
          bgColor = this.ship.sunk ? 'bgRed' : 'bgYellow';
        }
      } else {
        fontColor = this.attacked ? 'white' : 'black';
        bgColor = this.attacked ? 'bgBlackBright' : 'bgWhite';
      }
    } else {
      if (this.ship) {
        bgColor = shipTypes[this.ship.shipTypeId].color;
      } else {
        fontColor = this.attacked ? 'white' : 'black';
        bgColor = this.attacked ? 'bgBlackBright' : 'bgWhite';
      }
    }
    return chalk`{${fontColor}.${bgColor}  ${symbol} }`;
  }

  /**
   * Return HTML representation of the tile, where ships are colored acccording
   * to the ship type.  The character is "o" for a tile that has not been attacked,
   * and "x" for a tile that has been attacked.
   *
   * @param {boolean} playerView if true, then the color only shows if a tile was
   * attacked or hit
   * @returns {string}
   */
  toHtml(playerView = false) {
    const symbol = this.attacked ? 'x' : 'o';
    let className = 'empty';
    if (playerView) {
      if (this.ship) {
        if (this.attacked) {
          className = this.ship.sunk ? 'sunk' : 'hit';
        }
      } else {
        className = this.attacked ? 'attacked' : 'empty';
      }
    } else {
      if (this.ship) {
        className = `shipType${this.ship.shipTypeId}`;
      } else {
        className = this.attacked ? 'attacked' : 'empty';
      }
    }
    const html =  `<span class="${className}">${symbol}</span>`;
    return `<span class="${className}">${symbol}</span>`;
  }

  /**
   * Returns HTML Style tag with class rules for tile display.
   * @returns {string}
   */
  static getHtmlStyleTag() {
    return `
      <style>
        .demo p {
          margin: 0 0;
          color: black;
        }
        .demo table {
          width: 750px;
        }
        div.tiles {
          margin: 0.5em 0 1em 0;
        }
        .tiles span {
          width: 1.5em;
          height: 1.5em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .shipType1 {
          border: 1px solid #ddd;
          color: black;
          background-color: ${shipTypes[1].backgroundColor};
        }
        .shipType2 {
          border: 1px solid #ddd;
          color: black;
          background-color: ${shipTypes[2].backgroundColor};
        }
        .shipType3 {
          border: 1px solid #ddd;
          color: black;
          background-color: ${shipTypes[3].backgroundColor};
        }
        .shipType4 {
          border: 1px solid #ddd;
          color: black;
          background-color: ${shipTypes[4].backgroundColor};
        }
        .shipType5 {
          border: 1px solid #ddd;
          color: black;
          background-color: ${shipTypes[5].backgroundColor};
        }
        .attacked {
          border: 1px solid #ddd;
          color: white;
          background-color: #888;
        }
        .hit {
          border: 1px solid #ddd;
          color: black;
          background-color: yellowgreen;
        }
        .sunk {
          border: 1px solid #ddd;
          color: black;
          background-color: red;
        }
        .empty {
          border: 1px solid #ddd;
          color: black;
          background-color: #eee;
        }
      </style>
    `
  }

}

module.exports = Tile;