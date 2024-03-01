import { addToElement,calculateChenFormula, replaceInnerText } from "./helperFunctions.js";
import { findBestHand } from "./cactus.js";

/**
 * A function that just waits a random amount of time before returning
 *
 * @return {integer} The amount of time the function waited for
 */
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
     * @param {integer} chenScore    - The chen score calculated for the current pocket cards
     * @param {Object} bestHand      - The best hand that can be made out of the pocket and community cards
     * @param {HTMLElement} eventsElement
     * @param {HTMLElement} playerThrownDownElement
     * @param {HTMLElement} playerFoldedElement
     * @param {HTMLElement} bestHandElement
     * @param {boolean} bot - Whether this player is a bot or user player.
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
        this.bot = false;
    }

    /**
     * Will wait a random amount of time and then run a function that may also 
     * be asynchronous
     *
     * @param {function} callbackFunction a fuction to be run following the async function
     * @return {*} 
     * @memberof Player
     */
    async doSomethingAsync(callbackFunction) {
        const waited = await randomWait()
        //console.log('waited for',waited)
        let result;
        if (typeof callbackFunction === 'function') {
            console.log('got a callback in the callfor async');
            result = await callbackFunction()
            console.log('this was the callback result',result);
        }
        return result ? result : waited
    }

    /**
     * Gets the player to introduce themselves and update the events log
     *
     * @memberof Player
     */
    sayHello() {
        const message = `Hey, this is ${this.name}, let's play!`
        addToElement(this.eventsElement,message,'p',true)
    }

    /**
     * Will try and get some scores for the firt two pocket cards, and, if
     * provided, the best five-card combination from the set of the pocket and
     * community cards. See {@link calculateChenFormula} and {@link findBestHand}.
     *
     * @param {Array.<Object>} [communityCards=[]] The cards currently on the table.
     * @return {Object} 
     * @memberof Player
     */
    findBestHand(communityCards = []) {
        
        
        //console.log('getting besthand for',this.name);
        this.chenScore =  calculateChenFormula(this.cards)
        //console.log(`${this.name} has a chen score of`,this.chenScore);

        if (communityCards.length) {
            //console.log('found community cards of',communityCards,'for',this.name);
            
            this.bestHand = findBestHand(this.cards.concat(communityCards))
            //console.log(`${this.name} has a best hand of`,this.bestHand)

        }

        if (!this.bot) {
            if (this.chenScoreElement) {
                //console.log(this.chenScoreElement);
                replaceInnerText(this.chenScoreElement,this.chenScore)
            }
            if (Object.keys(this.bestHandElement).length) {
                //console.log(this.bestHandElement);
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
            //console.log(this.cards);
            this.findBestHand(communityCards)
        }

        async function getBetAmount() {
            //console.log('this is in the function for',round)
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

    /**
     * Will log the amount awarded for winning a pot to the console.
     *
     * @param {integer} amount
     * @memberof Player
     */
    acceptPot(amount) {
        console.log(amount,'pot has been awarded to user player',this.name);
    }
}


class Playbot extends Player {
    /**
     * A computer controlled player that can take part in hands of 
     * win lose poker
     *
     * @class Playbot
     * @extends {Player}
     */
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
    
    /**
     * Gets the player to introduce themselves, update the events log
     * and add an element to the page that will hold the playbots 
     * stats on money held, won, bet and whether they have folded
     *
     * @memberof Playbot
     */
    sayHello(){
        const message = `Hey, this is ${this.name}, let's play!`
        this.statsElement.name = this.name;
        this.statsElement.purse = this.purse
        //console.log(this.name);
        this.statsTargetElement.appendChild(this.statsElement)
        addToElement(this.eventsElement,message,'p',true)
    }

    /**
     * Carries out some actions when a player folds including
     * updating stats element, and state.
     *
     * @return {*} 
     * @memberof Playbot
     */
    fold() {
        const message = `${this.name} is folding`
        console.log(message)
        this.folded = true
        this.statsElement.setAttribute('folded',this.folded)

        return this
    }

    /**
     * Finds the best hand the playbot currently has
     *
     * @param {Array.<Object>} [communityCards=[]] The set of cards on the table
     * @return {*} 
     * @memberof Playbot
     */
    decideBet(communityCards = []) {
        if (this.folded) return

        if (this.cards) {
            return this.findBestHand(communityCards)
        }
        return this
    }

    /**
     * Places a bet or folds based on how much the playbot decides to bet
     *
     * @param {integer} amount - the amount the playbot wants to bet. If the amount is less
     *                           than 0, will fold.
     * @param {string} type    - the type of bet being made, this is currently just shown in the console
     * @return {*} 
     * @memberof Playbot
     */
    placeBet(amount,type) {
        if (amount < 0) {
            this.fold()
            return amount
        }
        const message = `${this.name} is placing a ${type || 'bet'} of ${amount}`
        console.log(message)
        
        addToElement(this.eventsElement,message,'p',true)
        
        this.purse -= amount
        this.currentBet += amount

        this.statsElement.setAttribute('purse',this.purse)
        this.statsElement.setAttribute('thrown-down',this.currentBet)
        
        return amount
    }

    /**
     * Calculates how much a playbot should bet based on their chen score or current best hand.
     * Can return a value of -1, which would lead the playbot folding. In certain conditions
     * the playbot will just bet 20, no matter what.
     *
     * @param {integer} currentHighestBet
     * @return {integer} 
     * @memberof Playbot
     */
    autobet(currentHighestBet) {
        console.log('got a request for an autobet from',this.name,'current highest is',currentHighestBet);
        console.log(this.name,'would be working with a chen score of',this.chenScore, 'and best hand of',this.bestHand);
        if (this.chenScore < 3) {
            
            console.log(this.name,'folded due to low chen score');
            return -1
        }
        if (this.bestHand?.rank < 6000) {
            console.log(this.name,'thinks they have a good hand and would call with',currentHighestBet - this.currentBet );
            return currentHighestBet - this.currentBet 
        }
        console.log(this.name,'thinks they can go wild and will throw down 20');
        return 20
        
    }

    /**
     * Accepts a winning pot and updates some HTML elements.
     *
     * @param {integer} amount
     * @memberof Playbot
     */
    acceptPot(amount) {
        console.log(amount,'pot has been awarded to playbot',this.name);
        this.purse += amount;
        this.statsElement.setAttribute('purse',this.purse)
    }

}


export {Player,Playbot}