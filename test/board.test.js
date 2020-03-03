const expect = require('chai').expect;
const should = require('chai').should();
const Tile = require('../src/battleship/tile');
const Board = require('../src/battleship/board');
const Ship = require('../src/battleship/ship');
const constants = require('../src/battleship/constants');

const { maxRows, maxColumns, shipTypes, orientations, totalCount } = constants;

describe('Board', function() {
  it('should contain a matrix of tiles', function() {
    const board = new Board();
    for (let i = 0; i < maxRows; i++) {
      for (let j = 0; j < maxColumns; j++) {
        const tile = board.tiles[i][j];
        expect(tile).to.be.an.instanceof(Tile);
      }
    }
  });

  it('Board.setup should add ships at random positions if setup is called with no parameters',
    function(){
      const board = new Board();
      board.setUp();
      expect(board.isSetUp).to.be.true;
      expect(board.ships.length).to.equal(totalCount);
    }
  );
});

describe('Board.addShip', function() {
  it('should be able to add a ship to the board if the position is valid', function() {
    for (let shipTypeId of Object.keys(shipTypes)) {
      const { length } = shipTypes[shipTypeId];
      for (let orientation of Object.keys(orientations)) {
        const { rowFactor, columnFactor } = orientations[orientation];
        for (let startRow = 0; startRow < maxRows - rowFactor * length; startRow++) {
          for (let startColumn = 0; startColumn < maxColumns - columnFactor * length; startColumn++) {
            const board = new Board();
            const ship = new Ship({shipTypeId, orientation, startRow, startColumn});
            expect(board.addShip(ship)).to.be.true;
          }
        }
      }
    }
  });

  it('should mark the appropriate tiles after a ship is added', function() {
    const board = new Board();
    const aircraftCarrier = new Ship({
      shipTypeId: 1,
      orientation: 'horizontal',
      startRow: 3,
      startColumn : 3
    });
    board.addShip(aircraftCarrier);
    const tiles = board.tiles[3].slice(3, 5);
    tiles.forEach(tile => {
      expect(tile.ship).to.equal(aircraftCarrier);
    })
  });

  it('should return false if adding a ship will overlap an existing ship', function() {
    const board = new Board();
    const aircraftCarrier = new Ship({
      shipTypeId: 1,
      orientation: 'horizontal',
      startRow: 3,
      startColumn : 3
    });
    const battleship = new Ship({
      shipTypeId: 2,
      orientation: 'vertical',
      startRow: 0,
      startColumn: 5
    });
    board.addShip(aircraftCarrier);
    expect(board.addShip(battleship)).to.be.false;
  });

  it('should increment the appropriate shipTypeCount', function() {
    const ships = Board.getSampleShipArray();
    const board = new Board();
    board.setUp(ships);
    expect(board.shipTypeCount).to.eql({
      1: 1,
      2: 1,
      3: 1,
      4: 2,
      5: 2
    })
  });

  it('should return false if the shipTypeCount is exceeded', function() {
    const aircraftCarrier1 = new Ship({
      shipTypeId: 1,
      orientation: 'horizontal',
      startRow: 3,
      startColumn: 3
    });
    const aircraftCarrier2 = new Ship({
      shipTypeId: 1,
      orientation: 'vertical',
      startRow: 1,
      startColumn: 8
    });
    const board = new Board();
    board.addShip(aircraftCarrier1);
    expect(board.addShip(aircraftCarrier2)).to.be.false;
  });

});

describe('Board.attack', function() {
  it('should correctly register a hit', function() {
    const aircraftCarrier = new Ship({
      shipTypeId: 1,
      orientation: 'horizontal',
      startRow: 3,
      startColumn: 3
    });
    const battleship = new Ship({
      shipTypeId: 2,
      orientation: 'vertical',
      startRow: 1,
      startColumn: 8
    });
    const board = new Board();
    board.addShip(aircraftCarrier);
    board.addShip(battleship);
    board.setUp();
    expect(board.attack({row: 3, column: 3})).to.equal('Hit');
  });
  // it('should correctly register a hit', function() {
  //   const aircraftCarrier = new Ship({
  //     shipTypeId: 1,
  //     orientation: 'horizontal',
  //     startRow: 3,
  //     startColumn: 3
  //   });
  //   const battleship = new Ship({
  //     shipTypeId: 2,
  //     orientation: 'vertical',
  //     startRow: 1,
  //     startColumn: 8
  //   });
  //   const board = new Board();
  //   board.addShip(aircraftCarrier);
  //   board.addShip(battleship);
  //   expect(board.attack({row: 3, column: 3})).to.equal('Hit');
  // })
});

describe('Board.getSampleShipArray', function() {
  it('should return an array of length = totalCount', function() {
    const ships = Board.getSampleShipArray();
    expect(ships.length).to.equal(totalCount);
  });
});

