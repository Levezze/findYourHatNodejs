const { shuffleArray, nestArrays } = require('./utils.js');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(width=3, height=3, holesPercentage=0.25) {
    this.holesPercentage = holesPercentage;
    this.width = width;
    this.height = height;
    this.gameOver = false;
    this.position = [0,0];
    this.field = Field.generateField(width, height, holesPercentage);
  }

  static generateField(width=this.width, height=this.height, holesPercentage=this.holesPercentage) {
    const fieldStringLength = (width * height) - 2;
    const holesNumber = Math.floor(fieldStringLength * holesPercentage);
    const fieldCharactersNumber = fieldStringLength - holesNumber;

    let fieldArray = [hat]
      .concat(Array(holesNumber).fill(hole))
      .concat(Array(fieldCharactersNumber).fill(fieldCharacter));

    shuffleArray(fieldArray)
    fieldArray.unshift(pathCharacter);
    fieldArray = nestArrays(fieldArray, width);
    return fieldArray
  }

  setRandomField(width, height, holesPercentage) {
    this.field = this.generateField(width, height, holesPercentage);
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
      case "u":
      case "up":
        if (this.position[1] !== 0) this.position[1] -= 1;
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
        console.log("Congratulations! You found your hat! :)")
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
};

module.exports = { Field };