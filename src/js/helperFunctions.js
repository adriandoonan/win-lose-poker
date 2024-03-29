

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

/**
 * Will add a supplied string as a given HTML element
 * to the start or end of a container element
 *
 * @param {HTMLElement} htmlElement - The target element
 * @param {string} content          - The content you want to add
 * @param {string} [tag='p']        - The tag of the element with which to wrap the content
 * @param {boolean} prepend         - If set the true, the element will be added to the start
 *                                    of the target element rather than the end.
 */
const addToElement = (htmlElement,content,tag = 'p', prepend) => {
  //console.log(`trying to add`,content,'to',htmlElement);
  if (prepend) {
    htmlElement.innerHTML = `<${tag}>${content}</${tag}>` + htmlElement.innerHTML
  }else {
    htmlElement.innerHTML += `<${tag}>${content}</${tag}>`
  }
}



/**
 * Replaced the innerText of the given element
 * with the provided string
 *
 * @param {HTMLElement} htmlElement
 * @param {string} content
 */
const replaceInnerText = (htmlElement,content) => {
    htmlElement.innerText = content
  }

/**
 * Removes the given HTMLElements one after the other
 *
 * @param {HTMLElement} elements - Comma,separated list of elements
 */
const removeElements = (...elements) => {
  elements.forEach(element => element.remove())
}
   
/**
 * Clears the innerText of the provided elements
 *
 * @param {HTMLElement} elements - Comma,separated list of elements
 */
const clearElements = (...elements) => {
  elements.forEach(element => {
    try {
      element.innerText = ''
    } catch(e) {
      console.error('error trying to clear',element,)
      console.error(e)
    }
  })
}

/**
 * Calculates a score based on the two cards provided.
 * Details on the chen score can be found, for example,
 * at {@link https://www.thepokerbank.com/strategy/basic/starting-hand-selection/chen-formula/ | the poker bank}
 * website.
 *
 * @param {Array.<Object>} cardPair An array containing two card objects
 * @return {integer} The caculated Chen score
 */
const calculateChenFormula = (cardPair) => {
  let score = 0;
  const card1Value = cardPair[0].card
  const card2Value = cardPair[1].card
  const cardScores = [ , , 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10]
  const highestCard = card1Value > card2Value ? cardScores[card1Value] : cardScores[card2Value]
  const gap = Math.abs(card1Value - card2Value)
  //score += highestCard
  if (
    card1Value === card2Value
  ) {
    const pairBonus = highestCard * 2
    score += pairBonus > 5 ?  pairBonus  : 5
    //score += highestCard < 5 ? highestCard  : 5
  } else {
    score += highestCard
  }
  if (cardPair[0].suit === cardPair[1].suit) {
    score += 2
  }
  switch(gap) {
    case 0:
    case 1:
      break
    case 2:
      score -= 1
      break
    case 3: 
      score -= 2
      break
    case 4:
      score -= 4
      break
    default:
      score -=5
  }
  if (gap && gap <= 2 && card1Value < 12 && card2Value < 12) {
    score++
  }
  return Math.round(score)
}

  // const myCardsArray = [
  //   {card: 7, suit: 'spades'},
  //   {card: 8, suit:'diamonds'},
  //   {card: 10, suit:'clubs'},
  //   {card: 11, suit:'diamonds'},
  //   {card: 10, suit:'spades'},
  //   {card: 14, suit:'clubs'},
  //   {card: 13, suit:'clubs'}
  // ]

  // calculateChenFormula(myCardsArray.slice(-2))
  // should be 4 + -5 = -1

  export {circularIncrement, knuthShuffle, pipe, addToElement, replaceInnerText, removeElements, clearElements, calculateChenFormula}