// adapted from https://github.com/josh-frank/cactus-josh.git

// Here's how a card is represented in Cactus:

// +--------+--------+--------+--------+
// |xxxbbbbb|bbbbbbbb|cdhsrrrr|xxpppppp|
// +--------+--------+--------+--------+

// p = prime number of rank (2 to 41)
// r = rank of card (2 to 14)
// cdhs = bit set for suit of card
// b = bit set for rank of card

// Import lookup tables
//const lookupTables = require( "./lookupTables" );
import * as lookupTables from './cactus-lookup.js';
// const primeLookup = require( "./primeMultiplicands" );

// Note how suits are represented as set bits
const suits = { 8: "Clubs", 4: "Diamonds", 2: "Hearts", 1: "Spades" };

// Let's define each rank (2 to 14/Ace) as a prime number
const rankPrimes = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41 ];

// And a function for a card's rank, 2 to 14/Ace
const rank = card => ( card >>> 8 ) % 16;

// And another for its suit
const suit = card => ( card >>> 12 ) % 16;

// Now some arrays & a corresponding function for suit/rank/card name strings
// Note the irregular spacing to correspond to how we're representing suits as set bits [ 1, 2, 4, 8 ]
const rankNames = [ "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace" ];
const suitNames = [ null, "Spades", "Hearts", null, "Diamonds", null, null, null, "Clubs" ];
const cardName = card => `${ rankNames[ rank( card ) ] } of ${ suitNames[ suit( card ) ] }`;

// a fucntion to turn one of my card's suit value into the expected value
const toSuit = (suit) => {
    const suits = { "spades": 1, "hearts": 2, "diamonds": 4, "clubs": 8 }
    return suits[suit]
}

// a function to turn one of my card objects into the expected hash
const myCardToHash = (cardObject) => {
    const myCardRank = cardObject.card -2
    const myCardSuit = toSuit(cardObject.suit)
    return ( (rankPrimes[myCardRank ]) | (myCardRank << 8) | (myCardSuit << 12) | ( ( 1 << myCardRank ) << 16 ) )
}

// This is a clever fast way to count bits in an integer courtesy of Sean Eron Anderson
// https://graphics.stanford.edu/~seander/bithacks.html
const countBits = bit => {
    const counter = bit - ( ( bit >>> 1 ) & 3681400539 ) - ( ( bit >>> 2 ) & 1227133513 );
    return ( ( counter + ( counter >>> 3 ) ) & 3340530119 ) % 63;
}

// Now here's a function to compile a full deck
// To shuffle, pass anything other than null/undefined/0/NaN/"" as a parameter
const fullDeck = shuffled => {
    const result = [];
    for ( let rank = 0; rank < 13; rank++ ) for ( let suit of [ 8, 4, 2, 1 ] )
        result.push( ( rankPrimes[ rank ] ) | ( rank << 8 ) | ( suit << 12 ) | ( ( 1 << rank ) << 16 ) );
    if ( !shuffled ) return result;
    for ( let i = 51; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ result[ i ], result[ j ] ] = [ result[ j ], result[ i ] ];
    }
    return result;
}



// When representing cards this way, bitwise-and-ing everything with 61,440 will result in a 0
// if the hand is not a flush - this is the same as:
// hand => hand[ 0 ] & hand[ 1 ] & hand[ 2 ] & hand[ 3 ] & hand[ 4 ] & 0xF000;
const flush = hand => hand.reduce( ( total, card ) => total & card, 0xF000 );

// Here's where it gets interesting

// If a hand is a flush, then bitwise-or-ing everything and shifting it all 16 bits to the right
// will result in a number with exactly five set bits (one for each card) - these are all unique and
// they correspond to a lookup table, flushes[], with the value for each
const flushBitPattern = flush => flush.reduce( ( total, card ) => total | card , 0 ) >>> 16;
const flushRank = flush => lookupTables.flushes[ flushBitPattern( flush ) ];

// if the hand isn't a flush or straight flush, let's use a different lookup table to check
// for straights
const fiveUniqueCardsRank = hand => lookupTables.fiveUniqueCards[ flushBitPattern( hand ) ];

// We've eliminated flushes, straights and high-card hands – let's move on to pairs & threes

// Since we're representing each rank as a prime, the multiplicand of all rank primes together 
// is guaranteed to be unique
const primeMultiplicand = hand => hand.reduce( ( total, card ) => total * ( card & 0xFF ), 1 );

// This multiplicand will be way too large for a lookup table so instead we'll speed things up
// to log-n time with this perfect hash lookup function - courtesy of Paul Senzee
// http://senzee.blogspot.com/2006/06/some-perfect-hash.html
const findFast = u => {
    u += 0xe91aaa35;
    u ^= u >>> 16;
    u += u << 8;
    u ^= u >>> 4;
    let a  = ( u + ( u << 2 ) ) >>> 19;
    return a ^ lookupTables.hashAdjust[ ( u >>> 8 ) & 0x1ff ];
};



