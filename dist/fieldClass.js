"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const utils_js_1 = require("./utils.js");
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
    static generateField(width, height, holesPercentage) {
        const fieldStringLength = (width * height) - 2;
        const holesNumber = Math.floor(fieldStringLength * holesPercentage);
        const fieldCharactersNumber = fieldStringLength - holesNumber;
        let fieldArray = [hat, pathCharacter]
            .concat(Array(holesNumber).fill(hole))
            .concat(Array(fieldCharactersNumber).fill(fieldCharacter));
        (0, utils_js_1.shuffleArray)(fieldArray);
        const nestedFieldArray = (0, utils_js_1.nestArrays)(fieldArray, width);
        let position = [0, 0];
        for (let i = 0; i < nestedFieldArray.length; i++) {
            const found = nestedFieldArray[i].findIndex((char) => char === pathCharacter);
            if (found !== -1) {
                position = [found, i];
                break;
            }
            ;
        }
        return [nestedFieldArray, position];
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
        const moveInputTest = (position, input) => {
            switch (input) {
                case "l":
                    if (position[0] !== 0)
                        return [position[0] -= 1, position[1]];
                    break;
                case "r":
                    if (position[0] !== this.width - 1)
                        position[0] += 1;
                    break;
                case "d":
                    if (position[1] !== this.height - 1)
                        position[1] += 1;
                    break;
                case "u":
                    if (position[1] !== 0)
                        position[1] -= 1;
                    break;
                default:
                    break;
            }
            ;
        };
        function moveResult(position, field) {
            const horizontalPosition = position[0];
            const verticalPosition = position[1];
            const currentPosition = field[verticalPosition][horizontalPosition];
            switch (currentPosition) {
                case fieldCharacter:
                    field[verticalPosition][horizontalPosition] = pathCharacter;
                    if (isBacktracking)
                        isBacktracking = false;
                    return true;
                case hat:
                    isFound = true;
                    return true;
                case hole:
                    return false;
                case pathCharacter:
                    if (isBacktracking) {
                        field[verticalPosition][horizontalPosition] = backtrackCharacter;
                        return true;
                    }
                    else {
                        return false;
                    }
                case backtrackCharacter:
                    return false;
                default:
                    return false;
            }
            ;
        }
        ;
        const moveDirectionRight = { forward: 'r', right: 'd', left: 'u', back: 'l' };
        const moveDirectionDown = { forward: 'd', right: 'l', left: 'r', back: 'u' };
        const moveDirectionLeft = { forward: 'l', right: 'u', left: 'd', back: 'r' };
        const moveDirectionUp = { forward: 'u', right: 'r', left: 'l', back: 'd' };
        let currentMoveDirection = moveDirectionRight;
        const changeMoveDirection = (direction) => {
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
            }
            ;
        };
        const movePriority = ['forward', 'right', 'left'];
        const backtrackMovePriority = ['left', 'right', 'forward'];
        let moveArr;
        let isBacktracking = false; // When there's nowhere to continue
        let isFailed = false;
        let isFound = false;
        const originalPosition = [...this.position];
        let steps = 0;
        let currentPosition = originalPosition;
        while (!isFailed && !isFound) {
            let move;
            moveArr = !isBacktracking ? movePriority : backtrackMovePriority;
            // Test if pointer can move to another tile
            let isStuck = 0;
            for (let i = 0; i < moveArr.length; i++) {
                move = currentMoveDirection[moveArr[i]];
                let testPosition = [...currentPosition];
                moveInputTest(testPosition, move);
                isStuck++;
                if (moveResult(testPosition, testFieldArr)) {
                    currentPosition = testPosition;
                    changeMoveDirection(move);
                    this.print();
                    console.log(move);
                    console.log(currentPosition);
                    if (!isBacktracking) {
                        steps++;
                    }
                    else {
                        steps--;
                        if (steps < -1) {
                            isFailed = true;
                            break;
                        }
                    }
                    break;
                }
                else {
                    isBacktracking = true;
                }
                if (isStuck > 3) {
                    isFailed = true;
                    console.log('Got stuck!');
                    break;
                }
                ;
            }
            ;
            if (isFailed) {
                console.log('Failed to reach hat.');
                continue;
            }
            ;
            if (isFound) {
                console.log('Found hat!');
                break;
            }
            ;
        }
        if (isFailed) {
            return false;
        }
        if (isFound) {
            return true;
        }
    }
}
exports.Field = Field;
;
