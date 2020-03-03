const chalk = require('chalk');
const constants = require('./constants');

const { maxRows, maxColumns, shipTypes } = constants;

class Tile {
  constructor(row, column) {
    if ((row < 0) || (row >= maxRows)) {
      throw new Error(`invalid tile row ${row}`)
    }
    if ((column < 0) || (column >= maxColumns)) {
      throw new Error(`invalid tile column ${column}`)
    }
    // this.row = row;
    // this.column = column;
    this.ship = null;
    this.attacked = false;
  }

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
   *   green:   ship && playerView
   */
  toString(playerView = false) {
    const symbol = this.attacked ? 'x' : 'o';
    let bgColor = 'bgWhite';
    const fontColor = 'black';
    if (this.ship) {
      if (playerView) {
        if (this.attacked) {
          bgColor = 'bgGreen'
        }
      } else {
        bgColor = shipTypes[this.ship.shipTypeId].color;
      }
    }
    return chalk`{${fontColor}.${bgColor}  ${symbol} }`;
  }
}

module.exports = Tile;