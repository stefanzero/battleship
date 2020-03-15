/**
 * @type {parameters}
 */
const parameters = require('./parameters');
/**
 * @type {Tile}
 */
const Tile = require('./tile');
/**
 *
 * @type {Ship}
 */
const Ship = require('./ship');
/**
 *
 * @type {Moves}
 */
const Moves = require('./moves');
/**
 * @type {Utils}
 */
const utils = require('./utils');

/**
 * @type {Object}
 */
const { numRows, numColumns, shipTypes, totalCount } = parameters;
/**
 * @type {Object}
 */
const { isRowValid, isColumnValid, getRandomShipPosition } = utils;

/**
 * Main class that controls basic operations of battleship.
 * * Key properties:
 *   * array of ships
 *   * matrix of tiles
 * * Key methods:
 *   * setUp
 *   * addShip
 *   * attack
 */
class Board {
  /**
   * @param {?boolean} toConsole controls if attacks are output to the console
   * @param {?boolean} playerView if true display player view
   */
  constructor(toConsole = false, playerView = false) {
    /**
     * @type {[Ship]}
     * @desc array of ships on the board
     */
    this.ships = [];
    /**
     * @type {Object}
     * @desc key = shipTypeId, value = number of ships of that type
     */
    this.shipTypeCount = {};
    /**
     * @type {Tile[][]}
     * @desc matrix of tiles
     */
    this.tiles = new Array(numRows)
      .fill(null)
      .map((r, i) => {
        return new Array(numColumns)
          .fill(null)
          .map((c, j) => {
            return new Tile(i, j)
          })
    });
    /**
     * @type {boolean}
     * @desc true if all required ships have been added to the board
     */
    this.isSetUp = false;
    /**
     * @type {boolean}
     * @desc true if all required ships have been sunk
     */
    this.gameOver = false;
    /**
     * @type {Moves}
     * @desc Game attack history is stored in the moves.
     */
    this.moves = new Moves({board: this, toConsole, playerView});
  }

  /**
   * Add ships to the board.  If not all required ships are supplied, missing ships are
   * added to the board at random positions until board is set up.
   *
   * @param {?Ship[]} ships optional array of ships
   */
  setUp(ships = []) {
    if (this.isSetUp) {
      Board.log && console.log('Board.setUp: board is already set up');
      return;
    }
    ships.forEach(ship => this.addShip(ship));
    /*
     * if more ships are needed, add ships at random positions
     */
    if (this.ships.length < totalCount) {
      const shipTypesToAdd = Object.values(shipTypes)
        .reduce((acc, next) => {
          const existingShips = this.shipTypeCount[next.shipTypeId] ?
            this.shipTypeCount[next.shipTypeId] : 0;
          return acc.concat(new Array(next.count - existingShips)
            .fill(next.shipTypeId));
        }, []);
      while (shipTypesToAdd.length) {
        /*
         * start from largest ships (beginning of array) because these will
         * most likely overlap with previous ships
         */
        const shipTypeId = shipTypesToAdd[0];
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const {startRow, startColumn} = getRandomShipPosition(
          {shipTypeId, orientation}
        );
        const ship = new Ship({
          shipTypeId, orientation, startRow, startColumn
        });
        /*
         * addShip will return false if the ship overlaps
         */
        if (this.addShip(ship)) {
          /*
           * if successful, remove from shipTypesToAdd
           */
          shipTypesToAdd.shift();
        }
      }
    }
  }

  /**
   * Add a ship to the board.  Return true if successful or the board is already full.
   * Return false if the ship would overlap an existing ship or if enough ships of
   * that type are already on the board.
   *
   * @param {Ship} ship
   * @returns {boolean}
   */
  addShip(ship) {
    if (this.isSetUp) {
      Board.log && console.log('board already has correct number of ships');
      return true;
    }
    /*
     * check that this ship does not overlap an existing ship
     */
    for (let position of Object.values(ship.positions)) {
      const [ row, column ] = position;
      if (this.tiles[row][column].ship) {
        Board.log && console.log('board.addShip ship overlaps existing ship');
        return false;
      }
    }
    /*
     * check that this ship type can still be added to the board
     */
    const { shipTypeId } = ship;
    const nextShipCount = this.shipTypeCount[shipTypeId] ?
      this.shipTypeCount[shipTypeId] + 1 : 1;
    if (nextShipCount > shipTypes[shipTypeId].count) {
      Board.log && console.log(`board.addShip exceeded count for ${shipTypes[shipTypeId].name}`);
      return false;
    }
    this.shipTypeCount[shipTypeId] = nextShipCount;
    this.ships.push(ship);
    /*
     * mark the appropriate tiles for this ship
     */
    for (let index of Object.values(ship.positions)) {
      const [ row, column ] = index;
      this.tiles[row][column].ship = ship;
    }
    this.isSetUp = this.ships.length === totalCount;
    if (this.isSetUp) {
      /*
       * Save the initial board
       */
      this.moves.addMove({row: null, column: null, result: 'Initial Board'});
    }
    return true;
  }

