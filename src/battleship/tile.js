const chalk = require('chalk');
const constants = require('./constants');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes } = constants;
const { isRowValid, isColumnValid } = utils;

class Tile {
  constructor(row, column) {
    if (!isRowValid(row)) {
      throw new Error(`invalid tile row ${row}`)
    }
    if (!isColumnValid(column)) {
      throw new Error(`invalid tile column ${column}`)
    }
    this.row = row;
    this.column = column;
    this.ship = null;
    this.attacked = false;
  }

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
     *   background color:
     *   white:   non-ship tile
     *   red:     aircraft carrier
     *   orange:  battleship (yellow)
     *   yellow:  cruiser (yellowBright)
     *   cyan:    destroyer
     *   magenta: submarine
     *
     *   green:   ship && playerView
     *   red:     ship && playerView && ship.sunk
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