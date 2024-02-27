import Game from "./game.js";
import Player from "./player.js";
import { replaceInnerText } from "./helperFunctions.js";

const splashScreen = document.getElementById('splash-screen')
const splashScreenLink = document.getElementById('splash-screen-link')
const gameScreen = document.getElementById('game-screen')
const gameScreenLink = document.getElementById('game-screen-link')
const gameOverScreen = document.getElementById('game-over-screen')
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

let spinTimer;
let spin = 0;
const element = document.querySelector('#motion-path-example-span')

spinTimer = setInterval(() => {
  if (spin === 360) {
    spin = 0
  }
  element.style.offsetRotate = `${spin}deg`
  spin++
},10)

//setTimeout(() => clearInterval(spinTimer),100000)

console.log(gameOverScreen);

splashScreenLink.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden')
  gameScreen.classList.add('hidden')
  splashScreen.classList.remove('hidden')
})

gameScreenLink.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden')
  splashScreen.classList.add('hidden')
  gameScreen.classList.remove('hidden')
})

startButton.addEventListener('click', () => {
  if (!playerName) {
    playerName = prompt('what\'s your name pardner?')
  }
  game = new Game([new Player(playerName),new Player('foo'), new Player('bar'), new Player('baz')])
  playerNameSpan.innerText = playerName;
  playerPurseSpan.innerText = game.players[0].purse
  playerWinsSpan.innerText = game.players[0].wins
  playerStatsElement.classList.remove('hidden')
  console.log(game.players);
  startButton.innerText = 'Restart'
  startNewHandButton.innerText = 'Start new hand'
  replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.length || '')
  replaceInnerText(gameEventsContainer,'')
  replaceInnerText(communityCardsSpan,'')
  replaceInnerText(playerCardsSpan,'')
  
})

startNewHandButton.addEventListener('click', () => {
  console.log(game.hands.length)
  if (game.hands.length === game.round) {
    console.log('hands length equal to round');
    game.startNewHand()
    game.advanceCurrentHand()

    playerCardsSpan.innerHTML = game?.hands[game?.round]?.players[0]?.cards.map(card => `<div class="player-card-container"><img onclick="classList.toggle('player')" class="playing-card player" src="static/cardfronts_svg/${card.suit+'_'+card.card}.svg" alt="${card.card} of ${card.suit}"/></div>`).join('')
    startNewHandButton.innerText = 'Go to next stage'
    replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.filter(player => !player.folded).length)
  } 
  else if (game.hands.length < game.round) {
    console.log('hands length less than to round');
    console.log('the round is over');
    startNewHandButton.innerText = 'New hand'
    replaceInnerText(gameEventsContainer,'')
    replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.filter(player => !player.folded).length  || '')
  } 
  else {
    console.log('else condition');
    game.advanceCurrentHand()
    
    console.log('cardsinhand',game?.hands[game?.round]?.players[0]?.cards)
    console.log('community',game?.hands[game?.round]?.communityCards);
    if (game?.hands[game?.round]?.communityCards.length > 0) {
      communityCardsSpan.innerHTML = game?.hands[game?.round]?.communityCards.map(card => `<img class="playing-card community" src="static/cardfronts_svg/${card.suit+'_'+card.card}.svg" alt="${card.card} of ${card.suit}"/>`).join(' ')
    }
    playerCardsSpan.innerHTML = game?.hands[game.round]?.players[0]?.cards.map(card => `<div class="player-card-container"><img onclick="classList.toggle('player')" class="playing-card player" src="static/cardfronts_svg/${card.suit+'_'+card.card}.svg" alt="${card.card} of ${card.suit}"/></div>`).join(' ')
    replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.filter(player => !player.folded).length  || '')
  }


  //console.log(game.hands.length)
  //console.log(game.hands)
})

// Create a class for the element
class MyCustomElement extends HTMLElement {
  static observedAttributes = ["color", "size"];

  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    console.log("Custom element added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("my-custom-element", MyCustomElement);