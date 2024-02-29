"use strict;"

import {Player,Playbot} from './player.js';
import Hand from './hand.js';
import {pipe, knuthShuffle, circularIncrement, addToElement,clearElements} from './helperFunctions.js';
import { findBestHand } from './cactus.js';



class Game {
    /**
     * a class
     * 
     * @param {array}  players          - An array of players, see Player class.
     * @param {Array.<Object>} hands    - The current hand since the game was started.
     * @param {number} round            - The current round in this hand. A round is counted
     *                                    after every player has made a move. Rounds start
     *                                    counting from 1, a round of 0 indicates that the
     *                                    hand has not started and new players can potentially
     *                                    enter the game. The round will be used to select the
     *                                    'dealer' for the next hand.
     *
     * @class Game
     */
    constructor(players) {
      this.players = players || [];
      this.hands = [];
      this.round = 0;
      this.winner = []; 
      this.eventElement = document.getElementById('game-events');
      this.communityCardsElement = document.getElementById('community-cards');
      this.playerCardsElement = document.getElementById('player-cards');
      this.gameScreen = document.getElementById('game-screen');
      this.gameOverScreen = document.getElementById('game-over-screen');
      this.winnerDialogElement = document.querySelector('dialog');
      this.winnerDialogText = document.querySelector('dialog p');
      this.playerPurseElement = document.getElementById('player-purse');
      this.playerWinsElement = document.getElementById('player-wins');
      this.potElement = document.getElementById('total-pot');
      this.goToGameOverScreenTimer = null;
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

    async introduce() {
      for (const player of this.players) {
          if ( player.type === 'bot' ) {
              await player.doSomethingAsync(player.sayHello())
              //console.log('did something async')
          }

        }
  }

    startNewHand() {
      this.players.sort((player1,player2) => player1.seatNumber < player2.seatNumber ? -1 : 1)
      this.hands.push(new Hand(this.players,this.round))

    }

    advanceCurrentHand() {

        if (this.round >= this.hands.length ) {
          console.log('hey, this round is over');
          return this
        }
        let currentHand = this.hands[this.round];
        let playersRemaining = this.hands[this.round].players.filter(player => !player.folded).length
        console.log('\n\nstarting next round after',currentHand.stage,'with',playersRemaining,'players remaining')
      switch (currentHand.stage) {
        case 'ante': {
          //console.log('round 0',);
          currentHand.anteUp()
          currentHand.dealPreFlop()
          console.log('now we would start a betting round after the',currentHand.stage);
          currentHand.makeBettingRound()
          break;
        }
        case 'preFlop': {
          if (playersRemaining === 1) {
            this.endCurrentHand(currentHand.players.findIndex(player => player.folded === true))
          } else {
            currentHand.dealFlop();
            console.log('now we would start a betting round after the',currentHand.stage);
            currentHand.makeBettingRound()
          }
          break
        }
        case 'flop': {
          if (playersRemaining === 1) {
            this.endCurrentHand(currentHand.players.findIndex(player => player.folded === true))
          } else {
          currentHand.dealTurn()
          console.log('now we would start a betting round after the',currentHand.stage);
          currentHand.makeBettingRound()
          }
          break;
        }
        case 'turn': {
          if (playersRemaining === 1) {
            this.endCurrentHand(currentHand.players.findIndex(player => player.folded === true))
          } else {
          currentHand.dealRiver()
          console.log('now we would start a betting round after the',currentHand.stage);
          currentHand.makeBettingRound()
          }
          break;
        }
        case 'river': {
          if (playersRemaining === 1) {
            this.endCurrentHand(currentHand.players.findIndex(player => !player.folded))
            console.log('looks like,',currentHand.players.find(player => !player.folded).name,'won the game');
          } else {
            console.log('looks like we need a showdown with',currentHand.players.filter(player => !player.folded),'to decide the winner');
            const winnersArr = currentHand.decideWinner()
            console.log('we looked at the cards and decided the winner(s)',winnersArr);
            
            this.endCurrentHand(winnersArr[0].index)
          }
        }

      }
    }

    endCurrentHand(winnerIndex) {
      if (winnerIndex === -1) {
        console.log('ending early and not declaring a winner')
        return
      }
      const message = `<strong>ending round ${this.round + 1}, and declaring ${this.hands[this.round].players[winnerIndex].name} the winner with a ${findBestHand(this.hands[this.round].players[winnerIndex].cards.concat(this.hands[this.round].communityCards)).description}</strong>`
      
      console.log(message);
      this.winnerDialogText.innerHTML = `<strong>${this.hands[this.round].players[winnerIndex].name} has won a pot of ${this.hands[this.round].pot} with a ${findBestHand(this.hands[this.round].players[winnerIndex].cards.concat(this.hands[this.round].communityCards)).description}</strong>`
      
      this.winnerDialogElement.showModal()
      addToElement(this.eventElement,message,'p',true)
      this.players.forEach(player => player.cards.splice(0))
      clearElements(this.playerCardsElement,this.communityCardsElement,this.potElement)
      this.players[winnerIndex].purse += this.hands[this.round].pot;
      this.playerPurseElement.innerText = this.players[0].purse;
      this.players[winnerIndex].wins++
      this.playerWinsElement.innerText = this.players[0].wins;
      this.round++
      if (this.players[0].purse < 0){
        console.log('oh no, the game is over, you are out of money');
        this.endWholeDamnGame()
      }
    }

    endWholeDamnGame() {
      this.goToGameOverScreenTimer = setTimeout(() => {
        this.winnerDialogElement.close()
        this.gameScreen.classList.add('hidden')
        this.gameOverScreen.classList.remove('hidden')
      },2500)

    }
  }






