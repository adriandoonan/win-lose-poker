import { addToElement,calculateChenFormula, replaceInnerText } from "./helperFunctions.js";
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
        this.throwingDown = 0;
        this.cards = [];
        this.folded = false;
        this.seatNumber = null;
        this.chenScore = 0;
        this.bestHand = {};
        this.eventsElement = document?.getElementById('game-events') || 'foo';
        this.playerThrownDownElement = document.getElementById('player-thrown-down');
        this.playerFoldedElement = document.getElementById('player-folded');
        this.chenScoreElement = document.getElementById('player-chen-score');
        this.bestHandElement = document.getElementById('player-best-hand');
    }

    async doSomethingAsync(callbackFunction) {
        const waited = await randomWait()
        console.log('waited for',waited)
        let result;
        if (typeof callbackFunction === 'function') {
            result = await callbackFunction()
        }
        return result ? result : waited
    }

    sayHello() {
        const message = `Hey, this is ${this.name}, let's play!`
        addToElement(this.eventsElement,message,'p',true)
    }

    findBestHand(communityCards = []) {
        
        
        console.log('getting besthand for',this.name);
        this.chenScore =  calculateChenFormula(this.cards)
        console.log(`${this.name} has a chen score of`,this.chenScore);

        if (communityCards.length) {
            console.log('found community cards of',communityCards,'for',this.name);
            
            this.bestHand = findBestHand(this.cards.concat(communityCards))
            console.log(`${this.name} has a best hand of`,this.bestHand)

        }

        if (!this.bot) {
            if (this.chenScoreElement) {
                console.log(this.chenScoreElement);
                replaceInnerText(this.chenScoreElement,this.chenScore)
            }
            if (Object.keys(this.bestHandElement).length) {
                console.log(this.bestHandElement);
                replaceInnerText(this.bestHandElement,JSON.stringify(this.bestHand,null,2))
            }
        }
        return {chenScore: this.chenScore,bestHand: this.bestHand}

    }

    /**
     * Updates the players chen score and best hand based on
     * the available cards in the current stage of the hand
     *
     * @param {Array.<object>} [communityCards=[]]
     * @return {object} 
     * @memberof Player
     */
    async decideBet(communityCards = [],round) {
        if (this.folded) return

        if (this.cards.length) {
            console.log(this.cards);
            this.findBestHand(communityCards)
        }

        async function getBetAmount() {
            console.log('this is in the function for',round)
            let amount = 0;
            if (round) {
                let waitForBet = setTimeout(()=>{
                    amount = prompt('what do you want to bet',20)
                },3000)
            }
            return amount
        }
        
        this.throwingDown = await getBetAmount()
        console.log(this.name,'wants to throw down this much',this.throwingDown);

        return this.throwingDown
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

        replaceInnerText(this.playerThrownDownElement,this.currentBet)

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
        this.playerFoldedElement.innerText = 'folded, out of the hand'
        return this
    }
}

class Playbot extends Player {
    constructor(name,purse,aggression) {
        super(`${name}bot`,purse);
        this.aggression = aggression || 5;
        this.type = 'bot';
        this.bot = true;
        this.statsTargetElement = document.getElementById('playbot-stats-container')
        this.statsElement = '';
        this.statsElement = document.createElement('playbot-stats');
        this.playerPotElement = null;
        this.chenScoreElement = null;
        this.bestHandElement = null;
        this.playerFoldedElement = null;
       
       
    } 
    
    sayHello(){
        const message = `Hey, this is ${this.name}, let's play!`
        
        this.statsElement.name = this.name;
        this.statsElement.purse = this.purse
        //console.log(this.name);
        this.statsTargetElement.appendChild(this.statsElement)
        addToElement(this.eventsElement,message,'p',true)
    }
    fold() {
        const message = `${this.name} is folding`
        console.log(message)
        this.folded = true
        this.statsElement.setAttribute('folded',this.folded)

        return this
    }

    async doSomethingAsync(callbackFunction) {
        const waited = await randomWait()
        //console.log('waited for',waited)
        let result;
        if (typeof callbackFunction === 'function') {
            console.log('got a callback in the callfor async');
            result = await callbackFunction()
        }
        if (result) {console.log('result of an async function would be',result);}
        return result ? result : waited
    }

    decideBet(communityCards = []) {
        if (this.folded) return

        if (this.cards) {
            return this.findBestHand(communityCards)
        }
        return this
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