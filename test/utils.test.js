const expect = require('chai').expect;
const utils = require('../src/battleship/utils');
const parameters = require('../src/battleship/parameters');

const {numRows, numColumns, totalCount} = parameters;

const {
  isRowValid,
  isColumnValid,
  isValidShipPosition,
  getValidStartPosition,
  getRandomShipPosition
} = utils;

/**
 * @test {Utils}
 */
describe('Utils', function () {
  it('isRowValid should return true for valid rows', function () {
    expect(isRowValid(0)).to.be.true;
    expect(isRowValid(numRows - 1)).to.be.true;
  });
  it('isRowValid should return false for invalid rows', function () {
    expect(isRowValid(-1)).to.be.false;
    expect(isRowValid(numRows)).to.be.false;
  });
  it('isValidShipPosition should return true for valid ship positions', function() {
    expect(isValidShipPosition({
      shipTypeId: 1,
      orientation: 'horizontal',
      startRow: 0,
      startColumn: 0
    })).to.be.true;
    expect(isValidShipPosition({
      shipTypeId: 1,
      orientation: 'horizontal',
      startRow: 0,
      startColumn: 0
    })).to.be.true;
  });
});
