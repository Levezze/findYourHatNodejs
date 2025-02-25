"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const fieldClass_1 = require("./fieldClass");
const prompt = (0, prompt_sync_1.default)({ sigint: true });
const myField = new fieldClass_1.Field(8, 5, 0.2);
myField.testField();
// while (!myField.gameOver) {
//   myField.print();
//   const input = prompt("Enter a direction: l (left), r (right), d (down), or u (up): ")
//     .toLowerCase();
//   myField.moveInput(input);
//   myField.movedFoundFell()
//   if (myField.gameOver) break;
// }
