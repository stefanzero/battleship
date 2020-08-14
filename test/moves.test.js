const expect = require('chai').expect;
const Board = require('../src/battleship/board');
const Moves = require('../src/battleship/moves');

/**
 * @test {Moves}
 */
describe('Moves constructor', function() {
  it('should throw if {board} is not an instance of Board', function() {
    expect(() => new Moves()).to.throw;
  })
});

/**
 * @test {Moves}
 */
describe('Moves.addMove', function() {
  it('should add a value to the moves array', function() {
    const board = new Board();
    const moves = new Moves({board});
    moves.addMove({row: 1, column: 1});
    expect(moves.moves.findIndex(m => {
      return ((m.row === 1) & (m.column === 1))
    })).to.equal(0);
  })
});

