const constants = require('./constants');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes, orientations } = constants;
const { isValidShipPosition } = utils;

/*
 * @class Ship
 */
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
    /**
     * @type {object}
     * @desc object containing shipTypeId, name (of shipType), length (of ship)
     */
    this.shipType = {...shipTypes[shipTypeId]};
    /**
     * @type {number}
     * @desc key in constants.shipType
     */
    this.shipTypeId = shipTypeId;
    /**
     * @type {number}
     * @desc length of the ship
     */
    this.length = length;
    /**
     * @type {string}
     * @desc name of the ship type
     */
    this.name = name;
    /**
     * @type {string}
     * @desc color of the ship tile.toString
     */
    this.color = color;
    /**
     * @type {boolean}
     * @desc true if the ship has been sunk
     */
    this.sunk = false;
    /*
     * for horizontal orientation, only the column is incremented (columnFactor = 1)
     * for vertical orientation, only the row is incremented (rowFactor = 1)
     */
    const { rowFactor, columnFactor } = orientations[orientation];
    /**
     * @type {[number, number][]}
     * @desc array of positions of the ship
     */
    this.positions = new Array(length)
      .fill(null)
      .map((v, k) => {
        const row = startRow + rowFactor * k;
        const column = startColumn + columnFactor * k;
        return [row, column]
      });
    /**
     * @type {[boolean]}
     * @desc true if the ship has been hit at that index
     */
    this.hits = new Array(length).fill(false);

  }

  /**
   * Mark a ship position as being hit.
   * Check if all the ship position have been hit, and if so, set ship.sunk = true.
   *
   * @param {Object} obj
   * @param {number} obj.row
   * @param {number} obj.column
   */
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

module.exports = Ship;