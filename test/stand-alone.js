/*
const Board = require('../src/battleship/board');
const board = new Board();
board.setUp();
console.log(board.isSetUp);
 */

/*
const Ship = require('../src/battleship/ship');
const ships = Ship.getSampleShipArray();
console.log(ships.length);
 */

/*
const Board = require('../src/battleship/board');
const Ship = require('../src/battleship/ship');
const ships = Ship.getSampleShipArray();
const board = new Board();
board.setUp(ships);
console.log(board.ships.length);
 */

/*
const Board = require('../src/battleship/board');
const Ship = require('../src/battleship/ship');
const ships = Board.getSampleShipArray();
const board = new Board();
board.setUp(ships);
board.attack({row: 1, column: 9});
console.log(ships[0].hits);
 */

const Board = require('../src/battleship/board');
const Ship = require('../src/battleship/ship');
const ships = Board.getSampleShipArray();
const board = new Board();
board.setUp(ships);
console.log(board.toString());

board.attack({row: 0, column: 0});
board.attack({row: 1, column: 1});
board.attack({row: 2, column: 1});
board.attack({row: 4, column: 3});
console.log(board.toString(true));

/*
const Tile = require('../src/battleship/tile');
const tile = new Tile();
const s = tile.toString();
const ss = [s,s]
// console.log(s.concat(s));
console.log(ss);
 */
