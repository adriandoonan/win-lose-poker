class Game {
    /**
     * a class
     * 
     * @param {array} players - An array of players, see Player class
     * @param {number} hand   - The current hand since the game was started
     * @param {number} round  - The current round in this hand. A round is counted
     *                          after every player has made a move. Rounds start
     *                          counting from 1, a round of 0 indicates that the
     *                          hand has not started and new players can potentially
     *                          enter the game
     * @param {number} pot    - The amount currently in the pot and available to win
     *                          in this hand 
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