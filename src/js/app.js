import Game from "./game.js";
import {Player,Playbot} from "./player.js";
import { replaceInnerText, clearElements } from "./helperFunctions.js";

const splashScreen = document.getElementById('splash-screen')
const splashScreenLink = document.getElementById('splash-screen-link')
const gameScreen = document.getElementById('game-screen')
const gameScreenLink = document.getElementById('game-screen-link')
const gameOverScreen = document.getElementById('game-over-screen')
const restartFromGameOverButton = document.getElementById('restart-from-game-over')
const startButton = document.getElementById('start-game-button')
const startNewHandButton = document.getElementById('start-new-hand-button')
const gameEventsContainer = document.getElementById('game-events')

let game, playerName;

const playersLeftInGameElement = document.getElementById('players-left-in-game')

const playerStatsElement = document.getElementById('player-stats')
const playerNameSpan = document.getElementById('player-name')
const playerPurseSpan = document.getElementById('player-purse')
const playerWinsSpan = document.getElementById('player-wins')
const playerCardsSpan = document.getElementById('player-cards')

const communityCardsSpan = document.getElementById('community-cards')

window.onload = function(){
    setTimeout(function(){
    document.getElementById("fadein").remove();
  },1000);
};


class SpinningCard extends HTMLElement {
  static observedAttributes = ["spin"];

  constructor() {
    // Always call super first in constructor
    super();
    this.spin = 0;
  }

  connectedCallback() {
    //console.log("Custom element added to page.");

    this.style.offsetPath = `path(\"M 0 0 C 2 8 80 400 ${Math.floor(Math.random() * 800)} ${Math.floor(Math.random() * 800)}\")`
    let spinTimer = setInterval(() => {
      if (this.spin === 360) {
        this.spin = 0
      }
      this.style.offsetRotate = `${this.spin}deg`
      this.spin += Math.floor(Math.random() * 5)
    },10)

    let selfDestructTimer = setTimeout(() => {
      this.remove()
    },8000)
  }

  disconnectedCallback() {
    //console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    //console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(`Attribute ${name} has changed. from`,oldValue,'to',newValue);
  }
}

customElements.define("spinning-card", SpinningCard);



let nextInterval = 2000;
const cardSpinnerFunc = () => {
  const newCard = document.createElement('spinning-card')
  document.getElementById('motion-path-test').appendChild(newCard)
  nextInterval = Math.floor(Math.random() * 6000 + 1000)
}

let cardThowTimer = setInterval(cardSpinnerFunc,nextInterval)



splashScreenLink.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden')
  gameScreen.classList.add('hidden')
  splashScreen.classList.remove('hidden')
  cardThowTimer = setInterval(cardSpinnerFunc,nextInterval)
})

gameScreenLink.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden')
  splashScreen.classList.add('hidden')
  clearInterval(cardThowTimer)
  gameScreen.classList.remove('hidden')
})

startButton.addEventListener('click', () => {
  if (!playerName) {
    playerName = prompt('what\'s your name pardner?')
  }
  game = new Game([new Player(playerName,100, playerPurseSpan),new Playbot('foo'), new Playbot('bar'), new Playbot('baz'), new Playbot('jij')])
  playerNameSpan.innerText = playerName;
  playerPurseSpan.innerText = game.players[0].purse
  playerWinsSpan.innerText = game.players[0].wins
  playerStatsElement.classList.remove('hidden')
  console.log(game.players);
  startButton.innerText = 'Restart'
  startNewHandButton.disabled = false
  startNewHandButton.innerText = 'Start new hand'
  replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.length || '')
  clearElements(gameEventsContainer, communityCardsSpan, playerCardsSpan)
  game.introduce()
  
})

startNewHandButton.addEventListener('click', () => {
  console.log(game.hands.length)
  if (game.hands.length === game.round) {
    console.log('hands length equal to round');
    game.startNewHand()

    if (!playerCardsSpan.innerText) {
      playerCardsSpan.innerHTML = game?.hands[game?.round]?.players[0]?.cards.map(card => `<div class="player-card-container"><img onclick="classList.toggle('player')" class="playing-card player" src="static/cardfronts_svg/${card.suit+'_'+card.card}.svg" alt="${card.card} of ${card.suit}"/></div>`).join('')
    }
    startNewHandButton.innerText = 'Go to next stage'
    replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.filter(player => !player.folded).length)
  } 
  else if (game.hands.length < game.round) {
    console.log('hands length less than to round');
    console.log('the round is over');
    clearElements(playerCardsSpan,communityCardsSpan)
    startNewHandButton.innerText = 'New hand'
    replaceInnerText(gameEventsContainer,'')
    replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.filter(player => !player.folded).length  || '')
  } 
  else {
    console.log('else condition');
    game.advanceCurrentHand()
    const roundCardsInHand = game?.hands[game?.round]?.players[0]?.cards
    const roundCommunityCards = game?.hands[game?.round]?.communityCards
    
    console.log('cardsinhand',roundCardsInHand)
    console.log('community',roundCommunityCards);
    if (roundCommunityCards?.length > 0) {
      communityCardsSpan.innerHTML = roundCommunityCards.map(card => `<img class="playing-card community" src="static/cardfronts_svg/${card.suit+'_'+card.card}.svg" alt="${card.card} of ${card.suit}"/>`).join(' ')
    } 
    if (roundCardsInHand?.length > 0) {
      playerCardsSpan.innerHTML = roundCardsInHand.map(card => `<div class="player-card-container"><img onclick="classList.toggle('player')" class="playing-card player" src="static/cardfronts_svg/${card.suit+'_'+card.card}.svg" alt="${card.card} of ${card.suit}"/></div>`).join(' ')
    } 

    replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.filter(player => !player.folded).length  || '')
  }
})

restartFromGameOverButton.addEventListener('click', () => {
  if (!playerName) {
    playerName = prompt('what\'s your name pardner?')
  }
  replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.length || '')
  clearElements(gameEventsContainer, communityCardsSpan, playerCardsSpan)
  playerNameSpan.innerText = playerName;
  playerPurseSpan.innerText = game.players[0].purse
  playerWinsSpan.innerText = game.players[0].wins
  startNewHandButton.innerText = 'Start new hand'
  gameOverScreen.classList.add('hidden')
  gameScreen.classList.remove('hidden')
  game = new Game([new Player(playerName,100, playerPurseSpan),new Playbot('foo'), new Playbot('bar'), new Playbot('baz'), new Playbot('jij')])
  game.introduce()
})