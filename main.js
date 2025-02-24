const prompt = require('prompt-sync')({sigint: true});
const { shuffleArray, nestArrays } = require('./utils.js');
const { Field } = require('./fieldClass');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const myField = new Field(5, 5, 0.3);


while (!myField.gameOver) {
  myField.print();
  const input = prompt("Enter a direction: l (left), r (right), d (down), or u (up): ")
    .toLowerCase();
  myField.moveInput(input);
  myField.movedFoundFell()
  if (myField.gameOver) break;
}

