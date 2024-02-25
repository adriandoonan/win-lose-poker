"use strict;"

const pipe = (...funcs) => {
    return (value) => {
      return funcs.reduce((res, fn) => fn(res), value);
    };
  };

class Game {
    /**
     * a class
     * 
     * @param {array}  players - An array of players, see Player class
     * @param {number} hands    - The current hand since the game was started
     * @param {number} round   - The current round in this hand. A round is counted
     *                           after every player has made a move. Rounds start
     *                           counting from 1, a round of 0 indicates that the
     *                           hand has not started and new players can potentially
     *                           enter the game
     * @param {number} pot     - The amount currently in the pot and available to win
     *                           in this hand 
     *
     * @class Game
     */
    constructor() {
      this.players = [];
      this.hands = [];

    }
  
    /**
     * Add a player to the current game
     *
     * @param {object} player A player object
     * @memberof Game
     */
    addPlayer(player) {
      this.players.push(player)
    }
  }


  const newDeck = (shuffled = true, aceHigh = true) => {
    const suits = ['spades','diamonds','clubs','hearts']
    const cardValues = [2,3,4,5,6,7,8,9,10,11,12,13,aceHigh ? 14 : 1]
    let deck = [];
    for (const suit of suits) {
        for (const card of cardValues) {
            deck.push({suit,card})
        }
    }
    if (shuffled) {
        for (let i = deck.length -1, j, temp; i > 0; i--) {
            j = Math.floor(Math.random()*(i+1));
            temp = deck[j];
            deck[j] = deck[i];
            deck[i] = temp;
        }
    }
    return deck
  }


//#region some stuff to test that shuffle is random
//   const arrayOfRandos = () => {
//     let cardStack = []
//     for (let i = 1000000;i > 0; i--) {
//         const card = newDeck()[0]
//         cardDef = Object.values(card).join('')
//         cardStack.push(cardDef)
//     }
//     return cardStack.sort((a,b) => a.localeCompare(b))
//   }

//   const testCards = arrayOfRandos()

//   const frequency = testCards.reduce((acc,cur) => {
//     acc[cur] ? acc[cur] += 1 : acc[cur] = 1;
//     return acc
//   },{})

//   console.log(frequency)
//
//#endregion


  let deckToDeal = newDeck()
  let playersArray = [
    {
        player: 1,
        name: 'foo',
        purse: 100,
        currentBet: 0,
        dealer: false,
        folded: false,
        cards: []
    },
    {
        player: 2,
        name: 'bar',
        purse: 100,
        currentBet: 0,
        dealer: false,
        folded: false,
        cards: []
    },
    {
        player: 3,
        name: 'baz',
        purse: 100,
        currentBet: 0,
        dealer: false,
        folded: false,
        cards: []
    },
    {
        player: 4,
        name: 'jij',
        purse: 100,
        currentBet: 0,
        dealer: false,
        folded: false,
        cards: []
    }
  ]


/**
 * TODO - make functional so we return a new deck and
 *        player instead of mutating, round deals are functional
 *        so not sure if needed
 *
 * @param {*} cardDeck
 * @param {*} player
 */
const deal = (cardDeck, player) => {
    player.cards.push(cardDeck.pop())
  }

  const dealPreFlop = ({deck,arrayOfPlayers,communityCards = {}}) => {
    deck = JSON.parse(JSON.stringify(deck))
    arrayOfPlayers = JSON.parse(JSON.stringify(arrayOfPlayers))
    
    if (
            arrayOfPlayers.some(player => player.cards.length) || 
            communityCards?.cards?.length
        ) {
            console.error('can only deal pre-flop once')
            return
    }
    for (let i = 2; i > 0; i--) {
        arrayOfPlayers.forEach(player => deal(deck,player))
    }
    return {deck,arrayOfPlayers}
  }

  const dealFlop = ({deck,arrayOfPlayers,communityCards = {}}) => {
    deck = JSON.parse(JSON.stringify(deck))
    arrayOfPlayers = JSON.parse(JSON.stringify(arrayOfPlayers))
    
    if (
            arrayOfPlayers.some(player => player.cards.length !== 2) || 
            communityCards?.cards?.length
        ) {
            console.error('can only deal the flop once, after players have cards')
            return
    }
    const burnedCard = deck.pop()
    communityCards.cards = []
    for (i = 3; i > 0; i--) {
        deal(deck,communityCards)
    }
    
    return {deck,arrayOfPlayers,communityCards}
  }

  const dealTurn = ({deck, arrayOfPlayers,communityCards = {}}) => {
    deck = JSON.parse(JSON.stringify(deck))
    arrayOfPlayers = JSON.parse(JSON.stringify(arrayOfPlayers))

    if ( communityCards?.cards?.length !== 3) {
        console.error(`can only deal the turn once, after the flop and before the river`)
        return // it is better to always return something
    }
    const burnedCard = deck.pop()
    deal(deck,communityCards)
    return {deck,arrayOfPlayers,communityCards}
  }
   
  const dealRiver = ({deck, arrayOfPlayers,communityCards = {}}) => {
    deck = JSON.parse(JSON.stringify(deck))
    arrayOfPlayers = JSON.parse(JSON.stringify(arrayOfPlayers))
    
    if ( communityCards?.cards?.length !== 4 ) {
        console.error(`can only deal the river once, after the flop and turn`)
        return
    }
    const burnedCard = deck.pop()
    deal(deck,communityCards)
    return {deck,arrayOfPlayers,communityCards}
  }

