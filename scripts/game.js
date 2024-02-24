"use strict;"

class Game {
    /**
     * a class
     * 
     * @param {array}  players - An array of players, see Player class
     * @param {number} hand    - The current hand since the game was started
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
      this.hand = 0;
      this.round = 0;
      this.pot = 0;
  
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
    const suits = ['s','d','c','h']
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
        hand: []
    },
    {
        player: 2,
        hand: []
    },
    {
        player: 3,
        hand: []
    },
    {
        player: 4,
        hand: []
    }
  ]



  const deal = (cardDeck, player) => {
    player.hand.push(cardDeck.pop())
  }

  const dealRound = (deck,arrOfPlayers,round) => {
    
    let success = false, message = '';
    try {
        if (!['pre-flop','flop','turn','river'].includes(round)) {
            throw new Error('round must be a legal round')
        }
        if (round === 'pre-flop') {
            for (let i = 2; i > 0; i--) {
                arrOfPlayers.map(player => deal(deck,player))
            }
            success = true
        }
        if (round === 'flop') {
            const communityCards = {player:0,hand: []}
            for (i = 3; i > 0; i--) {
                deal(deck,communityCards)
            }
            arrOfPlayers.push(communityCards)
            success = true
        }
        if (round === 'turn') {
            if (!arrOfPlayers.find(player => player.player === 0) ||
                arrOfPlayers.find(player => player.player === 0).hand.length !== 3
                ) {
                throw new Error(`can only deal the turn once after the flop and before the river`)
            }
            deal(deck,arrOfPlayers.find(player => player.player === 0))
            success = true
        }
        if (round === 'river') {
            if (!arrOfPlayers.find(player => player.player === 0) ||
                arrOfPlayers.find(player => player.player === 0).hand.length !== 4
                ) {
                throw new Error(`can only deal the river once, after the flop and turn`)
            }
            deal(deck,arrOfPlayers.find(player => player.player === 0))
            success = true
        }
    } catch(e) {
        console.error(e)
        message = e.message
        return 
    }
    finally {
        return ({success,message})
    }

  }
   
  console.log(dealRound(deckToDeal,playersArray,[]))

  console.log(playersArray);

  dealRound(deckToDeal,playersArray,'pre-flop')

  console.log(playersArray);

  dealRound(deckToDeal,playersArray,'flop')

  console.log(playersArray);

  dealRound(deckToDeal,playersArray,'turn')

  console.log(playersArray);

  dealRound(deckToDeal,playersArray,'river')

  console.log(playersArray);

  console.log(dealRound(deckToDeal,playersArray,'cheese'))