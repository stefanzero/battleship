/**
 * @typedef {Object} shipTypes
 * @property {shipType} 1 Aircraft Carrier
 * @property {shipType} 2 Battleship
 * @property {shipType} 3 Cruiser
 * @property {shipType} 4 Destroyer
 * @property {shipType} 5 Submarine
 */
/**
 * @typedef {Object} shipType
 * @property {number} shipTypeId
 *   1 = Aircraft Carrier,
 *   2 = Battleship,
 *   3 = Cruiser,
 *   4 = Destroyer,
 *   5 = Submarine
 * @property {string} name Aircraft Carrier | Battleship | Cruiser | Destroyer | Submarine
 * @property {number} length length of ship
 * @property {number} count number of this ship type on the board
 * @property {string} color chalk color used in tile.toString()
 */
/**
 * @typedef {Object} orientation
 * @property {number} columnFactor 0 for vertical, 1 for horizontal
 * @property {number} rowFactor 0 for horizontal, 1 for vertical
 */
/**
 * @typedef {Object} orientations
 * @property {orientation} horizontal
 * @property {orientation} vertical
 */
/**
 * @typedef {Object} constants
 * @property {number} maxRows number of rows on the board
 * @property {number} maxColumns number of columns on the board
 * @property {shipTypes} shipTypes object of all shiptypes
 * @property {orientations} orientations object of orientations
 */
/**
 * @type {constants}
 */
const constants = {
  maxRows: 10,
  maxColumns: 10,
  shipTypes: {
    1: {
      shipTypeId: 1,
      name: 'Aircraft Carrier',
      length: 5,
      count: 1,
      color: 'bgRed',
      backgroundColor: 'crimson'
    },
    2: {
      shipTypeId: 2,
      name: 'Battleship',
      length: 4,
      count: 1,
      color: 'bgYellow',
      backgroundColor: 'yellow'
    },
    3: {
      shipTypeId: 3,
      name: 'Cruiser',
      length: 3,
      count: 1,
      color: 'bgYellowBright',
      backgroundColor: 'orange'
    },
    4: {
      shipTypeId: 4,
      name: 'Destroyer',
      length: 2,
      count: 2,
      color: 'bgCyan',
      backgroundColor: 'cyan'
    },
    5: {
      shipTypeId: 5,
      name: 'Submarine',
      length: 1,
      count: 2,
      color: 'bgMagenta',
      backgroundColor: 'magenta'
    }
  },
  orientations: {
    horizontal: {
      columnFactor: 1,
      rowFactor: 0
    },
    vertical: {
      columnFactor: 0,
      rowFactor: 1
    }
  }
};

constants.totalCount = Object.values(constants.shipTypes)
  .reduce((acc, next) => {
    return acc + next.count
  }, 0);

const totalShipArea = Object.values(constants.shipTypes)
  .reduce((acc, next) => {
    return acc + next.length * next.count
  }, 0);

/*
 * require that at least half of board space is empty
 */
const { maxRows, maxColumns } = constants;
if (totalShipArea > (maxRows * maxColumns) / 2) {
  throw new Error('available board space insufficient for total ship area');
}

const longestShip = Object.values(constants.shipTypes)
  .reduce((acc, next) => {
    return Math.max(acc, next.length)
  }, 0);

if (longestShip > Math.max(maxRows, maxColumns)) {
  throw new Error('board is too small to fit largest ship');
}

/*
 * The traditional Battleship game names tiles using a letter for the row
 * and number (starting at 1) for the column.
 *
 * Dynamically compute the maxRowLetter so the board dimensions can be
 * changed by only changing maxRows.
 */
constants.minRowLetter = 'A';
const maxCharCode = constants.minRowLetter.charCodeAt(0) + constants.maxRows - 1;
constants.maxRowLetter = String.fromCharCode(maxCharCode);

module.exports = constants;