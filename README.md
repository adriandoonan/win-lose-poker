# win-lose-poker

Howdy partner, this is a poker simulator where you can play a couple of hands against some rootin-tootin-computer-controlled players and maybe win some space dollarpounds.

You can find the game online at [win lose poker](https://adriandoonan.github.io/win-lose-poker/)

## How does it work?

The game is a simple, class-based javascript app that runs in the browser. We keep track of the game state in a `Game` class, players are held in a `Player` class. Computer controlled players, `Playbots` extend the player class and add some functions to try and help them decide what to do next given a set of conditions.

During the game we try and calculate each player's probability of winning the hand. A `Playbot` will know their own probability, but, based on their temperament, one `Playbot` may interpret the probability differently from another `Playbot` in the same hand. This should hopefully make the game more interesting. If you, as a player are not so knowledgeable about the game of poker, you can enable 'training mode', in which your own probability of winning will be shown to you on the game screen.

A computer-controlled player who has lost their money will leave the game. When you have lost your money, your game will be over, however, there may be chance to win it back ...

## What else can I say?

For deployment you need parcel, however, you should generally be able to play locally using any old web server.

## burndown tasks

- [x] add logic for declaring a winner based on their hand and not just because they are the last player standing (but also declare winner if only one player)
- [x] add makeBet function to go through all the steps of deciding on and placing a bet async
- [x] make betting round loop async
- [x] add a function calculate chen formula from the starting two cards
- [x] allow players to know their chen formula result to help making a decision on whether to bet and how much
- [x] at the end who ever has the best hand wins the pot, 
- [ ] handle split pot
- [ ] when the playbots run out of money, they retire
- [ ] if no playbots are left the player wins
- [ ] encapsulate the whole winning into a method on the player, maybe a method on the hand to declare winner that calls this

## MVP

- [x] can start a game
- [x] can move through the different rounds
- [x] betting always starts at same person
- [x] players and bots can make bets
- [x] players and playbots can fold
- [x] when the user player runs out of money the game is over
- [x] write a revel best hand function for a player that just returns the best hand

## bugs

- [x] playbot stats elements should get eliminated after the restart button is clicked in the game over screen and on clicking restart in the main game screen
- [ ] total pot should be cleared on game over
- [ ] the logic for updating the community cards is not in the hand so can't be used when auto-progressing the game on use player folding and the community cards don't update
- [x]  playbot purse not updated when they win, 
