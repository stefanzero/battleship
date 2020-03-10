const Game = require('../src/battleship/game');
const fs = require('fs');
const path = require('path');

const indexFile = path.resolve(__dirname, '../docs', 'index.html');
const demoFile = path.resolve(__dirname, '../docs', 'demo.html');

function createGameTable() {
  const style = `<style>
    td {
      padding: 1em;
      border: 1px solid #ddd;
    }
  </style>`
  const game = new Game();
  const moves = game.play();
  const rows = [];
  const head = '<th>Description</th><th>Game View</th><th>Player View</th>';
  for (let i = 0; i < moves.results.length; i++) {
    let desc;
    rows.push(`<tr>
      <td>${moves.descriptionHtml(i)}</td>
      <td>${moves.boardHtml[i].game}</td>
      <td>${moves.boardHtml[i].player}</td>
    </tr>`)
  }
  return `${style}
  <table>
    <thead>${head}</thead>
    <tbody>${rows.join('\n')}</tbody>
  </table>`
}


function createDemo() {
  const style = Game.getHtmlStyleType();
  const html = createGameTable();
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

// createDemo();

module.exports = createDemo;
