const Game = require('../src/battleship/game');
const fs = require('fs');
const path = require('path');

const indexFile = path.resolve(__dirname, '../docs', 'index.html');
const demoFile = path.resolve(__dirname, '../docs', 'demo.html');

const game = new Game();
const style = Game.getHtmlStyleType();
const html = game.play(false).join('');

function createDemo() {
  return new Promise(async(resolve, reject) => {
    fs.readFile(indexFile, (err, data) => {
      if (err) {
        throw err;
      }
      data = data.toString();
      data = data.replace('.github-markdown {display: block}', '.github-markdown {display: none}')
      data = data.replace('<div class="demo"></div>', `<div class="demo">${style}${html}</div>`);
      fs.writeFile(demoFile, data, err => {
        if (err) {
          throw err;
        }
        resolve();
      })
    })
  });
}

createDemo();

module.exports = createDemo;
