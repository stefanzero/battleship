const constants = require('./constants');
const Board = require('./board');
const utils = require('./utils');

const { maxRows, maxColumns, shipTypes, totalCount } = constants;
const { isRowValid, isColumnValid, getRandomShipPosition } = utils;

class Game {

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
    let { row, column } = Game.randomPosition();
    const { tiles } = this.board;
    while (tiles[row][column].attacked) {
      ({ row, column } = Game.randomPosition());
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
    if (Game.logStack) {
      const s = available.map(a => `(${a.row}, ${a.column})`).join(', ');
      console.log(`availableNeighbors(${row}, ${column}): ${s}`);
    }
    return available;
  }

  play() {
    console.log('initial board')
    console.log(this.board.toString());
    let stack = [];
    let lastStack = null;
    let current;
    let numMoves = 0;
    let lastHit;
    while (!this.board.isWon()) {
      if (!stack.length) {
        if (lastStack && lastStack.length) {
          stack = lastStack;
        } else {
          console.log('Random attack');
          stack.push(this.nextAvailablePosition())
        }
      }
      if (Game.logStack) {
        const s = stack.map(a => `(${a.row}, ${a.column})`).join(', ');
        console.log(`stack: ${s}`);
      }
      current = stack.pop();
      const {row, column} = current;
      if (!this.board.isAttacked({row, column})) {
        numMoves++;
        const attackResult = this.board.attack(current);
        console.log(`move: ${numMoves}  attack (${row}, ${column})`);
        console.log(attackResult.toUpperCase());
        console.log(this.board.toString());
        if (attackResult === 'Hit') {
          stack.push(...this.availableNeighbors(current));
          if (lastHit) {
            /*
             * remove items from the stack that are not in a line with the last hit
             * save the stack in case the filter does not end up in a ship being sunk
             */
            lastStack = stack;
            if (lastHit.row === row) {
              stack = stack.filter(item => item.row === row);
            } else {
              stack = stack.filter(item => item.column === column);
            }
          }
          if (Game.logStack) {
            const s = stack.map(a => `(${a.row}, ${a.column})`).join(', ');
            console.log(`filtered stack: ${s}`);
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
  }
}

Game.logStack = false;

module.exports = Game;

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

