import { shuffleArray, nestArrays } from './utils.js';
import chalk from 'chalk';

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

export class Field {
  holesPercentage: number;
  width: number;
  height: number;
  gameOver: boolean;
  field: string[][];
  position: number[];
  constructor(width=3, height=3, holesPercentage=0.25) {
    this.holesPercentage = holesPercentage;
    this.width = width;
    this.height = height;
    this.gameOver = false;
    [this.field, this.position] = Field.generateField(width, height, holesPercentage);
  }

  static generateField(
    width:number, 
    height:number, 
    holesPercentage:number
  ):[string[][],number[]] {
    const fieldStringLength = (width * height) - 2;
    const holesNumber = Math.floor(fieldStringLength * holesPercentage);
    const fieldCharactersNumber = fieldStringLength - holesNumber;

    let fieldArray = [hat, pathCharacter]
      .concat(Array(holesNumber).fill(hole))
      .concat(Array(fieldCharactersNumber).fill(fieldCharacter));

    shuffleArray(fieldArray)
    const nestedFieldArray = nestArrays(fieldArray, width);
    let position = [0,0];
    for (let i=0; i < nestedFieldArray.length; i++) {
      const found = nestedFieldArray[i].findIndex((char) => char === pathCharacter);
      if (found !== -1) {
        position = [found, i];
        break;
      };
    }
    return [nestedFieldArray, position];
  }
  
  print() {
    console.clear();
    for (let i=0; i < this.field.length; i++) {
      let rowString: string = "";
      for (let j=0; j < this.field[i].length; j++) {
        if (this.position[0] === j && this.position[1] === i) {
          rowString += chalk.red(pathCharacter);
        } else {
          switch(this.field[i][j]) {
            case fieldCharacter:
              rowString += chalk.gray(fieldCharacter);
              break;
            case hat:
              rowString += chalk.yellow(hat);
              break;
            case hole:
              rowString += chalk.magenta(hole);
              break;
            case pathCharacter:
              rowString += chalk.white(pathCharacter);
              break;
            default:
              rowString += this.field[i][j];
              break;
          }
        }
      }
      console.log(rowString);
    }
  }

