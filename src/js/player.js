
class Player {
    /**
     * A player of the game.
     *
     * @param {string} name          - The name of this player
     * @param {number} purse         - How much money this player has to bet with
     * @param {number} currentBet    - The amount this player has thrown into the current pot
     * @param {Array.<Object>} cards - The cards held by this player
     * @param {bool} folded          - Whether this player has already folded
     * @param {integer} seatNumber   - The position this player has around the table
     * 
     * @class Player
     */
    constructor(name, purse) {
        this.name = name;
        this.purse = purse || 100;
        this.currentBet = 0;
        this.cards = [];
        this.folded = false;
        this.seatNumber = null
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

        console.log(`${this.name} is placing a ${type || 'bet'} of ${amount}`)
        
        this.purse -= amount
        this.currentBet += amount
        
        return this
    }

    /**
     * Sets fold to true for this player
     *
     * @return {*} 
     * @memberof Player
     */
    fold() {
        console.log(`${this.name} is folding`)
        this.folded = true

        return this
    }
}

export default Player