# win-lose-poker

Howdy partner, this is a poker simulator where you can play a couple of hands against some rootin-tootin-computer-controlled players and maybe win some space dollarpounds.

## How does it work?

The game is a simple, class-based javascript app that runs in the browser. We keep track of the game state in a `Game` class, players are held in a `Player` class. Computer controlled players, `Playbots` extend the player class and add some functions to try and help them decide what to do next given a set of conditions.

During the game we try and calculate each player's probability of winning the hand. A `Playbot` will know their own probability, but, based on their temperament, one `Playbot` may interpret the probability differently from another `Playbot` in the same hand. This should hopefully make the game more interesting. If you, as a player are not so knowledgeable about the game of poker, you can enable 'training mode', in which your own probability of winning will be shown to you on the game screen.

A computer-controlled player who has lost their money will leave the game. When you have lost your money, your game will be over, however, there may be chance to win it back ...

## What else can I say?

Happy pokering

## burndown tasks

- [ ] add logic for declaring a winner based on their hand and not just because they are the last player standing (but also declare winner if only one player)
- [ ] add makeBet function to go through all the steps of deciding on and placing a bet async
- [ ] make betting round loop async
- [x] add a function calculate chen formula from the starting two cards
- [x] allow players to know their chen formula result to help making a decision on whether to bet and how much
- [ ] at the end who ever has the best hand wins the pot, handle split pot
- [ ] when the playbots run out of money, they retire
- [ ] if no playbots are left the player wins

## MVP

- [ ] can start a game
- [ ] can move through the different rounds
- [ ] betting always starts at same person
- [ ] everyone always make the same bets: first round we match the big blind, later rounds always bet 20 to speed up game
- [ ] no one folds
- [ ] when the use player runs out of money the game is over
- [ ] write a revel best hand function for a player that just returns the best hand

## bugs

- [ ] playbot stats elements should get eliminated after the restart button is clicked in the game over screen and on clicking restart in the main game screen
- [ ] total pot should be cleared on game over
