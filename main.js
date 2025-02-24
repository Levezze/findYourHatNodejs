const prompt = require('prompt-sync')({sigint: true});
const { Field } = require('./fieldClass');

const myField = new Field(8, 5, 0.2);

while (!myField.gameOver) {
  myField.print();
  const input = prompt("Enter a direction: l (left), r (right), d (down), or u (up): ")
    .toLowerCase();
  myField.moveInput(input);
  myField.movedFoundFell()
  if (myField.gameOver) break;
}
