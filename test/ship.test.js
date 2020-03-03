const expect = require('chai').expect;
const should = require('chai').should();
const Ship = require('../src/battleship/ship');
const constants = require('../src/battleship/constants');

const { maxRows, maxColumns, shipTypes, orientations, totalCount } = constants;

describe('Ship', function() {
  it('should contain construct a ship if the position is valid', function() {
    for (let shipTypeId of Object.keys(shipTypes)) {
      const { length } = shipTypes[shipTypeId];
      for (let orientation of Object.keys(orientations)) {
        const { rowFactor, columnFactor } = orientations[orientation];
        for (let startRow = 0; startRow < maxRows - rowFactor * length; startRow++) {
          for (let startColumn = 0; startColumn < maxColumns - columnFactor * length; startColumn++) {
            const ship = new Ship({shipTypeId, orientation, startRow, startColumn});
            expect(ship.length).to.equal(length)
          }
        }
      }
    }
  });
  it('should throw an error if the shipTypeId is invalid', function () {
    expect(() => {
      new Ship({shipTypeId: 0, orientation: 'horizontal', startRow: 0, startColumn: 0});
    }).to.throw;
  });
  it('should throw an error if the orientation is invalid', function () {
    expect(() => {
      new Ship({shipTypeId: 1, orientation: 'middle', startRow: 0, startColumn: 0});
    }).to.throw;
  });
  it('should throw an error if the position is invalid', function () {
    expect(() => {
      new Ship({shipTypeId: 1, orientation: 'middle', startRow: maxRows, startColumn: 0});
    }).to.throw;
    expect(() => {
      new Ship({shipTypeId: 1, orientation: 'middle', startRow: 0, startColumn: maxColumns});
    }).to.throw;
  });
});

