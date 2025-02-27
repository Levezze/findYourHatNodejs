import promptSync from 'prompt-sync';
import { Field } from './fieldClass.js';
const prompt = promptSync({ sigint: true });
let isFieldSolvable = false;
while (!isFieldSolvable) {
    const myField = new Field(15, 15, 0.5);
    isFieldSolvable = myField.testField();
    if (isFieldSolvable) {
        while (!myField.gameOver) {
            myField.print();
            const input = prompt("Enter a direction: l (left), r (right), d (down), or u (up): ")
                .toLowerCase();
            myField.moveInput(input);
            myField.movedFoundFell();
            if (myField.gameOver)
                break;
        }
    }
}
