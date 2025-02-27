export function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
export function nestArrays(array, width) {
    let nestedArray = [];
    for (let i = width; i <= array.length; i += width) {
        if (i > 0) {
            let currentIndex = i - width;
            const slicedArray = array.slice(currentIndex, i);
            nestedArray.push(slicedArray);
        }
    }
    ;
    return nestedArray;
}
;
