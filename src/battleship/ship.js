const constants = require('./constants');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes, orientations } = constants;
const { isValidShipPosition } = utils;

class Ship {
  constructor({shipTypeId, orientation, startRow, startColumn}) {
    if (!(orientation in orientations)) {
      throw new Error(`Ship constructor: invalid ship orientation ${orientation}`);
    }
    if (!(shipTypeId in shipTypes)) {
      throw new Error(`Ship constructor: invalid shipTypeId ${shipTypeId}`);
    }
    const shipType = shipTypes[shipTypeId];
    const { length, name, color } = shipType;
    if (!isValidShipPosition({shipTypeId, orientation, startRow, startColumn})) {
      const msg = `length: ${length}, ${orientation}, [${startRow}, ${startColumn}]`;
      throw new Error(`Ship constructor: invalid position for ${msg}`);
    };
    const sunk = false;
    Object.assign(this, {
      shipTypeId, length, name, sunk, color
    });
    /*
     * for horizontal orientation, only the column is incremented (columnFactor = 1)
     * for vertical orientation, only the row is incremented (rowFactor = 1)
     */
    const { rowFactor, columnFactor } = orientations[orientation];
    this.positions = new Array(length)
      .fill(null)
      .map((v, k) => {
        const row = startRow + rowFactor * k;
        const column = startColumn + columnFactor * k;
        return [row, column]
      });
    this.hits = new Array(length).fill(false);

    // this.id = Ship.id++;
    // this.tiles = [];
  }

  hit({row, column}) {
    const index = this.positions.findIndex(item =>
      (item[0] === row) && (item[1] === column)
    );
    if (index < 0) {
      throw new Error(`Ship.hit invalid position [${row}, ${column}]`);
    }
    this.hits[index] = true;
    this.sunk = this.hits.filter(value => value === true).length === this.length;
  }

}

// Ship.id = 0;

module.exports = Ship;