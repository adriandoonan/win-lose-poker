import { addToElement,calculateChenFormula } from "./helperFunctions.js";
import { findBestHand } from "./cactus.js";

async function randomWait() {
    const timeToWait = Math.floor(Math.random() * 1000)
    await new Promise((resolve) => setTimeout(resolve, timeToWait))
    return timeToWait
}

class Player {
    /**
     * A player of the game.
     *
     * @param {string} name          - The name of this player
     * @param {number} purse         - How much money this player has to bet with
     * @param {integer} wins         - How many wins this player has in the current game
     * @param {number} currentBet    - The amount this player has thrown into the current pot
     * @param {Array.<Object>} cards - The cards held by this player
     * @param {bool} folded          - Whether this player has already folded
     * @param {integer} seatNumber   - The position this player has around the table
     * 
     * @class Player
     */
    constructor(name, purse, purseElement) {
        this.name = name;
        this.purse = purse || 100;
        this.purseElement = purseElement || null;
        this.wins = 0;
        this.currentBet = 0;
        this.cards = [];
        this.folded = false;
        this.seatNumber = null;
        this.chenScore = 0;
        this.bestHand = {};
        this.eventsElement = document?.getElementById('game-events') || 'foo';
    }

    async doSomethingAsync(callbackFunction) {
        const waited = await randomWait()
        console.log('waited for',waited)
        if (typeof callbackFunction === 'function') {
            callbackFunction()
        }
        return waited
    }

    sayHello() {
        const message = `Hey, this is ${this.name}, let's play!`
        addToElement(this.eventsElement,message,'p',true)
    }

    /**
     * Updates the players chen score and best hand based on
     * the available cards in the current stage of the hand
     *
     * @param {Array.<object>} [communityCards=[]]
     * @return {object} 
     * @memberof Player
     */
    decideBet(communityCards = []) {
        if (this.folded) return

        const hand = this.cards.concat(communityCards)
        if (hand.length === 2) {
            this.chenScore = calculateChenFormula(hand)
            console.log(`${this.name} has two cards and chen score of ${this.chenScore}`)
        }
        if (hand.length >= 5) {
            this.bestHand = findBestHand(hand)
            console.log(`${this.name} has a best hand of`,this.bestHand)

        }

        return this
    }

    /**
     * Decreases the purse and increases the current bet
     *
     * @param {number} amount - The amount being bet
     * @param {string} type   - The type of bet, can be a `call`, `raise`,
     *                          `small blind` or `big blind`
     * @return {*} 
     * @memberof Player
     */
    placeBet(amount,type) {
        const message = `${this.name} is placing a ${type || 'bet'} of ${amount}`
        console.log(message)
        addToElement(this.eventsElement,message,'p',true)
        
        this.purse -= amount
        this.currentBet += amount

        if (this.purseElement) {
            this.purseElement.innerText = this.purse
        }
        
        return amount
    }

    /**
     * Sets fold to true for this player
     *
     * @return {*} 
     * @memberof Player
     */
    fold() {
        const message = `${this.name} is folding`
        console.log(message)
        addToElement(this.eventsElement,message,'p',true)
        this.folded = true

        return this
    }
}

class Playbot extends Player {
    constructor(name,purse,aggression) {
        super(`${name}bot`,purse);
        this.aggression = aggression || 5;
        this.type = 'bot';
        this.statsTargetElement = document.getElementById('playbot-stats-container')
        this.statsElement = '';
        this.statsElement = document.createElement('playbot-stats');
       
       
    } 
    
    sayHello(){
        const message = `Hey, this is ${this.name}, let's play!`
        
        this.statsElement.name = this.name;
        this.statsElement.purse = this.purse
        console.log(this.name);
        this.statsTargetElement.appendChild(this.statsElement)
        addToElement(this.eventsElement,message,'p',true)
    }

    placeBet(amount,type) {
        const message = `${this.name} is placing a ${type || 'bet'} of ${amount}`
        console.log(message)
        addToElement(this.eventsElement,message,'p',true)
        
        this.purse -= amount
        this.currentBet += amount

        this.statsElement.setAttribute('purse',this.purse)
        this.statsElement.setAttribute('thrown-down',this.currentBet)
        
        return amount
    }

}

const newBot = new Playbot('bob')
newBot

export {Player,Playbot}