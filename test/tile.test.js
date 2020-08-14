const expect = require('chai').expect;
const Tile = require('../src/battleship/tile');
const Board = require('../src/battleship/board');

/**
 * @test {Tile}
 */
describe('Tile Constructor', function() {
  it('should create valid tiles when rows and columns are in range', function() {
    for (let i = 0; i < Board.numRows; i++) {
      for (let j = 0; j < Board.numColumns; j++) {
        const tile = new Tile(i, j)
        expect(tile.row).to.equal(i);
        expect(tile.column).to.equal(j);
      }
    }
  });

  it('should throw if the row or column is out of range', function() {
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
  });
});

/**
 * @test {Tile}
 */
describe('Tile.toString', function() {
  it('should return an "o" if the tile is not attacked', function() {
    const tile = new Tile(0, 0);
    expect(/ o /.test(tile.toString())).to.be.true;
  });
  it('should return an "x" if the tile is attacked', function() {
    const tile = new Tile(0, 0);
    tile.attacked = true;
    expect(/ x /.test(tile.toString())).to.be.true;
  });
});

/**
 * @test {Tile}
 */
describe('Tile.toHtml', function() {
  it('should return a span with an "o" if the tile is not attacked', function() {
    const tile = new Tile(0, 0);
    expect(/<span .*?>o<\/span>/.test(tile.toHtml())).to.be.true;
  });
  it('should return a span with an "x" if the tile is attacked', function() {
    const tile = new Tile(0, 0);
    tile.attacked = true;
    expect(/<span .*?>x<\/span>/.test(tile.toHtml())).to.be.true;
  });
});

