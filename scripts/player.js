
class Player {
    /**
     * A player of the game.
     *
     * @param {string} type     - The type of player, either human or bot
     * @param {string} name     - The name of this player
     * @param {number} purse    - How much money this player has to bet with
     * @param {string} strategy - What kind of a player this is. This will
     *                            define how a computer-controlled player
     *                            responds in different situations 
     * 
     * @class Player
     */
    constructor(type, name, purse, strategy) {
        this.type = type || 'bot';
        this.name = name || this.pickRandomName();
        this.purse = purse || 1000;
        this.strategy = strategy || this.pickRandomStrategy();
    }

}