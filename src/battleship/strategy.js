const constants = require('./constants');
const Board = require('./board');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes, totalCount } = constants;
const { isRowValid, isColumnValid, getRandomShipPosition } = utils;

class Strategy {

  constructor() {
    this.board = new Board();
    this.board.setUp();
  }

  static randomPosition() {
    const row = Math.floor(maxRows * Math.random())
    const column = Math.floor(maxColumns * Math.random())
    return { row, column };
  }

  nextAvailablePosition() {
    let { row, column } = Strategy.randomPosition();
    const { tiles } = this.board;
    while (tiles[row][column].attacked) {
      ({ row, column } = Strategy.randomPosition());
    }
    return { row, column };
  }

  availableNeighbors({row, column}) {
    const neighbors = [
      {row: row - 1, column},
      {row: row + 1, column},
      {row, column: column - 1},
      {row, column: column + 1}
    ];
    const { board } = this;
    const available = neighbors.reduce((acc, next) => {
      const { row, column } = next;
      if (isRowValid(row) && isColumnValid(column) && !board.isAttacked({ row, column })) {
        acc.push({ row, column })
      }
      return acc;
    }, []);
    return available;
  }

  play() {
    console.log('initial board')
    console.log(this.board.toString());
    let stack = [];
    let current;
    let numMoves = 0;
    let lastHit;
    while (!this.board.isWon()) {
      numMoves++;
      if (!stack.length) {
        console.log('Random attack');
        stack.push(this.nextAvailablePosition())
      }
      current = stack.pop();
      const {row, column} = current;
      if (!this.board.isAttacked({row, column})) {
        const attackResult = this.board.attack(current);
        console.log(`move: ${numMoves}  attack (${row}, ${column})`);
        console.log(attackResult.toUpperCase());
        console.log(this.board.toString());
        if (attackResult === 'Hit') {
          stack.push(...this.availableNeighbors(current));
          if (lastHit) {
            /*
             * remove items from the stack that are not in a line with the last hit
             * (this may not help if 2 different ships are contiguous on the board)
             */
            if (lastHit.row === row) {
              stack = stack.filter(item => item.row === row);
            } else {
              stack = stack.filter(item => item.column === column);
            }
          }
          lastHit = current;
        } else if (attackResult === 'Sunk') {
          /*
           * empty the stack if we just sunk a ship
           */
          stack = [];
          lastHit = null;
        }
      }
    }
    console.log(`Win in ${numMoves} moves`);
    /*
    moves.forEach(move => {
      console.log(move.row, move.column)
    })
     */
  }
}

module.exports = Strategy;

/*
strategy:


stack of tiles to pick next

list of tiles with hits

      n
     nxn
      n

if x is a hit, then put neighbors on stack
pop until stack is empty
attack if not was attacked
when stack is empty, push random pick on stack

 */

