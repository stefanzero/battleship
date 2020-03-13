/**
 * @type {parameters}
 */
const parameters = require('./parameters');
/**
 * @type {Object}
 */
const { numRows, numColumns, shipTypes, orientations } = parameters;

/**
 * Utility static class (mostly) containing common validation functions
 */
class Utils {
  /**
   * Returns true if row is on the board
   * @param {number }row row number
   * @returns {boolean}
   */
  static isRowValid = (row) => {
    return ((row >= 0) && (row < numRows));
  };

  /**
   * Returns true if column is on the board
   * @param {number }column column number
   * @returns {boolean}
   */
  static isColumnValid = (column) => {
    return ((column >= 0) && (column < numColumns));
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
    const { lastValidStartRow, lastValidStartColumn } = Utils.getValidStartPosition(
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
    const lastValidStartRow = numRows - length * rowFactor;
    const lastValidStartColumn = numColumns - length * columnFactor;
    return {lastValidStartRow, lastValidStartColumn};
  };

  /**
   * Return a random start position that a ship of a given shipType and
   * orientation can fit on the board.
   *
   * @param {number} shipTypeId type of ship
   * @param {string} orientation orientation of ship (horizontal | vertical)
   * @returns {{startRow: number, startColumn: number}}
   * @throws if shipTypeId or orientation is invalid
   */
  static getRandomShipPosition = ({shipTypeId, orientation}) => {
    if (!(shipTypeId in shipTypes)) {
      throw new Error(`Utils.getRandomShipPosition invalid shipTypeId: ${shipTypeId}`);
    };
    if (!(orientation in orientations)) {
      throw new Error(`Utils.getRandomShipPosition invalid orientation: ${orientation}`);
    };
    const {lastValidStartRow, lastValidStartColumn} = Utils
      .getValidStartPosition({shipTypeId, orientation})
    const startRow = Math.floor(Math.random() * lastValidStartRow);
    const startColumn = Math.floor(Math.random() * lastValidStartColumn);
    return {startRow, startColumn}
  };
};

module.exports = Utils;