// Finally let's tie it all together - first check for flushes, then straights, then pairs/threes
const handRank = hand => {
    if ( flush( hand ) ) return flushRank( hand );
    let fiveUniqueCardsRanked = fiveUniqueCardsRank( hand );
    if ( fiveUniqueCardsRanked ) return fiveUniqueCardsRanked;
    return lookupTables.hashValues[ findFast( primeMultiplicand( hand ) ) ];
};

// Some quick simple branching to return the hand's rank as a string
const handValue = hand => {
    const rank = handRank( hand );
    if ( rank > 6185 ) return "High card";
    else if ( rank > 3325 ) return "One pair";
    else if ( rank > 2467 ) return "Two pair";
    else if ( rank > 1609 ) return "Three of a kind";
    else if ( rank > 1599 ) return "Straight";
    else if ( rank > 322 )  return "Flush";
    else if ( rank > 166 )  return "Full house";
    else if ( rank > 10 )   return "Four of a kind";
    else return "Straight flush";
};

// A function to generate possible hands (k-combinations)
// https://medium.com/nerd-for-tech/july-2-generating-k-combinations-with-recursion-in-javascript-71ef2b90b44b
const possibleHands = ( deck, combinationLength ) => {
    let head, tail, result = [];
    if ( combinationLength > deck.length || combinationLength < 1 ) { return []; }
    if ( combinationLength === deck.length ) { return [ deck ]; }
    if ( combinationLength === 1 ) { return deck.map( element => [ element ] ); }
    for ( let i = 0; i < deck.length - combinationLength + 1; i++ ) {
      head = deck.slice( i, i + 1 );
      tail = possibleHands( deck.slice( i + 1 ), combinationLength - 1 );
      for ( let j = 0; j < tail.length; j++ ) { result.push( head.concat( tail[ j ] ) ); }
    }
    return result;
}



const findBestHand = (arrayOfCards) => {
    const bestHand = possibleHands(arrayOfCards,5)
        .map(hand => ({cards:[...hand],rank: handRank(hand.map(card => card.hash))}))
        .sort((a,b) => a.rank - b.rank)[0]
    return {...bestHand, description: handValue(bestHand.cards.map(card => card.hash))}
}


export {myCardToHash, findBestHand}

//#region testing
// pass any non-null argument to shuffle the deck
// const shuffledDeck = fullDeck( true );

// const drawFive = shuffledDeck.slice( 0, 5 );

// const myCardsArray = [
//     {card: 7, suit: 'spades'},
//     {card: 8, suit:'diamonds'},
//     {card: 10, suit:'clubs'},
//     {card: 11, suit:'diamonds'},
//     {card: 10, suit:'spades'},
//     {card: 3, suit:'spades'},
//     {card: 8, suit:'hearts'}]



// const testArr = []


// myCardsArray
// myCardsArray.forEach(card => {
//     testArr.push(myCardToHash(card))
// });

// handRank(testArr)
// handValue(testArr)

//const bestHand = possibleHands(testArr,5).map(hand => ({cards:[...hand],rank:handRank(hand)})).sort((a,b) => a.rank - b.rank)[0]

const someCrds = [
    {suit: 'hearts', card: 4, hash: 270853},
    {suit: 'clubs', card: 8, hash: 4228625},
    {suit: 'spades', card: 10, hash: 16783383},
    {suit: 'clubs', card: 11, hash: 33589533},
    {suit: 'diamonds', card: 13, hash: 134236965}
]
const someCrdsTest = [
    {suit: 'hearts', card: 4},
    {suit: 'clubs', card: 8},
    {suit: 'spades', card: 10},
    {suit: 'clubs', card: 11},
    {suit: 'diamonds', card: 13}
]
const newArr = []
someCrdsTest.forEach(card => {
    newArr.push(myCardToHash(card))
})
newArr
handRank(newArr)
handValue(newArr)

findBestHand(someCrds)
handRank(someCrds.map(card => card.hash))
handValue(someCrds.map(card => card.hash))

// findBestHand(myCardsArray)

// bestHand
// handValue(bestHand.cards)

// cardName(myCardToHash(myCardsArray[0]))
// cardName(testArr[0])
// console.log(handRank(drawFive))
// console.log(handValue(drawFive));
// console.log( drawFive.map( cardName ) );
// //--> [ 'Nine of Clubs', 'Ten of Clubs', 'Six of Clubs', 'Nine of Diamonds', 'Five of Diamonds' ]
//#endregion
