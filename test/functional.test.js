const chalk = require('chalk');
const Game = require('../src/battleship/game');
const constants = require('../src/battleship/constants');

const { maxColumns } = constants;
const numGames = 10;
const fontColor = 'white';
const bgColor = 'bgBlack';
const bannerFontColor = 'black';
const bannerBgColor = 'bgWhite';
const dash = '-';
const pipe = '|';
const space = ' ';
const width = maxColumns * 3;

const square = chalk`{${fontColor}.${bgColor} ${dash}}`;
const edge = chalk`{${fontColor}.${bgColor} ${pipe}}`;
const blank = chalk`{${bannerFontColor}.${bannerBgColor} ${space}}`;
const border = square.repeat(width);

function getGameBorder(gameNumber) {
  const heading = `Game #${gameNumber}`;
  const banner = chalk`{${bannerFontColor}.${bannerBgColor} ${heading}}`;
  const leadingSpace = Math.floor((width - heading.length - 2) / 2);
  const trailingSpace = width - heading.length - leadingSpace - 2;
  return '\n' + border + '\n' +
    edge +
    blank.repeat(leadingSpace) +
    banner +
    blank.repeat(trailingSpace) +
    edge + '\n' +
    border;
}

for (let i = 0; i < numGames; i++) {
  console.log(`${getGameBorder(i + 1)}\n`);
  const game = new Game();
  game.play();
}
