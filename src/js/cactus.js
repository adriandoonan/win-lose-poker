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
export const suits = { 8: "Clubs", 4: "Diamonds", 2: "Hearts", 1: "Spades" };

// Let's define each rank (2 to 14/Ace) as a prime number
export const rankPrimes = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41 ];

// And a function for a card's rank, 2 to 14/Ace
export const rank = card => ( card >>> 8 ) % 16;

// And another for its suit
export const suit = card => ( card >>> 12 ) % 16;

// Now some arrays & a corresponding function for suit/rank/card name strings
// Note the irregular spacing to correspond to how we're representing suits as set bits [ 1, 2, 4, 8 ]
export const rankNames = [ "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace" ];
export const suitNames = [ null, "Spades", "Hearts", null, "Diamonds", null, null, null, "Clubs" ];
export const cardName = card => `${ rankNames[ rank( card ) ] } of ${ suitNames[ suit( card ) ] }`;

// a fucntion to turn one of my card's suit value into the expected value
export const toSuit = (suit) => {
    const suits = { "spades": 1, "hearts": 2, "diamonds": 4, "clubs": 8 }
    return suits[suit]
}

// a function to turn one of my card objects into the expected hash
export const myCardToHash = (cardObject) => {
    const myCardRank = cardObject.card -2
    const myCardSuit = toSuit(cardObject.suit)
    return ( (rankPrimes[myCardRank ]) | (myCardRank << 8) | (myCardSuit << 12) | ( ( 1 << myCardRank ) << 16 ) )
}

// This is a clever fast way to count bits in an integer courtesy of Sean Eron Anderson
// https://graphics.stanford.edu/~seander/bithacks.html
export const countBits = bit => {
    const counter = bit - ( ( bit >>> 1 ) & 3681400539 ) - ( ( bit >>> 2 ) & 1227133513 );
    return ( ( counter + ( counter >>> 3 ) ) & 3340530119 ) % 63;
}

// Now here's a function to compile a full deck
// To shuffle, pass anything other than null/undefined/0/NaN/"" as a parameter
export const fullDeck = shuffled => {
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
export const flush = hand => hand.reduce( ( total, card ) => total & card, 0xF000 );

// Here's where it gets interesting

// If a hand is a flush, then bitwise-or-ing everything and shifting it all 16 bits to the right
// will result in a number with exactly five set bits (one for each card) - these are all unique and
// they correspond to a lookup table, flushes[], with the value for each
export const flushBitPattern = flush => flush.reduce( ( total, card ) => total | card , 0 ) >>> 16;
export const flushRank = flush => lookupTables.flushes[ flushBitPattern( flush ) ];

// if the hand isn't a flush or straight flush, let's use a different lookup table to check
// for straights
export const fiveUniqueCardsRank = hand => lookupTables.fiveUniqueCards[ flushBitPattern( hand ) ];

// We've eliminated flushes, straights and high-card hands – let's move on to pairs & threes

// Since we're representing each rank as a prime, the multiplicand of all rank primes together 
// is guaranteed to be unique
export const primeMultiplicand = hand => hand.reduce( ( total, card ) => total * ( card & 0xFF ), 1 );

// This multiplicand will be way too large for a lookup table so instead we'll speed things up
// to log-n time with this perfect hash lookup function - courtesy of Paul Senzee
// http://senzee.blogspot.com/2006/06/some-perfect-hash.html
export const findFast = u => {
    u += 0xe91aaa35;
    u ^= u >>> 16;
    u += u << 8;
    u ^= u >>> 4;
    let a  = ( u + ( u << 2 ) ) >>> 19;
    return a ^ lookupTables.hashAdjust[ ( u >>> 8 ) & 0x1ff ];
};



// Finally let's tie it all together - first check for flushes, then straights, then pairs/threes
export const handRank = hand => {
    if ( flush( hand ) ) return flushRank( hand );
    let fiveUniqueCardsRanked = fiveUniqueCardsRank( hand );
    if ( fiveUniqueCardsRanked ) return fiveUniqueCardsRanked;
    return lookupTables.hashValues[ findFast( primeMultiplicand( hand ) ) ];
};

// Some quick simple branching to return the hand's rank as a string
export const handValue = hand => {
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
export const possibleHands = ( deck, combinationLength ) => {
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


// pass any non-null argument to shuffle the deck
const shuffledDeck = fullDeck( true );

const drawFive = shuffledDeck.slice( 0, 5 );

const myCardsArray = [
    {card: 7, suit: 'spades'},
    {card: 8, suit:'diamonds'},
    {card: 10, suit:'clubs'},
    {card: 11, suit:'diamonds'},
    {card: 10, suit:'spades'},
    {card: 3, suit:'spades'},
    {card: 8, suit:'hearts'}]



const testArr = []


myCardsArray
myCardsArray.forEach(card => {
    testArr.push(myCardToHash(card))
});

handRank(testArr)
handValue(testArr)

const bestHand = possibleHands(testArr,5).map(hand => ({cards:[...hand],rank:handRank(hand)})).sort((a,b) => a.rank - b.rank)[0]

export const findBestHand = (arrayOfCards) => {
    const bestHand = possibleHands(arrayOfCards,5).map(hand => ({cards:[...hand],rank:handRank(hand)})).sort((a,b) => a.rank - b.rank)[0]
    return {...bestHand, description: handValue(bestHand.cards)}
}

findBestHand(myCardsArray)

bestHand
handValue(bestHand.cards)

cardName(myCardToHash(myCardsArray[0]))
cardName(testArr[0])
console.log(handRank(drawFive))
console.log(handValue(drawFive));
console.log( drawFive.map( cardName ) );
//--> [ 'Nine of Clubs', 'Ten of Clubs', 'Six of Clubs', 'Nine of Diamonds', 'Five of Diamonds' ]