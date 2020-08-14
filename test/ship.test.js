const expect = require('chai').expect;
const Ship = require('../src/battleship/ship');
const parameters = require('../src/battleship/parameters');

const { numRows, numColumns, shipTypes, orientations, totalCount } = parameters;

/**
 * @test {Ship}
 */
describe('Ship Constructor', function() {
  it('should contain construct a ship if the position is valid', function() {
    for (let shipTypeId of Object.keys(shipTypes)) {
      const { length } = shipTypes[shipTypeId];
      for (let orientation of Object.keys(orientations)) {
        const { rowFactor, columnFactor } = orientations[orientation];
        for (let startRow = 0; startRow < numRows - rowFactor * length; startRow++) {
          for (let startColumn = 0; startColumn < numColumns - columnFactor * length; startColumn++) {
            const ship = new Ship({shipTypeId, orientation, startRow, startColumn});
            expect(ship.length).to.equal(length)
          }
        }
      }
    }
  });
  it('should contain the correct shipType', function() {
    const ship = new Ship({
      shipTypeId: 1,
      orientation: 'horizontal',
      startRow: 0,
      startColumn: 0
    });
    expect(ship.shipType).to.eql(shipTypes[1]);
  });
  it('should contain a hit array of false values', function() {
    const shipTypeId = 2;
    const ship = new Ship({
      shipTypeId,
      orientation: 'horizontal',
      startRow: 0,
      startColumn: 0
    });
    const length = shipTypes[shipTypeId].length;
    expect(ship.hits.length).to.equal(length);
    for (let i = 0; i < length; i++){
      expect(ship.hits[i]).to.be.false;
    }
  });
  it('should throw an error if the shipTypeId is invalid', function() {
    expect(() => {
      new Ship({shipTypeId: 0, orientation: 'horizontal', startRow: 0, startColumn: 0});
    }).to.throw;
  });
  it('should throw an error if the orientation is invalid', function() {
    expect(() => {
      new Ship({shipTypeId: 1, orientation: 'middle', startRow: 0, startColumn: 0});
    }).to.throw;
  });
  it('should throw an error if the position is invalid', function() {
    expect(() => {
      new Ship({shipTypeId: 1, orientation: 'middle', startRow: numRows, startColumn: 0});
    }).to.throw;
    expect(() => {
      new Ship({shipTypeId: 1, orientation: 'middle', startRow: 0, startColumn: numColumns});
    }).to.throw;
  });
});

/**
 * @test {Ship}
 */
describe('Ship.hit', function() {
  it('should set the proper hit index', function() {
    const ship = new Ship({
      shipTypeId: 3,
      orientation: 'horizontal',
      startRow: 0,
      startColumn: 0
    });
    ship.hit({row: 0, column: 0});
    expect(ship.hits[0]).to.be.true;
    ship.hit({row: 0, column: 1});
    expect(ship.hits[1]).to.be.true;
    ship.hit({row: 0, column: 2});
    expect(ship.hits[2]).to.be.true;
  });
});