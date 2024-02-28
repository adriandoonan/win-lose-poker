"use strict;"
import {Player,Playbot} from "./player.js";
import { circularIncrement, knuthShuffle, addToElement } from "./helperFunctions.js";
import { myCardToHash,findBestHand } from "./cactus.js";


class Deck {
/**
 * Class for a deck of cards along with some methods to handle
 * the deck and dealing from the deck
 * @class Deck
 * @param {boolean} [shuffled=true] Whether the cards should come preshuffled
 * @param {boolean} [acesHigh=true] Whether we should count aces high
 */

    /**
     * A private function to return a new deck of cards
     *
     * @return {Array} The deck of cards
     * 
     * @memberof Deck
     */
    #deck = function(shuffled = true, acesHigh = true) {
        const suits = ['spades','diamonds','clubs','hearts']
        const cardValues = [2,3,4,5,6,7,8,9,10,11,12,13,acesHigh ? 14 : 1].sort((a,b) => a - b)
        let deck = [];
        for (const suit of suits) {
            for (const card of cardValues) {
                deck.push({suit,card, hash: myCardToHash({suit,card})})
            }
        }
        return shuffled ? knuthShuffle(deck) : deck
      }

    constructor(shuffled = true, acesHigh = true) {
            this.cards = this.#deck(shuffled,acesHigh)
        }

    /**
     * If aces are high in the deck, switches them to low
     *
     * @return {Array} The deck of cards
     * @memberof Deck
     */
    acesLow() {
        this.cards = this.cards.map(card => card.card === 14 ? {...card,card:1} : card)
        return this.cards
    }

    /**
     * If aces are low in the deck, switches them to low
     *
     * @return {Array} The deck of cards
     * @memberof Deck
     */
    acesHigh() {
        this.cards = this.cards.map(card => card.card === 1 ? {...card,card:14} : card)
        return this.cards
    }

    /**
     * Shuffles the deck
     *
     * @return {Array} The deck of cards
     * @memberof Deck
     */
    shuffle() {
        this.cards = knuthShuffle(this.cards)
        return this.cards
    }

    /**
     * Removes cards from the top of the deck and returns the new deck.
     * Defaults to one card.
     *
     * @param {integer} [numberOfCards=1] The number of cards to remove from the top
     * @return {Array} The deck of cards
     * @memberof Deck
     */
    burn(numberOfCards = 1) {
        this.cards.splice(-numberOfCards)
        return this.cards
    }

    /**
     * Removes a number of cards, defaulting to one,
     * from the top of the deck and returns them.
     *
     * @param {number} [numberOfCards=1]
     * @return {object} The card to deal to the target 
     * @memberof Deck
     */
    deal(numberOfCards = 1) {
        return this.cards.splice(-numberOfCards)
    } 
}



//region testing
// const crds = new Deck()
// const crds2 = new Deck()

// console.log(crds.shuffle());
// console.log(crds2)
// crds2.shuffle()
// console.log(crds2);
// crds.acesLow()
// console.log(crds);
// crds.cards.length
// crds.burn()
// crds.cards.length

// crds.deal(4)
// crds.cards.length
// const newCard = crds.deal()
// crds.cards.length
//#endregion


// TODO figue out why this can't be instantiated with the array of new players
// or with creating a new deck on instantiation, it is just undefined before i
// set using another fucntion

class Hand {
    /**
     * Represents a hand in the game of poker
     * 
     * @param {Array} players 
     * @param {integer} [round = 0] 
     * @param {integer} [blind = 2] 
     * @class Hand
     */
    constructor(players,round = 0, blind = 2) {
        this.deck = new Deck();
        this.players = function() {
            if (!players) return []
            const takenSeats = players.map(player => player.seatNumber)
            const freeSeats = Array.from(' '.repeat(players.length)).map((_,index) => {if (!takenSeats.includes(index +1)) return index + 1}).filter(elem => elem)
            return players.map((player) => {
                if (!player.seatNumber) { 
                    player.seatNumber = freeSeats.shift()
                }
                return player
            }).sort((a,b) => a.seatNumber < b.seatNumber ? -1 : 1)
        }() || [];
        this.communityCards = [];
        this.pot = 20;
        this.blind = blind;
        this.dealerIndex = circularIncrement(this.players.length,round);
        this.stage = 'ante';
        this.potElement = document.getElementById('total-pot');
    }
    

    
    addPlayers(players) {
        const allPlayers = [...this.players,...players]
        const takenSeats = allPlayers.map(player => player.seatNumber)
        const freeSeats = Array.from(' '.repeat(allPlayers.length)).map((_,index) => {if (!takenSeats.includes(index +1)) return index + 1}).filter(elem => elem)

        this.players = allPlayers.map((player) => {
            if (!player.seatNumber) { 
                player.seatNumber = freeSeats.shift()
            }
            return player
        }).sort((a,b) => a.seatNumber < b.seatNumber ? -1 : 1)

        return this
    }

