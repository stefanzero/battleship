const expect = require('chai').expect;
const should = require('chai').should();
const Tile = require('../src/battleship/tile');
const Board = require('../src/battleship/board');

describe('Tile', function() {
  it('should create valid tiles when rows and columns are in range', function() {
    for (let i = 0; i < Board.numRows; i++) {
      for (let j = 0; j < Board.numColumns; j++) {
        const tile = new Tile(i, j)
        expect(tile.row).to.equal(i);
        expect(tile.column).to.equal(j);
      }
    }
  });

  it('should throw if the row or column is out of range', function () {
    expect(() => {
      new Tile(-1, 1)
    }).to.throw;
    expect(() => {
      new Tile(1, -1)
    }).to.throw;
    expect(() => {
      new Tile(1, Board.numRows)
    }).to.throw;
    expect(() => {
      new Tile(-1, Board.numColumns)
    }).to.throw;
  })
});