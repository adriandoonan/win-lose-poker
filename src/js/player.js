
class Player {
    /**
     * A player of the game.
     *
     * @param {string} name     - The name of this player
     * @param {number} purse    - How much money this player has to bet with
     * @param {string} strategy - What kind of a player this is. This will
     *                            define how a computer-controlled player
     *                            responds in different situations 
     * 
     * @class Player
     */
    constructor(name, purse) {
        this.name = name;
        this.purse = purse || 100;
        this.currentBet = 0;
        this.seatNumber = null
    }

    placeBet(amount,type) {

        console.log(`${this.name} is placing a ${type || 'bet'} of ${amount}`)
        
        this.purse -= amount
        this.currentBet += amount
        
        return this
    }
    fold() {
        console.log(`${this.name} is folding`)
        this.folded = true

        return this
    }

}

export default Player