    getPlayers() {
        return this.players
    }
   
    acesLow()  {
            this.deck.acesLow();
            return this.deck.cards
    }

    anteUp() {
        const bigBlind = this.blind * 2
        const smallBlind = this.blind
        const numberOfPlayers = this.players.length
    
        if (numberOfPlayers < 2) {
            console.error('you don\'t have enough players for a game')
            return
        }
        
        if (this.dealerIndex > numberOfPlayers -1) {
            console.error('dealerIndex is more than the number of players')
            return 
        }
    
        const bigBlindPlayerIndex = circularIncrement(numberOfPlayers,1,this.dealerIndex)
        const smallBlindPlayerIndex = circularIncrement(numberOfPlayers,2,this.dealerIndex)
    
        { // handle big blind
            this.players[bigBlindPlayerIndex].placeBet(bigBlind,'big blind')
            // this should be a method on the player
            this.pot += bigBlind
        }
        { // handle small blind
            this.players[smallBlindPlayerIndex].placeBet(smallBlind, 'small blind')
    
            this.pot += smallBlind
        }
    
        return this
    }

    dealPreFlop() {
        this.deck.shuffle()
        if (
            this.players.some(player => player.cards.length) || 
            this.communityCards.length
            ) {
            console.error('can only deal pre-flop once')
            return
        }
        for (let i = 2; i > 0; i--) {
            this.players.forEach(player => {
                console.log('dealing a card to',player.name,'at seat',player.seatNumber);
                player.cards.push(...this.deck.deal())
            })
        }
        for (const player of this.players) {
            player.decideBet(this.communityCards)
        }
        this.stage = 'preFlop'
        return this
    }
    
    dealFlop() {
        if (
            this.players.some(player => player.cards.length !== 2) || 
            this.communityCards.length
            ) {
            console.error('can only deal the flop once, after players have cards')
            return
        }
        console.log('dealing the flop');
        const burnedCard = this.deck.burn()
        this.communityCards = this.communityCards.concat(this.deck.deal(3))

        this.stage = 'flop'
        for (const player of this.players) {
            player.decideBet(this.communityCards)
        }
        return this
    }
    
    dealTurn() {
        if ( this.communityCards.length !== 3) {
            console.error(`can only deal the turn once, after the flop and before the river`)
            return // it is better to always return something
        }
        console.log('dealing the turn');
        const burnedCard = this.deck.burn()
        this.communityCards = this.communityCards.concat(this.deck.deal())
        this.stage = 'turn'
        for (const player of this.players) {
            player.decideBet(this.communityCards)
        }
        return this
    }
       
    dealRiver() {
        if ( this.communityCards.length !== 4 ) {
            console.error(`can only deal the river once, after the flop and turn`)
            return
        }
        console.log('dealing the river');
        const burnedCard = this.deck.burn()
        this.communityCards = this.communityCards.concat(this.deck.deal())
        this.stage = 'river'
        for (const player of this.players) {
            player.decideBet(this.communityCards)
        }
        return this
    }
    