  let playersArray = [
    new Player('foo',100),
    new Player('bar',100),
    new Player('baz',100),
    new Player('jij',100),
  ]

  // const newGeem = new Game(playersArray)

  // //console.log(newGeem)

  // newGeem.players[0].seatNumber = 6
  // //console.log(newGeem.players[0]);
  // newGeem.players[3].seatNumber = 1
  // //console.log(newGeem.players[3]);

  // newGeem.startNewHand()
  // //console.log(newGeem.hands[0].players);

  // newGeem.hands[0].addPlayers([new Player('joji')])

  


  // //console.log(newGeem.hands[0].players);

  // newGeem.hands[0].stage
  // newGeem.advanceCurrentHand()
  // //console.log(newGeem.hands[0]);
  // newGeem.advanceCurrentHand()
  // console.log('carrrds',newGeem.hands[0].players[0].cards)
  // //console.log(newGeem.hands[0]);
  // newGeem.advanceCurrentHand()
  // //console.log(newGeem.hands[0]);
  // newGeem.advanceCurrentHand()
  // //console.log(newGeem.hands[0]);


  

/**
 * TODO - make functional so we return a new deck and
 *        player instead of mutating, round deals are functional
 *        so not sure if needed
 *
 * @param {*} cardDeck
 * @param {*} player
 */
// const deal = (cardDeck, player) => {
//     player.cards.push(cardDeck.pop())
//   }

//   const dealPreFlop = ({deck,arrayOfPlayers,communityCards = {}}) => {
//     if (
//         arrayOfPlayers.some(player => player.cards.length) || 
//         communityCards?.cards?.length
//         ) {
//         console.error('can only deal pre-flop once')
//         return
//     }
//     for (let i = 2; i > 0; i--) {
//         arrayOfPlayers.forEach(player => deal(deck,player))
//     }
//     return {deck,arrayOfPlayers}
//   }

//   const dealFlop = ({deck,arrayOfPlayers,communityCards = {}}) => {
//     if (
//         arrayOfPlayers.some(player => player.cards.length !== 2) || 
//         communityCards?.cards?.length
//         ) {
//         console.error('can only deal the flop once, after players have cards')
//         return
//     }
//     const burnedCard = deck.pop()
//     communityCards.cards = []
//     for (let i = 3; i > 0; i--) {
//         deal(deck,communityCards)
//     }
    
//     return {deck,arrayOfPlayers,communityCards}
//   }

//   const dealTurn = ({deck, arrayOfPlayers,communityCards = {}}) => {
//     if ( communityCards?.cards?.length !== 3) {
//         console.error(`can only deal the turn once, after the flop and before the river`)
//         return // it is better to always return something
//     }
//     const burnedCard = deck.pop()
//     deal(deck,communityCards)
//     return {deck,arrayOfPlayers,communityCards}
//   }
   
//   const dealRiver = ({deck, arrayOfPlayers,communityCards = {}}) => {
//     if ( communityCards?.cards?.length !== 4 ) {
//         console.error(`can only deal the river once, after the flop and turn`)
//         return
//     }
//     const burnedCard = deck.pop()
//     deal(deck,communityCards)
//     return {deck,arrayOfPlayers,communityCards}
//   }
// ABOVE HAS BEEN MOVED TO HAND CLASS

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


