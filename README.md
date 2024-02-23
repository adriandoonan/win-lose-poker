# win-lose-poker

Howdy partner, this is a poker simulator where you can play a couple of hands against some rootin-tootin-computer-controlled players and maybe win some space dollarpounds.

## How does it work?

The game is a simple, class-based javascript app that runs in the browser. We keep track of the game state in a `Game` class, players are held in a `Player` class. Computer controlled players, `Playbots` extend the player class and add some functions to try and help them decide what to do next given a set of conditions.

During the game we try and calculate each player's probability of winning the hand. A `Playbot` will know their own probability, but, based on their temperament, one `Playbot` may interpret the probability differently from another `Playbot` in the same hand. This should hopefully make the game more interesting. If you, as a player are not so knowledgeable about the game of poker, you can enable 'training mode', in which your own probability of winning will be shown to you on the game screen.

A computer-controlled player who has lost their money will leave the game. When you have lost your money, your game will be over, however, there may be chance to win it back ...

## What else can I say?

Happy pokering