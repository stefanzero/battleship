const Game = require('../src/battleship/game');

const numGames = 1;
const toConsole = true;

for (let i = 0; i < numGames; i++) {
  console.log(`${Game.gameBanner(i + 1)}\n`);
  const game = new Game({toConsole});
  game.play();
}
