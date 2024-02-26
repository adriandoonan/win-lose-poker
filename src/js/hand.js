import Player from "./player.js";
import { knuthShuffle } from "./helperFunctions.js";

class Deck {

    constructor() {
        this.cards = function() {
            const suits = ['spades','diamonds','clubs','hearts']
            const cardValues = [2,3,4,5,6,7,8,9,10,11,12,13, 14]
            let deck = [];
            for (const suit of suits) {
                for (const card of cardValues) {
                    deck.push({suit,card})
                }
            }
            return deck
          }();
          
    }
    acesLow() {
        this.cards = this.cards.map(card => card.card === 14 ? {...card,card:1} : card)
        return this.cards
    }
    shuffle() {
        this.cards = knuthShuffle(this.cards)
        return this.cards
    }
    burn() {
        this.cards.pop()
        return this.cards
    }
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
    constructor(players) {
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
            this.players.forEach(player => player.cards.push(this.deck.deal()))
        }
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
        const burnedCard = this.deck.burn()
        this.communityCards = this.communityCards.concat(this.deck.deal(3))

        return this
      }
    
    dealTurn() {
        if ( this.communityCards.length !== 3) {
            console.error(`can only deal the turn once, after the flop and before the river`)
            return // it is better to always return something
        }
        const burnedCard = this.deck.burn()
        this.communityCards = this.communityCards.concat(this.deck.deal())
        return this
      }
       
    dealRiver() {
        if ( this.communityCards.length !== 4 ) {
            console.error(`can only deal the river once, after the flop and turn`)
            return
        }
        const burnedCard = this.deck.burn()
        this.communityCards = this.communityCards.concat(this.deck.deal())
        return this
      }
}


// const newt = new Hand()

// newt.players


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