    //console.log(JSON.stringify(pipe(dealPreFlop, dealFlop, dealTurn, dealRiver)({deck:deckToDeal, arrayOfPlayers:playersArray}),null,4));

//  dealPreFlop(deckToDeal,playersArray)
//  console.log(playersArray)

//  playersArray.find(player => player.player === 40)




  //const testArray = ['a','b','c','d']

  //circularIncrement(testArray.length,2,0)

  //testArray[circularIncrement(testArray.length,5,0)]


   //console.log(playersArray);


  
  // const anteUp = (arrOfPlayers, dealerIndex = 0, blinds = {}) => {
  //   const bigBlind = blinds.bigBlind || 4;
  //   const smallBlind = blinds.smallBlind || 2;
  //   let pot = 0;
  //   const numberOfPlayers = arrOfPlayers.length

  //   if (numberOfPlayers < 2) {
  //       console.error('you don\'t have enough players for a game')
  //       return
  //   }
    
  //   if (dealerIndex > numberOfPlayers -1) {
  //       console.error('dealerIndex is more than the number of players')
  //       return 
  //   }

  //   const bigBlindPlayerIndex = circularIncrement(numberOfPlayers,1,dealerIndex)
  //   const smallBlindPlayerIndex = circularIncrement(numberOfPlayers,2,dealerIndex)

  //   { // handle big blind
  //       arrOfPlayers[bigBlindPlayerIndex].placeBet(bigBlind,'big blind')
  //       // this should be a method on the player
  //       pot += bigBlind
  //   }
  //   { // handle small blind
  //       arrOfPlayers[smallBlindPlayerIndex].placeBet(smallBlind, 'small blind')

  //       pot += smallBlind
  //   }

  //   return {arrOfPlayers,dealerIndex,pot}
  // } 

  // //anteUp(playersArray)
  // ABOVE HAS BEEN MOVED TO HAND CLASS

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
  // const makeBettingRound = (arrOfPlayers,dealerIndex,pot = 0,communityCards = {}) => {
  //   let round = 0
  //   let totalMoves = 0;
  //   let currentRoundMoves = 0;
  //   let currentHighestBet = arrOfPlayers.reduce((acc,cur) => cur.currentBet > acc ? cur.currentBet : acc,0)

  //   do {
  //       totalMoves += currentRoundMoves;
  //       currentRoundMoves = 0;
  //       console.log('\nmaking some moves in round',round);
  //       // as a player makes a move that is not a check the 
  //       // current moves increases by one
  //       // once every player has had the option to make a move
  //       // and the move count does not increase in that round
  //       // we can end the round
  //       // we can move the number of moves from current round
  //       // to moves variable and reset current round to 0 at
  //       // start of round
        
  //       arrOfPlayers.forEach(player => {
            
  //           if (!player.folded && player.currentBet < currentHighestBet) {
  //               console.log(player.name,' is chumpin->',player.currentBet,'highest',currentHighestBet,);
  //               if ( Math.random() > 0.4 ) {
  //                   const currentDeficit = currentHighestBet - player.currentBet
  //                   const bet = Math.random() > 0.4 ? currentDeficit : 4
                    
  //                   bet === currentDeficit ? player.placeBet(bet,'call') :player.placeBet(4)
                    
  //                   pot += bet
  //                   currentRoundMoves++
  //                   if (player.currentBet > currentHighestBet) {
  //                       currentHighestBet = player.currentBet
  //                   } 
  //               } else  {
  //                   player.fold()
  //               }
  //           }
  //       })
  //       console.log('round',round,'currentRoundMoves',currentRoundMoves,'totalMoves',totalMoves);
  //       round++
  //   }
  //   while (
  //       currentRoundMoves > 0 && round < 5
  //   )
  //   //console.log(playersArray);
  //   console.log('round',round,'currentRoundMoves',currentRoundMoves,'totalMoves',totalMoves);
    
  //   return {playersArray, dealerIndex, pot, communityCards}
  // }
  // THIS HAS BEEN MOVED TO THE HANDS CLASS

  //console.log(makeBettingRound(playersArray,0));

  export default Game
  