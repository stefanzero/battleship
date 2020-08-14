const expect = require('chai').expect;
const Game = require('../src/battleship/game');
const Board = require('../src/battleship/board');
const parameters = require('../src/battleship/parameters');
const {numRows, numColumns} = parameters;

/**
 * @test {Game}
 */
describe('Game constructor', function() {
  it('should create a new board and set it up', function() {
    const game = new Game();
    expect(game.board.isSetUp).to.be.true;
  })
});

/**
 * @test {Game}
 */
describe('Game.randomAvailablePosition', function() {
  it('should return a position that is not attacked', function() {
    const ships = Board.getSampleShipArray();
    const game = new Game({ships, toConsole: false});
    // attack all positions except 1, 9
    let row = 0;
    for (let column = 0; column < numColumns; column++) {
      game.board.attack({row, column});
    }
    row = 1;
    for (let column = 0; column < numColumns - 1; column++) {
      game.board.attack({row, column});
    }
    for (let row = 2; row < numRows; row++) {
      for (let column = 0; column < numColumns; column++) {
        game.board.attack({row, column});
      }
    }
    let column;
    ({row, column} = game.randomAvailablePosition());
    expect(row).to.equal(1);
    expect(column).to.equal(9);
  })
});

/**
 * @test {Game}
 */
describe('Game.availableNeighbors', function() {
  it('should return neighboring positions that have not been attacked', function() {
    const game = new Game();
    game.board.attack({row: 0, column: 1});
    const positions = game.availableNeighbors({row: 1, column: 1});
    expect(positions.findIndex(p => {
      return (p.row === 0 && p.column === 1)
    })).to.equal(-1);
    expect(positions.findIndex(p => {
      return (p.row === 1 && p.column === 0)
    })).to.not.equal(-1);
    expect(positions.findIndex(p => {
      return (p.row === 1 && p.column === 2)
    })).to.not.equal(-1);
    expect(positions.findIndex(p => {
      return (p.row === 2 && p.column === 1)
    })).to.not.equal(-1);
  })
});

/**
 * @test {Game}
 */
describe('Game.play', function() {
  it('should end in the game being won', function() {
    const game = new Game();
    game.play();
    expect(game.board.isWon()).to.be.true;
  })
});

