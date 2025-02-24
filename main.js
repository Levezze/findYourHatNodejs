const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field, width=3, height=3) {
    this.field = field;
    this.width = width;
    this.height = height;
    this.gameOver = false;
    this.position = [0,0];
  }
  
  print() {
    console.clear();
    for (let i=0; i < this.field.length; i++) {
      console.log(this.field[i].join(""));
    }
  }

  moveInput(input) {
    switch (input) {
      case "l":
      case "left":
        if (this.position[0] !== 0) this.position[0] -= 1;
        break;
      case "r":
      case "right":
        if (this.position[0] !== this.width - 1) this.position[0] += 1;
        break;
      case "d":
      case "down":
        if (this.position[1] !== this.height - 1) this.position[1] += 1;
        break;
      default:
        console.log("Invalid input");
        break;
    }
  }

  movedFoundFell() {
    const horizontalPosition = this.position[0];
    const verticalPosition = this.position[1];
    const currentPosition = this.field[verticalPosition][horizontalPosition];
    switch (currentPosition) {
      case fieldCharacter:
        this.field[verticalPosition][horizontalPosition] = pathCharacter;
        break;
      case hat:
        console.log("Congradulations! You found the hat! :)")
        this.gameOver = true;
        break;
      case hole:
        console.log("Oops! You fell into a hole! :( Try again!")
        this.gameOver = true;
        break;
      default:
        console.log("Oops! You moved out of bounds :( Try again!")
        this.gameOver = true;
        break;
    }
  }
}


const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

// console.log(myField.field[myField.position[1]][myField.position[0]]);
while (!myField.gameOver) {
  myField.print();
  const input = prompt("Enter a direction: l (left), r (right), d (down): ")
    .toLowerCase();
  myField.moveInput(input);
  myField.movedFoundFell()
  if (myField.gameOver) break;
}