  /**
   * Attack a given position on the board.  Return a string describing the result:
   *  * "Miss" if there is no ship at that position
   *  * "Already Attacked" if there that tile was already attacked
   *  * "Win" if that attack sinks the final ship
   *  * "Sunk" if that attack hits the last un-hit position on a ship
   *  * "Hit" if that attack hits a ship
   *
   * @param {Object} obj
   * @param {number} obj.row
   * @param {number} obj.column
   * @returns {string}
   */
  attack({row, column}) {
    if (!this.isSetUp) {
      throw new Error('Cannot attack until board is set up');
    }
    if (!isRowValid(row) || !isColumnValid(column)) {
      throw new Error('Board.attack invalid position: [${row}, ${column}]');
    }
    if (this.gameOver) {
      console.error('Cannot attack because the game is over');
    }
    let result;
    const tile = this.tiles[row][column];
    const { attacked, ship } = tile;
    if (attacked) {
      result = 'Already Attacked'
    } else {
      tile.attacked = true;
      if (!ship) {
        result = 'Miss';
      } else {
        ship.hit({row, column});
        if (this.isWon()) {
          result = 'Win';
        } else if (ship.sunk) {
          result = 'Sunk'
        } else {
          result = 'Hit'
        }
      }
    }
    this.moves.addMove({row, column, result});
    return result;
  }

  /**
   * Return true if all ships on the board are sunk
   * @returns {boolean}
   */
  isWon() {
    this.gameOver = (
      this.isSetUp &&
      this.ships.filter(s => s.sunk).length === totalCount
    );
    return this.gameOver;
  }

  /**
   * Return true if the tile was attacked.
   *
   * @param {Object} obj
   * @param {number} obj.row
   * @param {number} obj.column
   * @returns {boolean}
   */
  isAttacked({row, column}) {
    return this.tiles[row][column].attacked;
  }

  /**
   * Return string representation of the board.
   *
   * @param {boolean} playerView true if the ships should not be displayed
   * @returns {string}
   */
  toString(playerView) {
    return this.tiles.map(
      row => {
        return row.map(
          tile => {
            return tile.toString(playerView)
          }
        ).join('').concat('\n')
      }
    ).join('');
  }

  /**
   * Return html representation of the board.
   *
   * @param {boolean} playerView true if the ships should not be displayed
   * @returns {string}
   */
  toHtml(playerView) {
    const tilesHtml = this.tiles.map(
      row => {
        return row.map(
          tile => {
            return tile.toHtml(playerView)
          }
        ).join('').concat('<br />')
      }
    ).join('');
    return `<div class="tiles">${tilesHtml}</div>`;
  }
}

// Board.log = false;

/**
 * Return array of ships shown on wikipedia for a sample game setup.
 * @returns {Ship[]}
 */
Board.getSampleShipArray = () => {
  const aircraftCarrier = new Ship({
    shipTypeId: 1,
    orientation: 'vertical',
    startRow: 1,
    startColumn: 9
  });
  const battleShip = new Ship({
    shipTypeId: 2,
    orientation: 'vertical',
    startRow: 4,
    startColumn: 7
  });
  const cruiser = new Ship({
    shipTypeId: 3,
    orientation: 'horizontal',
    startRow: 6,
    startColumn: 2
  });
  const destroyer1 = new Ship({
    shipTypeId: 4,
    orientation: 'vertical',
    startRow: 1,
    startColumn: 1
  });
  const destroyer2 = new Ship({
    shipTypeId: 4,
    orientation: 'horizontal',
    startRow: 4,
    startColumn: 3
  });
  const submarine1 = new Ship({
    shipTypeId: 5,
    orientation: 'horizontal',
    startRow: 2,
    startColumn: 3
  });
  const submarine2 = new Ship({
    shipTypeId: 5,
    orientation: 'horizontal',
    startRow: 8,
    startColumn: 1
  });
  return [
    aircraftCarrier,
    battleShip,
    cruiser,
    destroyer1,
    destroyer2,
    submarine1,
    submarine2
  ]
};

module.exports = Board;