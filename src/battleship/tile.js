const chalk = require('chalk');
const constants = require('./constants');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes } = constants;
const { isRowValid, isColumnValid } = utils;

/**
 *
 * A Tile is an object of the board representing
 *   the position,
 *   the ship object (if any), and
 *   if this object has been attacked
 */
class Tile {
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
   * Return string representation of the board, where ships are colored acccording
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
     *   font color:
     *   black:   non-playerView
     *   white:   playerView
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
     */
    const symbol = this.attacked ? 'x' : 'o';
    let bgColor = 'bgWhite';
    const fontColor = 'black';
    if (this.ship) {
      if (playerView) {
        if (this.attacked) {
          bgColor = this.ship.sunk ? 'bgRed' : 'bgGreen';
        }
      } else {
        bgColor = shipTypes[this.ship.shipTypeId].color;
      }
    }
    return chalk`{${fontColor}.${bgColor}  ${symbol} }`;
  }

  toHtml(playerView = false) {
    const symbol = this.attacked ? 'x' : 'o';
    let className = 'empty';
    if (this.ship) {
      if (playerView) {
        if (this.attacked) {
          className = this.ship.sunk ? 'sunk' : 'attacked';
        }
      } else {
        className = `shipType${this.ship.shipTypeId}`;
      }
    }
    const html =  `<span class="${className}">${symbol}</span>`;
    return `<span class="${className}">${symbol}</span>`;
  }

  static getHtmlStyleTag() {
    return `
      <style>
        .demo p {
          margin: 0 0;
          color: black;
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
          color: black;
          background-color: green;
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