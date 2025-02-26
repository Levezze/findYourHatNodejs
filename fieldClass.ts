import { shuffleArray, nestArrays } from './utils.js';

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
    // console.clear();
    for (let i=0; i < this.field.length; i++) {
      console.log(this.field[i].join(""));
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
    const testFieldArr = [...this.field];
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

    function moveResult(position: number[], field: string[][]): boolean | number {
      const horizontalPosition = position[0];
      const verticalPosition = position[1];
      const currentPosition = field[verticalPosition][horizontalPosition];
      switch (currentPosition) {
        case fieldCharacter:
          return 2;
        case hat:
          isFound = true;
          return 1;
        case hole:
          return false;
        case pathCharacter:
          if (isBacktracking) {
            return 3;
          } else {
            return false;
          }
        case backtrackCharacter:
          return false;
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
    const changeMoveDirection = (direction:string) => {
      switch (direction) {
        case (currentMoveDirection.forward):
          break;
        case 'r':
          currentMoveDirection = moveDirectionRight;
          break;
        case 'd':
          currentMoveDirection = moveDirectionDown;
          break;
        case 'l':
          currentMoveDirection = moveDirectionLeft;
          break;
        case 'u':
          currentMoveDirection = moveDirectionUp;
          break;
        default:
          break;
      };
    };

    const reverseMoveDirection = (direction:string) => {
      switch (direction) {
        case (currentMoveDirection.forward):
          break;
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
    const backtrackMoveDirectionPriority = ['right', 'left', 'forward'] as const;
    
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
        moveResultsArray.push(moveResult(testPosition, testFieldArr));
        moveDirectionsArray.push(moveDirection);
      }
      
      console.log(positionsArray);
      console.log(moveResultsArray);
      console.log(moveDirectionsArray);

      if (moveResultsArray.some(Boolean)) {
        let priorityMove: number | null = null;
        for (let i=0; i < moveResultsArray.length; i++) {
          if (typeof moveResultsArray[i] === 'number') {
            if (priorityMove === null) {
              priorityMove = i;
            } else if (moveResultsArray[i] as number < (moveResultsArray[priorityMove] as number)) {
              console.log('comparison 1: ', moveResultsArray[i] as number);
              console.log('comparison 2: ', moveResultsArray[priorityMove] as number);
              console.log('result: ', moveResultsArray[i] as number < (moveResultsArray[priorityMove] as number))
              priorityMove = i;
            }
            console.log(positionsArray[priorityMove as number]);
            console.log(moveDirectionsArray[priorityMove as number]);
          }
        }
        const newPosition = positionsArray[priorityMove as number];
        const newDirection = moveDirectionsArray[priorityMove as number];
        moveToTile(newPosition, testFieldArr);
        currentPosition = newPosition;
        changeMoveDirection(newDirection);
      } else {
        moveToTile(currentPosition, testFieldArr) // To make this tile "X"
        reverseMoveDirection(currentMoveDirection.forward);
        isBacktracking = true;
      }

      this.print();
      
      isStuck++;
      if (isStuck > this.width * this.height * 2) {
        console.log('stuck');
        isFailed = true;
      }

      if (isFailed) {
        console.log('Failed to reach hat.');
        break;
      };

      if (isFound) {
        console.log('Found hat!');
        break;
      };
    }

    if (isFailed) {
      return false;
    }
    
    if (isFound) {
      return true;
    }
  }
};