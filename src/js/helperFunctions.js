

/**
 * Pipes an input through a series of functions. Make
 * sure that types and expected arguments match to the
 * return values of preceding functions.
 *
 * @param {functions} funcs - A list of functions to be applied to the
 *                            input
 * @return {*} 
 */
const pipe = (...funcs) => {
    return (value) => {
      return funcs.reduce((res, fn) => fn(res), value);
    };
  };


/**
 * Takes an array of values and shufles the entries
 * to get a random sort
 *
 * @param {array} arrayToShuffle - The array you would like to mix up
 * @return {array} a copy of the original array
 */
const knuthShuffle = (arrayToShuffle) => {
    const array = Array.from(arrayToShuffle)
    for (let i = array.length -1, j, temp; i > 0; i--) {
        j = Math.floor(Math.random()*(i+1));
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    return array
} 


/**
 * Takes an array length, a starting point and a distance and gives
 * back an index that will, if the distance from the start index exceeds
 * the length of the array, loop back and start counting from position 0.
 *
 * @param {integer} arrayLength    - The length of the array you want to use
 * @param {integer} increment      - The distance from the starting index
 * @param {integer} [startIndex=0] - The index to start counting from
 * @return {integer} the index
 * 
 * @example 
 * const arr = [0,1,2,3,4]
 * arr.length === 5          // true
 * 
 * circularIncrement(5,1)    // 1
 * circularIncrement(5,3,3)  // 1
 * circularIncrement(5,-3,4) // 1
 * 
 */
const circularIncrement = (arrayLength,increment = 0,startIndex = 0) => {
    //console.log('length',arrayLength,'increment',increment,'start',startIndex);
    
    if (arrayLength === 0 || startIndex > arrayLength) {
        //console.log('fail 1')
        console.error('circular index start point is out of the array')
        return -1
    }
    if (arrayLength === 1) {
        //console.log('condition 1')
        return 0
    }
    if (increment + startIndex < 0) {
        //console.log('foo')
        // length: 4, inc: - 1, start: 0  = 3
        const modulo = startIndex + increment % arrayLength
        
        //console.log(Math.abs(modulo));
        return modulo === 0 ? startIndex : arrayLength - Math.abs(modulo)
    }
    if (startIndex + increment < arrayLength) {
        //console.log('condition 2');
        return startIndex + increment
    }
    //console.log('condition 3');
    const modulo = (startIndex + 1 + increment ) % (arrayLength)
    //console.log(modulo);
    return modulo === 0 ? startIndex : modulo - 1
  }

  export {circularIncrement, knuthShuffle, pipe}