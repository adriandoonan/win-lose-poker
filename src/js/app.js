import Game from "./game.js";
import {Player,Playbot} from "./player.js";
import { replaceInnerText, clearElements } from "./helperFunctions.js";
import {SpinningCard, PlayingCard, PlaybotStats} from './custom-elements.js'

customElements.define("playing-card", PlayingCard);
customElements.define("spinning-card", SpinningCard);
customElements.define("playbot-stats", PlaybotStats);

const splashScreen = document.getElementById('splash-screen')
const splashScreenLink = document.getElementById('splash-screen-link')
const gameScreen = document.getElementById('game-screen')
const gameScreenLink = document.getElementById('game-screen-link')
const gameOverScreen = document.getElementById('game-over-screen')
const restartFromGameOverButton = document.getElementById('restart-from-game-over')
const startButton = document.getElementById('start-game-button')
const startNewHandButton = document.getElementById('start-new-hand-button')
const gameEventsContainer = document.getElementById('game-events')
const darkModeToggle = document.getElementById('don-shades')


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


const dialog = document.querySelector("dialog");
const dialogText = document.querySelector('dialog p')
const dialogCloseButton = document.querySelector("dialog button");


// "Close" button closes the dialog
dialogCloseButton.addEventListener("click", () => {
  dialog.close();
});





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
  document.querySelectorAll('playbot-stats').forEach(element => element.remove())
  if (!playerName) {
    playerName = prompt('what\'s your name pardner?')
  }
  game = new Game([new Player(playerName,100, playerPurseSpan),new Playbot('foo'), new Playbot('bar'), new Playbot('baz'), new Playbot('victoria coren')])
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
    game.advanceCurrentHand()

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
  document.querySelectorAll('playbot-stats').forEach(element => element.remove())
  replaceInnerText(playersLeftInGameElement,game?.hands[game?.round]?.players.length || '')
  clearElements(gameEventsContainer, communityCardsSpan, playerCardsSpan)
  playerNameSpan.innerText = playerName;
  playerPurseSpan.innerText = ''
  playerWinsSpan.innerText = game.players[0].wins
  startNewHandButton.innerText = 'Start new hand'
  gameOverScreen.classList.add('hidden')
  gameScreen.classList.remove('hidden')
  game = new Game([new Player(playerName,100, playerPurseSpan),new Playbot('foo'), new Playbot('bar'), new Playbot('baz'), new Playbot('jij')])
  game.introduce()
})

darkModeToggle.addEventListener('click',() => {
  document.body.classList.toggle('dark')
})



async function handleClick() {
  await new Promise((resolve) =>
                    setTimeout(resolve, 5000))
  alert('clicked')
}


/* <article id="decision-section">
<button id="made-a-decision-button">decided</button>
<button id="place-bet-button">bet</button>
<button id="fold-button">fold</button>
<input type="text" id="bet-amount" default="how much do you want to pony up">
</article> */

const decisionSection = document.getElementById('decision-section')
const placeBetButton = document.getElementById('place-bet-button')
const foldButton = document.getElementById('fold-button')
const betAmountInput = document.getElementById('bet-amount')

// decisionSection.addEventListener('click', (e) => {
//   console.log('something was clicked in the decision section',e);
//   console.log('this was in the input',betAmountInput.value);
//   console.log('this was the button',e.target.getAttribute('id'))
// })

placeBetButton.addEventListener('click',() => {
  console.log('the place bet button was clicked');
  console.log('this was in the input',betAmountInput.value);
  return {button: 'place-bet',amount: Number(betAmountInput.value)}
})
foldButton.addEventListener('click',() => {
  console.log('the fold button was clicked');
  console.log('this was in the input',betAmountInput.value);
  return {button: 'fold',amount: Number(betAmountInput.value)}
})