    async makeBettingRound() {
        let bettingRound = 0;
        let totalMoves = 0;
        let currentRoundMoves = 0;
        let currentHighestBet = this.players.reduce((acc,cur) => cur.currentBet > acc ? cur.currentBet : acc,0)
        console.log('round fed to makebettinground',this.stage);
        for (const player of this.players) {
            //console.log(player.constructor, player.constructor === Playbot);
            if (player.constructor === Playbot) {
                currentHighestBet = this.players.reduce((acc,cur) => cur.currentBet > acc ? cur.currentBet : acc,0)
                console.log('current highest bet is',currentHighestBet)
                const decision = await player.doSomethingAsync(player.decideBet(this.communityCards, this.stage))
    
                //if (this.stage === 'preFlop') {
                    if (currentHighestBet > player.currentBet) {
                        this.pot += player.placeBet(currentHighestBet - player.currentBet,'call')
                    }
                //} else {
                //    this.pot += player.placeBet(20,'wild speculation')
    
                //
                //console.log('logging decision',decision)
            } else {
                console.log('found the human player');
                async function randomWait() {
                    const timeToWait = Math.floor(Math.random() * 1000)
                    await new Promise((resolve) => setTimeout(resolve, timeToWait))
                    return timeToWait
                }

                async function handleForm() {
                    let userInput = '';
                    console.log('Before getting the user input: ', userInput);
                    userInput = await getUserInput();
                    console.log('After getting user input: ', userInput);
                    return Number(userInput)
                  };
                  
                  function getUserInput() {
                    return new Promise((resolve, reject) => {
                      document.getElementById('bet-amount').addEventListener('keydown',(e)=>{
                        console.log('edfefe')
                        console.log(e)
                        if (e.code === 'Enter') {
                            const inputVal = Number(document.getElementById('bet-amount').value)
                            resolve(inputVal);
                          }
                    })
                      

                    });
                  };
                    const decision = await handleForm()
                    let playerWantsToBet;
                    // const decision = await new Promise((resolve) =>{
                    //     playerWantsToBet = prompt('how much do you want to throw down?')
                        
                    // })
                    console.log('logging decision',decision)
                this.pot += player.placeBet(Number(decision),'custom')
                console.log(player.name,'did a custom bet of',decision);
            }
            this.potElement.innerText = this.pot;
        }
    
        //#region old do while
        // do {
        //     totalMoves += currentRoundMoves;
        //     currentRoundMoves = 0;
        //     console.log('\nmaking some moves in round',bettingRound,'of the',this.stage);
        //     // as a player makes a move that is not a check the 
        //     // current moves increases by one
        //     // once every player has had the option to make a move
        //     // and the move count does not increase in that round
        //     // we can end the round
        //     // we can move the number of moves from current round
        //     // to moves variable and reset current round to 0 at
        //     // start of round
            
        //     this.players.forEach(player => {

        //         if (!player.folded && player.currentBet < currentHighestBet) {
        //             console.log(player.name,' is chumpin->',player.currentBet,'highest',currentHighestBet,);
        //             if ( Math.random() > 0.4 ) {
        //                 const currentDeficit = currentHighestBet - player.currentBet
        //                 const bet = Math.random() > 0.4 ? currentDeficit : 4
                        
        //                 bet === currentDeficit ? player.placeBet(bet,'call') : player.placeBet(4)
                        
        //                 this.pot += bet
        //                 currentRoundMoves++
        //                 if (player.currentBet > currentHighestBet) {
        //                     currentHighestBet = player.currentBet
        //                 } 
        //             } else  {
        //                 player.fold()
        //             }
        //         }
        //     })
        //     console.log('round',bettingRound,'currentRoundMoves',currentRoundMoves,'totalMoves',totalMoves);
        //     bettingRound++
        // }
        // while (
        //     currentRoundMoves !== 0 && bettingRound < 5
        // )
        //#endregion


        //console.log(playersArray);

        console.log('round',bettingRound,'currentRoundMoves',currentRoundMoves,'totalMoves',totalMoves);
        
        return this
    }

    decideWinner() {
        const playersStillInIt = this.players.filter(player => !player.folded)
        if (playersStillInIt.length === 1) {
            return this.players.findIndex(player => !player.folded)
        }
        let winners = [];
        let bestHand = {};
        let bestHandRank = Infinity;
    
        for (let i = 0; i < playersStillInIt.length; i++) {
            console.log(playersStillInIt[i].name,'is still in it')
            //const playerBestHand = findBestHand(playersStillInIt[i].cards,this.communityCards).highCard.card
            const playerBestHand = findBestHand(playersStillInIt[i].cards.concat(this.communityCards));
            console.log('just cards for besthand', playersStillInIt[i].cards.concat(this.communityCards),findBestHand(playersStillInIt[i].cards.concat(this.communityCards)));
            console.log(playersStillInIt[i].name,'best hand',playerBestHand);
            if (playerBestHand.rank < bestHandRank) {
                bestHandRank = playerBestHand.rank;
                bestHand = playerBestHand
                console.log('besthand was beaten by',playersStillInIt[i].name,'with',playerBestHand)
                winners = [{name:playersStillInIt[i].name, index: this.players.findIndex(player => player.name === playersStillInIt[i].name),bestHand:playerBestHand}]
            }
            else if (playerBestHand.rank === bestHandRank) {
                winners.push({name:playersStillInIt[i].name, index: this.players.findIndex(player => player.name === playersStillInIt[i].name),bestHand:playerBestHand})
            }
        }
        console.log('winners',winners);
        winners.forEach(winner => {
            console.log(winner.name,'won with',winner.bestHand.description,'oh, and they are at index',winner.index)
        })
        if (winners.length === 1) {
            console.log('going to award the winner a pot of',this.pot)
        }

        return winners
    }
    
}


// const newt = new Hand()

// newt.players

// const findBestHand = (cardsInHand = [],communityCards = []) => {
//     const allCards = cardsInHand.concat(communityCards).sort((a,b) => b.card - a.card)
//     if (!allCards.length) {
//         console.log('no cards to sort through');
//         return {highCard: {card:null,suit:null}, allCards}
//     }
//     else if (allCards.length <= 5) {
       
//         return {highCard: allCards[0], allCards}
//     }

//     return {highCard: allCards[0], allCards}
// }

