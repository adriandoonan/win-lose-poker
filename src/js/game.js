"use strict;"

import Hand from './hand.js';
import {addToElement,clearElements} from './helperFunctions.js';
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
      this.advanceButtonElement = document.getElementById('start-new-hand-button');
      this.winnerDialogElement = document.querySelector('dialog');
      this.winnerDialogText = document.querySelector('dialog p');
      this.playerPurseElement = document.getElementById('player-purse');
      this.playerFoldedElement = document.getElementById('player-folded');
      this.playerWinsElement = document.getElementById('player-wins');
      this.playerThrownDownElement = document.getElementById('player-thrown-down');
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
      this.playerFoldedElement.innerText = ''
      this.players.sort((player1,player2) => player1.seatNumber < player2.seatNumber ? -1 : 1)
      this.hands.push(new Hand(this.players,this.round))

    }


    advanceCurrentHand() {
        
        if (this.round >= this.hands.length ) {
          console.log('hey, this round is over');
          this.startNewHand()
          return this
        }
        let currentHand = this.hands[this.round];
       
        let playersRemaining = this.hands[this.round].players.filter(player => !player.folded).length
        console.log('\n\nstarting next round after',currentHand.stage,'with',playersRemaining,'players remaining')
      switch (currentHand.stage) {
        case 'zero': {
          currentHand.anteUp()
          console.log('Anted up, let\'s play some cards');
          break
        }
        case 'ante': {
          //console.log('round 0',);
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
          if (this.players[0].folded) {
            console.log('user player has already folded, auto advancing from',currentHand.stage);
            setTimeout(() => this.advanceCurrentHand(),2500)
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
          if (this.players[0].folded) {
            console.log('user player has already folded, auto advancing from',currentHand.stage);
            setTimeout(() => this.advanceCurrentHand(),5000)
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
          if (this.players[0].folded) {
            console.log('user player has already folded, auto advancing from',currentHand.stage);
            setTimeout(() => this.advanceCurrentHand(),7000)
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
      //this.advanceButtonElement.innerText = currentHand.stage === 'zero' ? 'Ante up' : `Deal ${currentHand.stage}`
    }


    endCurrentHand(winnerIndex) {
      if (winnerIndex === -1) {
        console.log('ending early and not declaring a winner')
        return
      }
      const message = `<strong>ending round ${this.round + 1}, and declaring ${this.hands[this.round].players[winnerIndex].name} the winner with a ${findBestHand(this.hands[this.round].players[winnerIndex].cards.concat(this.hands[this.round].communityCards)).description}</strong>`
      
      console.log(message);
      this.winnerDialogText.innerHTML = `<strong>${this.hands[this.round].players[winnerIndex].name} has won a pot of ${this.hands[this.round].pot} with a ${findBestHand(this.hands[this.round].players[winnerIndex].cards.concat(this.hands[this.round].communityCards)).description}</strong>`
      this.hands[this.round].players[winnerIndex].acceptPot(this.hands[this.round].pot)
      this.winnerDialogElement.showModal()
      addToElement(this.eventElement,message,'p',true)
      this.players.forEach(player => player.cards.splice(0))
      clearElements(this.playerCardsElement,this.communityCardsElement,this.playerThrownDownElement)
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


  export default Game
  