  moveInput(input:string) {
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
      case pathCharacter:
        break;
      default:
        console.log("Oops! You moved out of bounds :( Try again!")
        this.gameOver = true;
        break;
    }
  }

  testField() {
    const testFieldArr = this.field.map(row => [...row]);
    const backtrackCharacter = 'X';

    const moveInputTest = (position:number[], input:string): void => {
      switch (input) {
        case "l":
          if (position[0] !== 0) position[0] -= 1;
          break;
        case "r":
          if (position[0] !== this.width - 1) position[0] += 1;
          break;
        case "d":
          if (position[1] !== this.height - 1) position[1] += 1;
          break;
        case "u":
          if (position[1] !== 0) position[1] -= 1;
          break;
        default:
          break;
      };
    };

    function moveResult(position: number[], field: string[][], backtracking: boolean): boolean | number {
      const horizontalPosition = position[0];
      const verticalPosition = position[1];
      const currentPosition = field[verticalPosition][horizontalPosition];
      switch (currentPosition) {
        case fieldCharacter:
          backtracking = false;
          return 2;
        case hat:
          isFound = true;
          return 1;
        case hole:
          return false;
        case pathCharacter:
          if (backtracking) {
            return 3;
          } else {
            return false;
          }
        case backtrackCharacter:
          if (backtracking) {
            return 4;
          } else {
            return false;
          }
        default:
          return false;
      };
    };

    function moveToTile(position: number[], field: string[][]): void {
      const horizontalPosition = position[0];
      const verticalPosition = position[1];
      const currentPosition = field[verticalPosition][horizontalPosition];
      switch (currentPosition) {
        case fieldCharacter:
          field[verticalPosition][horizontalPosition] = pathCharacter;
          break;
        case pathCharacter:
          field[verticalPosition][horizontalPosition] = backtrackCharacter;
          break;
      }
    }

    const moveDirectionRight = {forward: 'r', right: 'd', left: 'u', back: 'l'};
    const moveDirectionDown = {forward: 'd', right: 'l', left: 'r', back: 'u'};
    const moveDirectionLeft = {forward: 'l', right: 'u', left: 'd', back: 'r'};
    const moveDirectionUp = {forward: 'u', right: 'r', left: 'l', back: 'd'};

    let currentMoveDirection = moveDirectionRight;
    type moveDirectionType = typeof currentMoveDirection;
    const changeMoveDirection = (currentDirection:moveDirectionType, direction:string) => {
      switch (direction) {
        case (currentDirection.forward):
          break;
        case 'r':
          currentDirection = moveDirectionRight;
          break;
        case 'd':
          currentDirection = moveDirectionDown;
          break;
        case 'l':
          currentDirection = moveDirectionLeft;
          break;
        case 'u':
          currentDirection = moveDirectionUp;
          break;
        default:
          break;
      };
    };

    const reverseMoveDirection = (direction:string) => {
      switch (direction) {
        case 'r':
          currentMoveDirection = moveDirectionLeft;
          break;
        case 'd':
          currentMoveDirection = moveDirectionUp;
          break;
        case 'l':
          currentMoveDirection = moveDirectionRight;
          break;
        case 'u':
          currentMoveDirection = moveDirectionDown;
          break;
        default:
          break;
      };
    };

    type MoveKey = 'forward' | 'right' | 'left';
    const moveDirectionPriority = ['forward', 'right', 'left'] as const;
    const backtrackMoveDirectionPriority = ['left', 'right', 'forward'] as const;
    
    let moveDirectionKeys:readonly MoveKey[];
    
    let isBacktracking = false; // When there's nowhere to continue

    let isFailed = false;
    let isFound = false;
    const originalPosition = [...this.position];
    let currentPosition = originalPosition;
    let isStuck = 0;
    while (!isFailed && !isFound) {
      let moveDirection:string;
      moveDirectionKeys = !isBacktracking ? moveDirectionPriority: backtrackMoveDirectionPriority;
      
      // Test Arrays
      const positionsArray: number[][] = [];
      const moveResultsArray: (boolean | number)[] = [];
      const moveDirectionsArray: string[] = [];

      // Test if pointer can move to another tile
      for (let i=0; i < moveDirectionKeys.length; i++) {
        moveDirection = currentMoveDirection[moveDirectionKeys[i]];
        let testPosition = [...currentPosition];
        moveInputTest(testPosition, moveDirection);
        positionsArray.push(testPosition);
        moveResultsArray.push(moveResult(testPosition, testFieldArr, isBacktracking));
        moveDirectionsArray.push(moveDirection);
      }
      
      if (moveResultsArray.some(Boolean)) {
        let priorityMove: number | null = null;
        for (let i=0; i < moveResultsArray.length; i++) {
          if (typeof moveResultsArray[i] === 'number') {
            if (priorityMove === null) {
              priorityMove = i;
            } else if (moveResultsArray[i] as number < (moveResultsArray[priorityMove] as number)) {
              priorityMove = i;
            }
          }
        };

        const newPosition = positionsArray[priorityMove as number];
        const newDirection = moveDirectionsArray[priorityMove as number];
        moveToTile(newPosition, testFieldArr);
        currentPosition = newPosition;
        changeMoveDirection(currentMoveDirection, newDirection);
      } else {
        moveToTile(currentPosition, testFieldArr) // To make this tile "X"
        reverseMoveDirection(currentMoveDirection.forward);
        isBacktracking = true;
      };

      // this.print();
      
      isStuck++;
      if (isStuck > this.width * this.height * 2) {
        console.log('stuck');
        isFailed = true;
      };

      if (isFailed) {
        console.log('Failed to reach hat.');
        break;
      };

      if (isFound) {
        console.log('Found hat!');
        break;
      };
    };

    if (isFailed) {
      return false;
    };
    
    if (isFound) {
      return true;
    };
  };
};
