/**
 * @type {Game}
 */
const Game = require('../src/battleship/game');
/**
 * @type {number}
 */
const numGames = 1;
/**
 * @type {boolean}
 */
const toConsole = true;

for (let i = 0; i < numGames; i++) {
  console.log(`${Game.gameBanner(i + 1)}\n`);
  const game = new Game({toConsole});
  game.play();
}