//   console.log(dealPreFlop(deckToDeal,playersArray,[]))

//   console.log(playersArray);

     //dealPreFlop({deck:deckToDeal, arrayOfPlayers:playersArray})

     //console.log(playersArray);

    // dealFlop({deck: deckToDeal, arrayOfPlayers: playersArray})

    // console.log(playersArray);

    // dealTurn({deck: deckToDeal, arrayOfPlayers: playersArray})

    // console.log(playersArray);

    // dealRiver({deck: deckToDeal,arrayOfPlayers: playersArray})

    // console.log(playersArray);


    // console.log(JSON.stringify(pipe(dealPreFlop, dealFlop, dealTurn, dealRiver)({deck:deckToDeal, arrayOfPlayers:playersArray}),null,4));

//  dealPreFlop(deckToDeal,playersArray)
//  console.log(playersArray)

//  playersArray.find(player => player.player === 40)


  const circularIncrement = (arrayLength,increment,startIndex = 0) => {
    console.log('length',arrayLength,'increment',increment,'start',startIndex);
    
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

  const testArray = ['a','b','c','d']

  //circularIncrement(testArray.length,2,0)

  testArray[circularIncrement(testArray.length,5,0)]


   


  
  const anteUp = (arrOfPlayers, dealerIndex = 0, blinds = {}) => {
    const players = JSON.parse(JSON.stringify(arrOfPlayers));
    const bigBlind = blinds.bigBlind || 4;
    const smallBlind = blinds.smallBlind || 2;
    let pot = 0;
    const numberOfPlayers = arrOfPlayers.length

    if (numberOfPlayers < 2) {
        console.error('you don\'t have enough players for a game')
        return
    }
    
    if (dealerIndex > numberOfPlayers -1) {
        console.error('dealerIndex is more than the number of players')
        return 
    }

    const bigBlindPlayerIndex = circularIncrement(numberOfPlayers,1,dealerIndex)
    const smallBlindPlayerIndex = circularIncrement(numberOfPlayers,2,dealerIndex)

    //if (players.length === 2) {
        { // handle big blind
            players[bigBlindPlayerIndex].purse -= bigBlind
            pot += bigBlind
        }
        { // handle small blind
            players[smallBlindPlayerIndex].purse -=smallBlind
            pot += smallBlind
        }
    //}


    return {players,dealerIndex,pot}

  } 

  console.log(anteUp(playersArray))

  /** start betting round, we should use fixed for a start and
   *  not allow unlimited betting so we can fix the amounts that
   *  a player can bet, this can be extended later if we can get
   *  the logic right in the first place.
   * 
   *  there are four rounds of betting: after the pre-flop has been 
   *  dealt, after the flop, after the turn and after the river. A 
   *  betting round will continue until all players have matched the 
   *  current bet, put up all their chips or folded.
   * 
   *  in a betting round each player should have the opportunity
   *  to call, check, raise or fold.
   *  on a call: 
   */
  const makeBettingRound = (arrOfPlayers,dealerIndex,pot,communityCards = {}) => {
    let round = 0
    let totalMoves = 0;
    let currentRoundMoves = 0;
    let currentHighestBet = 0

    do {
        totalMoves += currentRoundMoves;
        currentRoundMoves = 0;
        console.log('make some moves');
        // as a player makes a move that is not a check the 
        // current moves increases by one
        // once every player has had the option to make a move
        // and the move count does not increase in that round
        // we can end the round
        // we can move the number of moves from current round
        // to moves variable and reset current round to 0 at
        // start of round
        arrOfPlayers.forEach(player => {
            console.log('moves',totalMoves,'currentRoundMoves',currentRoundMoves,'round',round);
            
            if ( !player.folded && Math.random() > 0.7 ) {
                const bet = 5
                player.purse -=  bet
                player.currentBet += bet
                pot += bet
                currentRoundMoves++
                if (player.currentBet > currentHighestBet) {
                    currentHighestBet = player.currentBet
                } 
            } else if (Math.random() > 0.7) {
                player.folded = true
            }
        })
        round++
    }
    while (
        currentRoundMoves !== 0 && round < 50
    )
    console.log(arrOfPlayers);
    console.log('moves',totalMoves,'currentRoundMoves',currentRoundMoves,'round',round);
    
    return {players, dealerIndex, pot, communityCards}
  }

  //console.log(makeBettingRound(playersArray,0));

  