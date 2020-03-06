const chalk = require('chalk');
const constants = require('./constants');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes } = constants;
const { isRowValid, isColumnValid } = utils;

/**
 * Grid item storing
 *   position,
 *   ship object (if any),
 *   attacked (has this tile been attacked)
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
     * @type {?Ship}
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
}

module.exports = Tile;