const constants = require('./constants');
const Tile = require('./tile');
const Ship = require('./ship');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes, totalCount } = constants;
const { isRowValid, isColumnValid, getRandomShipPosition } = utils;

class Board {
  constructor() {
    this.ships = [];
    this.shipTypeCount = {};
    this.tiles = new Array(maxRows)
      .fill(null)
      .map((r, i) => {
        return new Array(maxColumns)
          .fill(null)
          .map((c, j) => {
            return new Tile(i, j)
          })
    });
    this.isSetUp = false;
  }

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

  addShip(ship) {
    if (this.isSetUp) {
      Board.log && console.log('board already has correct number of ships');
      return;
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
    return true;
  }

  attack({row, column}) {
    if (!this.isSetUp) {
      throw new Error('Cannot attack until board is set up');
    }
    if (!isRowValid(row) || !isColumnValid(column)) {
      throw new Error('Board.attack invalid position: [${row}, ${column}]');
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
    return result;
  }

  isWon() {
    return (
      this.isSetUp &&
      this.ships.filter(s => s.sunk).length === totalCount
    )
  }

  isAttacked({row, column}) {
    return this.tiles[row][column].attacked;
  }

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
}

Board.log = false;

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