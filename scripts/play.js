const readline = require('readline');
const Board = require('../src/battleship/board');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getAnswer (prompt) {
  const answer = await new Promise((resolve, reject) =>{
    rl.question(`${prompt}\n`, (answer) => {
      resolve(answer)
    });
  });
  return answer
}

let done = false;
let move = 1;
let playerView = true;
// playerView = false;
const board = new Board(true, playerView);

const playGame = async () => {
  let prompt = 'Enter 2 numbers (row and column) separated by a space (or q to quit):';
  while (!done) {
    const answer = await getAnswer(prompt);
    prompt = processAnswer(answer);
  }
  rl.close()
};

const processAnswer = (answer) => {
  // this will be set depending on the answer
  let prompt = 'Enter 2 numbers (row and column) separated by a space (or q to quit):';
  // if answer === 'q', then quit
  if (answer === 'q') {
    console.log('User entered q to quit')
    done = true;
    return;
  }
  // parse answer
  const matches = answer.match(/^\s*(\d+)\s+(\d+)/);
  // if answer is invalid, return new prompt to reenter
  if (!matches || matches.length !== 3) {
    return prompt;
  }
  // if answer is valid, process next move
  const row = parseInt(matches[1]);
  const column = parseInt(matches[2]);
  if (isNaN(row) || isNaN(column)) {
    return prompt;
  }
  let result;
  try {
    result = board.attack({row, column});
  } catch (ex) {
    /*
     * Special prompt when row or column were invalid.
     */
    prompt = 'Enter valid position (2 numbers) or q to quit:';
    return prompt;
  }
  if (result === 'Win') {
    done = true;
  }
  // create next prompt
  move += 1;
  return prompt
};

let ships = [];
// console.log(process.argv)
if (process && process.argv && process.argv.length > 2 && process.argv[2] === 'sample') {
  ships = Board.getSampleShipArray();
}
board.setUp(ships);
playGame();