// const communityCardsTestEmpty = []
// const communityCardsTest3 = [{card: 2,suit:'diamonds'},{card: 4,suit:'spades'},{card: 10,suit:'hearts'}]
// const communityCardsTest4 = [{card: 2,suit:'diamonds'},{card: 4,suit:'spades'},{card: 3,suit:'hearts'},{card: 11,suit:'clubs'}]
// const communityCardsTest5 = [{card: 2,suit:'diamonds'},{card: 4,suit:'spades'},{card: 3,suit:'hearts'},{card: 11,suit:'clubs'},{card: 12,suit:'spades'}]
// const cardsArrayEmpty = []
// const cardsArray2 = [{card: 2,suit:'hearts'},{card:7,suit:'clubs'}]

// console.log(findBestHand(cardsArrayEmpty,communityCardsTestEmpty).highCard.card);
// console.log(findBestHand(cardsArray2,communityCardsTestEmpty).highCard.card);
// console.log(findBestHand(cardsArray2,communityCardsTest3).highCard.card);
// console.log(findBestHand(cardsArray2,communityCardsTest4).highCard.card);
// console.log(findBestHand(cardsArray2,communityCardsTest5).highCard.card);



// const decideWinner = (playersArray,communityCards) => {
//     const playersStillInIt = playersArray.filter(player => !player.folded)
//     if (playersStillInIt.length === 1) {
//         return playersArray.findIndex(player => !player.folded)
//     }
//     let winners = [];
//     let bestHand = 0;



//     for (let i = 0; i < playersStillInIt.length; i++) {
//         console.log(playersStillInIt[i].name,'foo')
//         const playerBestHand = findBestHand(playersStillInIt[i].cards.concat(communityCards)).highCard.card
//         if (playerBestHand > bestHand) {
//             bestHand = playerBestHand
//             winners = [{name:playersStillInIt[i].name, index: playersArray.findIndex(player => player.name === playersStillInIt[i].name)}]
//         }
//         else if (playerBestHand === bestHand) {
//             winners.push({name:playersStillInIt[i].name, index: playersArray.findIndex(player => player.name === playersStillInIt[i].name)})
//         }
//     }
//     return winners
// }

const playersTestArray = [
    {
        name:'jijer',
        folded: false,
        cards:[
            {
                card: 2,suit:'hearts'
            },{
                card:7,suit:'clubs'
            }
        ]
    },{
        name:'philpot',
        folded: false,
        cards:[
            {
                card: 8,suit:'hearts'
            },{
                card:7,suit:'clubs'
            }
        ]
    },{
        name:'arthur',
        folded: true,
        cards:[
            {
                card: 12,suit:'hearts'
            },{
                card:7,suit:'clubs'
            }
        ]
    }
]


//decideWinner(playersTestArray,[])


//#region testing
// let playersArray = [
//     new Player('foo',100),
//     new Player('bar',100),
//     new Player('baz',100),
//     new Player('jij',100),
//   ]

  //const newHand = new Hand(playersArray);
//   console.log(newHand.deck)
//   console.log(newHand)

//   console.log(newHand.deck);
//   //newHand.addPlayers(playersArray)
//   console.log(newHand)


//   newHand.dealPreFlop()
//   console.log(newHand,newHand.deck.cards.length)
//   newHand.dealFlop()
//   console.log(newHand,newHand.deck.cards.length)
//   newHand.dealTurn()
//   console.log(newHand,newHand.deck.cards.length)
//   newHand.dealRiver()
//   console.log(newHand,newHand.deck.cards.length)

//   console.log(JSON.stringify(newHand,null,4));

//   console.log(newHand.deck)
//   console.log(newHand.newDeck())
//   console.log(newHand.deck)

//   console.log(newHand.players)
//   console.log(newHand.getPlayers())
//   console.log(newHand.addPlayers(playersArray))
//   console.log(newHand.players)
// const arr = [
//     {seatNumber: 1},
//     {seatNumber: 4},
//     {seatNumber: 6},
//     {seatNumber: null},
//     {seatNumber: null},
//     {seatNumber: null},

// ]

// const fillSeats = (players) => {
//     return players.map((player,_,arr) => {
//         let takenSeats = arr.map(player => player.seatNumber)
//         let firstFreeSeat = Array.from(' '.repeat(arr.length)).map((_,index) => {if (!takenSeats.includes(index +1)) return index + 1}).filter(elem => elem)[0]
//         console.log(firstFreeSeat);
//         if (!player.seatNumber) { 
//             console.log('empt');
//             player.seatNumber = firstFreeSeat
//         }
//         return player
//     }).sort((a,b) => a.seatNumber < b.seatNumber ? -1 : 1)
// }

//console.log(fillSeats(arr))


//#endregion

export default Hand