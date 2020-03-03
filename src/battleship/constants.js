const constants = {
  maxRows: 10,
  maxColumns: 10,
  shipTypes: {
    1: {
      shipTypeId: 1,
      name: 'Aircraft Carrier',
      length: 5,
      count: 1,
      color: 'bgRed'
    },
    2: {
      shipTypeId: 2,
      name: 'Battleship',
      length: 4,
      count: 1,
      color: 'bgYellow'
    },
    3: {
      shipTypeId: 3,
      name: 'Cruiser',
      length: 3,
      count: 1,
      color: 'bgYellowBright'
    },
    4: {
      shipTypeId: 4,
      name: 'Destroyer',
      length: 2,
      count: 2,
      color: 'bgCyan'
    },
    5: {
      shipTypeId: 5,
      name: 'Submarine',
      length: 1,
      count: 2,
      color: 'bgMagenta'
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
  }, 0)

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