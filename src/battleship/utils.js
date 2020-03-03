const Ship = require('./ship');
const constants = require('./constants');
const { maxRows, maxColumns, shipTypes, orientations } = constants;

const utils = {};

utils.isRowValid = (row) => {
  return ((row >= 0) && (row < maxRows));
};

utils.isColumnValid = (column) => {
  return ((column >= 0) && (column < maxColumns));
};

/*
 * the logic for checking if ships overlap is in board.addShip
 */
utils.isValidShipPosition = ({shipTypeId, orientation, startRow, startColumn}) => {
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
 * a ship cannot be positioned at a given startRow and startColumn if it
 * will extend beyond the board boundaries
 */
utils.getValidStartPosition = ({shipTypeId, orientation}) => {
  const shipType = shipTypes[shipTypeId];
  const { rowFactor, columnFactor } = orientations[orientation];
  const { length } = shipType;
  const lastValidStartRow = maxRows - length * rowFactor;
  const lastValidStartColumn = maxColumns - length * columnFactor;
  return {lastValidStartRow, lastValidStartColumn};
};

utils.getRandomShipPosition = ({shipTypeId, orientation}) => {
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