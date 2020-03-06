const constants = require('./constants');
const { maxRows, maxColumns, shipTypes, orientations } = constants;

class utils {
  /**
   * Returns true if row is on the board
   * @param {number }row row number
   * @returns {boolean}
   */
  static isRowValid = (row) => {
    return ((row >= 0) && (row < maxRows));
  };

  /**
   * Returns true if column is on the board
   * @param {number }column column number
   * @returns {boolean}
   */
  static isColumnValid = (column) => {
    return ((column >= 0) && (column < maxColumns));
  };

  /**
   * Returns true if ship fits on the board at given position and orientation
   * the logic for checking if ships overlap is in board.addShip
   *
   * @param {number} shipTypeId type of ship
   * @param {string} orientation orientation of ship (horizontal | vertical)
   * @param {number} startRow row number at start of ship
   * @param {number} startColumn column number at start of ship
   * @returns {boolean}
   */
  static isValidShipPosition = ({shipTypeId, orientation, startRow, startColumn}) => {
    const { lastValidStartRow, lastValidStartColumn } = utils.getValidStartPosition(
      {shipTypeId, orientation}
    )
    return (
      (startRow >= 0) &&
      (startRow <= lastValidStartRow) &&
      (startColumn >=0) &&
      (startColumn <= lastValidStartColumn)
    )
  };

  /*
   */
  /**
   * Calculate the last valid start position that a ship of a given shipType and
   * orientation can fit on the board.
   *
   * @param {number} shipTypeId type of ship
   * @param {string} orientation orientation of ship (horizontal | vertical)
   * @returns {{lastValidStartRow: number, lastValidStartColumn: number}}
   */
  static getValidStartPosition = ({shipTypeId, orientation}) => {
    const shipType = shipTypes[shipTypeId];
    const { rowFactor, columnFactor } = orientations[orientation];
    const { length } = shipType;
    const lastValidStartRow = maxRows - length * rowFactor;
    const lastValidStartColumn = maxColumns - length * columnFactor;
    return {lastValidStartRow, lastValidStartColumn};
  };

  /**
   * Return a random start position that a ship of a given shipType and
   * orientation can fit on the board.
   *
   * @param {number} shipTypeId type of ship
   * @param {string} orientation orientation of ship (horizontal | vertical)
   * @returns {{startRow: number, startColumn: number}}
   */
  static getRandomShipPosition = ({shipTypeId, orientation}) => {
    if (!(shipTypeId in shipTypes)) {
      throw new Error(`utils.getRandomShipPosition invalid shipTypeId: ${shipTypeId}`);
    };
    if (!(orientation in orientations)) {
      throw new Error(`utils.getRandomShipPosition invalid orientation: ${orientation}`);
    };
    const {lastValidStartRow, lastValidStartColumn} = utils
      .getValidStartPosition({shipTypeId, orientation})
    const startRow = Math.floor(Math.random() * lastValidStartRow);
    const startColumn = Math.floor(Math.random() * lastValidStartColumn);
    return {startRow, startColumn}
  };
};



/*
getGameTile(rowLetter, column) {
  if ((column < 0) || (column > maxColumns)) {
    throw new Error(`getGameTile invalid column ${column}`);
  }
  if (!/^[a-zA-Z]$/.test(rowLetter)) {
    throw new Error(`getGameTile invalid rowLetter ${rowLetter}`);
  }
  rowLetter = rowLetter.toUpperCase();
  if ((rowLetter < minRowLetter) || (rowLetter > maxRowLetter)) {
    throw new Error(`getGameTile invalid rowLetter ${rowLetter}`);
  }
  const row = rowLetter.charCodeAt(0) - minRowLetter.charCodeAt(0);
  return this.tiles[row][column - 1];
}
 */

module.exports = utils;