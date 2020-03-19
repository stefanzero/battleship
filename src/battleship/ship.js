/**
 * @type {parameters}
 */
const parameters = require('./parameters');
/**
 * @type {Utils}
 */
const utils = require('./utils');

/**
 *
 */
const { numRows, numColumns, shipTypes, orientations } = parameters;
/**
 * @type {Object}
 * @property {function} utils.isValidShipPosition
 */
const { isValidShipPosition } = utils;

/**
 * The Ship class contains key ship properties:
 * * shipType
 * * positions (array of row, column indexes) of tiles that the ship is placed on
 * * hits (1-D boolean array) indicating if the index in positions has been hit
 * * sunk (boolean) true if all positions have been hit
 *
 * <br />
 * Ship also includes denomalized (copied) values from the shipType for convenience:
 * * length
 * * name (of type of ship)
 *
 * <br />
 * Ship has one private method:
 * * hit: set the corresponding index in hits to true, and sets sunk to true if all
 *   ship positions have been hit
 */
class Ship {
  /**
   * @param {number} shipTypeId id of ship type
   * @param {string} orientation "horizontal" or "vertical"
   * @param {number} startRow row of first tile
   * @param {number} startColumn column of first tile
   */
  constructor({shipTypeId, orientation, startRow, startColumn}) {
    if (!(orientation in orientations)) {
      throw new Error(`Ship constructor: invalid ship orientation ${orientation}`);
    }
    if (!(shipTypeId in shipTypes)) {
      throw new Error(`Ship constructor: invalid shipTypeId ${shipTypeId}`);
    }
    /**
     * @type shipType
     */
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
     * @desc key in parameters.shipType
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
   * This method is called by board.attack, and should not be called independently.
   *
   * @private
   * @param {Object} obj destructured object
   * @param {number} obj.row zero-based index of row on board matrix
   * @param {number} obj.column zero-based index of column on board matrix
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

  isHit({row, column}) {
    const index = this.positions.findIndex(item =>
      (item[0] === row) && (item[1] === column)
    );
    if (index < 0) {
      console.error(`Ship.isHit invalid position [${row}, ${column}]`);
      return false;
    }
    return this.hits[index];
  }

}

module.exports = Ship;