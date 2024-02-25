"use strict;"

import Player from './player.js';
import {pipe, knuthShuffle, circularIncrement} from './helperFunctions.js'



class Game {
    /**
     * a class
     * 
     * @param {array}  players  - An array of players, see Player class
     * @param {number} hands    - The current hand since the game was started
     * @param {number} round    - The current round in this hand. A round is counted
     *                            after every player has made a move. Rounds start
     *                            counting from 1, a round of 0 indicates that the
     *                            hand has not started and new players can potentially
     *                            enter the game
     * @param {number} pot      - The amount currently in the pot and available to win
     *                            in this hand 
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
      this.players[this.players.length - 1].seatNumber = this.players.length
    }
    startNewHand() {
      
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
    return shuffled ? knuthShuffle(deck) : deck
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
    new Player('foo',100),
    new Player('bar',100),
    new Player('baz',100),
    new Player('jij',100),
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
    if (
        arrayOfPlayers.some(player => player.cards.length !== 2) || 
        communityCards?.cards?.length
        ) {
        console.error('can only deal the flop once, after players have cards')
        return
    }
    const burnedCard = deck.pop()
    communityCards.cards = []
    for (let i = 3; i > 0; i--) {
        deal(deck,communityCards)
    }
    
    return {deck,arrayOfPlayers,communityCards}
  }

  const dealTurn = ({deck, arrayOfPlayers,communityCards = {}}) => {
    if ( communityCards?.cards?.length !== 3) {
        console.error(`can only deal the turn once, after the flop and before the river`)
        return // it is better to always return something
    }
    const burnedCard = deck.pop()
    deal(deck,communityCards)
    return {deck,arrayOfPlayers,communityCards}
  }
   
  const dealRiver = ({deck, arrayOfPlayers,communityCards = {}}) => {
    if ( communityCards?.cards?.length !== 4 ) {
        console.error(`can only deal the river once, after the flop and turn`)
        return
    }
    const burnedCard = deck.pop()
    deal(deck,communityCards)
    return {deck,arrayOfPlayers,communityCards}
  }

    // console.log(dealPreFlop(deckToDeal,playersArray,[]))

    // console.log(playersArray);

    // dealPreFlop({deck:deckToDeal, arrayOfPlayers:playersArray})

    // console.log(playersArray);

    // dealFlop({deck: deckToDeal, arrayOfPlayers: playersArray})

    // console.log(playersArray);

    // dealTurn({deck: deckToDeal, arrayOfPlayers: playersArray})

    // console.log(playersArray);

    // dealRiver({deck: deckToDeal,arrayOfPlayers: playersArray})

    // console.log(playersArray);


    console.log(JSON.stringify(pipe(dealPreFlop, dealFlop, dealTurn, dealRiver)({deck:deckToDeal, arrayOfPlayers:playersArray}),null,4));

//  dealPreFlop(deckToDeal,playersArray)
//  console.log(playersArray)

//  playersArray.find(player => player.player === 40)




  //const testArray = ['a','b','c','d']

  //circularIncrement(testArray.length,2,0)

  //testArray[circularIncrement(testArray.length,5,0)]


   //console.log(playersArray);


  
  const anteUp = (arrOfPlayers, dealerIndex = 0, blinds = {}) => {
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

    { // handle big blind
        arrOfPlayers[bigBlindPlayerIndex].placeBet(bigBlind,'big blind')
        // this should be a method on the player
        pot += bigBlind
    }
    { // handle small blind
        arrOfPlayers[smallBlindPlayerIndex].placeBet(smallBlind, 'small blind')

        pot += smallBlind
    }

    return {arrOfPlayers,dealerIndex,pot}
  } 

  anteUp(playersArray)

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
  const makeBettingRound = (arrOfPlayers,dealerIndex,pot = 0,communityCards = {}) => {
    let round = 0
    let totalMoves = 0;
    let currentRoundMoves = 0;
    let currentHighestBet = arrOfPlayers.reduce((acc,cur) => cur.currentBet > acc ? cur.currentBet : acc,0)

    do {
        totalMoves += currentRoundMoves;
        currentRoundMoves = 0;
        console.log('\nmaking some moves in round',round);
        // as a player makes a move that is not a check the 
        // current moves increases by one
        // once every player has had the option to make a move
        // and the move count does not increase in that round
        // we can end the round
        // we can move the number of moves from current round
        // to moves variable and reset current round to 0 at
        // start of round
        
        arrOfPlayers.forEach(player => {
            
            if (!player.folded && player.currentBet < currentHighestBet) {
                console.log(player.name,' is chumpin->',player.currentBet,'highest',currentHighestBet,);
                if ( Math.random() > 0.4 ) {
                    const currentDeficit = currentHighestBet - player.currentBet
                    const bet = Math.random() > 0.4 ? currentDeficit : 4
                    
                    bet === currentDeficit ? player.placeBet(bet,'call') :player.placeBet(4)
                    
                    pot += bet
                    currentRoundMoves++
                    if (player.currentBet > currentHighestBet) {
                        currentHighestBet = player.currentBet
                    } 
                } else  {
                    player.fold()
                }
            }
        })
        console.log('round',round,'currentRoundMoves',currentRoundMoves,'totalMoves',totalMoves);
        round++
    }
    while (
        currentRoundMoves > 0 && round < 5
    )
    //console.log(playersArray);
    console.log('round',round,'currentRoundMoves',currentRoundMoves,'totalMoves',totalMoves);
    
    return {playersArray, dealerIndex, pot, communityCards}
  }

  console.log(makeBettingRound(playersArray,0));

  export default Game
  