"use strict";
const { shuffleArray, nestArrays } = require('./utils.js');
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
class Field {
    constructor(width = 3, height = 3, holesPercentage = 0.25) {
        this.holesPercentage = holesPercentage;
        this.width = width;
        this.height = height;
        this.gameOver = false;
        [this.field, this.position] = Field.generateField(width, height, holesPercentage);
    }
    static generateField(width = this.width, height = this.height, holesPercentage = this.holesPercentage) {
        const fieldStringLength = (width * height) - 2;
        const holesNumber = Math.floor(fieldStringLength * holesPercentage);
        const fieldCharactersNumber = fieldStringLength - holesNumber;
        let fieldArray = [hat, pathCharacter]
            .concat(Array(holesNumber).fill(hole))
            .concat(Array(fieldCharactersNumber).fill(fieldCharacter));
        shuffleArray(fieldArray);
        fieldArray = nestArrays(fieldArray, width);
        let position = [0, 0];
        for (let i = 0; i < fieldArray.length; i++) {
            const found = fieldArray[i].findIndex((char) => char === pathCharacter);
            if (found !== -1) {
                position = [found, i];
                break;
            }
            ;
        }
        return [fieldArray, position];
    }
    print() {
        console.clear();
        for (let i = 0; i < this.field.length; i++) {
            console.log(this.field[i].join(""));
        }
    }
    moveInput(input) {
        switch (input) {
            case "l":
            case "left":
                if (this.position[0] !== 0)
                    this.position[0] -= 1;
                break;
            case "r":
            case "right":
                if (this.position[0] !== this.width - 1)
                    this.position[0] += 1;
                break;
            case "d":
            case "down":
                if (this.position[1] !== this.height - 1)
                    this.position[1] += 1;
                break;
            case "u":
            case "up":
                if (this.position[1] !== 0)
                    this.position[1] -= 1;
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
                console.log("Congratulations! You found your hat! :)");
                this.gameOver = true;
                break;
            case hole:
                console.log("Oops! You fell into a hole! :( Try again!");
                this.gameOver = true;
                break;
            case pathCharacter:
                break;
            default:
                console.log("Oops! You moved out of bounds :( Try again!");
                this.gameOver = true;
                break;
        }
    }
    testField() {
        const testFieldArr = [...this.field];
        const backtrackCharacter = 'x';
        const moveDirectionRight = { forward: 'r', right: 'd', left: 'u' };
        const moveDirectionDown = { forward: 'd', right: 'l', left: 'r' };
        const moveDirectionLeft = { forward: 'l', right: 'u', left: 'd' };
        const moveDirectionUp = { forward: 'u', right: 'r', left: 'l' };
        let currentMoveDirection = moveDirectionRight;
        const changeMoveDirection = (direction) => {
            switch (direction) {
                case (direction === currentMoveDirection.forward):
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
            }
            ;
        };
        movePriority = ['forward', 'right', 'left'];
        backtrackMovePriority = ['right', 'left', 'forward'];
        let moveArr;
        if (!backtracking)
            moveArr = movePriority;
        else
            moveArr = backMovePriority;
        let backtracking = false; // When there's nowhere to continue
        let steps = 0;
        let failed = false;
        while (!failed) {
            let move;
            if ()
                this.currentPosition;
        }
    }
}
;
module.exports = { Field };
