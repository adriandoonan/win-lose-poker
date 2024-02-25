# Win Lose Poker

A game that simulates poker with a dealer, a user player and a couple of computer players.

---

## Basic functionality

- A round starts and all players ante up. <!-- .element: class="fragment" data-fragment-index="2" -->
- A dealer deals cards to the players. <!-- .element: class="fragment" data-fragment-index="3" -->
- Players take turns to bet, call or fold. <!-- .element: class="fragment" data-fragment-index="4" -->
- Whoever either wins or is the last player in the hand wins the pot. <!-- .element: class="fragment" data-fragment-index="5" -->
- If a player has no more money, they leave the table. <!-- .element: class="fragment" data-fragment-index="6" -->
- If the user player has no more money the game is over. <!-- .element: class="fragment" data-fragment-index="7" -->


For the MVP, a game can consist of one hand and no animations.
<!-- .element: class="fragment" data-fragment-index="8" -->

---

## Win lose logic

I have some code on this slide

```javascript[1-2|3-4|5]
let x;
x = 'jij'
const greet = name => console.log(`Hello ${name || 'fwend'}`)
greet(x)
x = '';
```

---

## How will the screens look?

Like this


---

## What is the theme?

![Mario knows](img/mario_thumbs_up_wii_by_mariorenderart_dg18ue9-pre.jpg)

poker is a game

---

## Can you use mermaid from markdown?

<div class="mermaid">
    <pre>
    classDiagram
        note "From Duck till Zebra"
        Animal : +int age
        Animal : +String gender
        Animal: +isMammal()
        Animal: +mate()
    </pre>
</div>

---

## can you use mermaid from markdown 1

<div class="mermaid">
    <pre>
    classDiagram
        note "From Duck till Zebra"
        Animal <|-- Duck
        note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
        Animal : +int age
        Animal : +String gender
        Animal: +isMammal()
        Animal: +mate()
        class Duck{
            +String beakColor
            +swim()
            +quack()
        }
    </pre>
</div>

---

## Can you use mermaid from markdown 2

<div class="mermaid">
    <pre>
    classDiagram
        note "From Duck till Zebra"
        Animal <|-- Duck
        note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
        Animal <|-- Fish
        Animal : +int age
        Animal : +String gender
        Animal: +isMammal()
        Animal: +mate()
        class Duck{
            +String beakColor
            +swim()
            +quack()
        }
        class Fish{
            -int sizeInFeet
            -canEat()
        }
    </pre>
</div>

---

## Can you use mermaid from markdown 3

<div class="mermaid">
    <pre>
    classDiagram
        <!-- note "From Duck till Zebra"
        Animal <|-- Duck
        note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
        Animal <|-- Fish
        Animal <|-- Zebra
        Animal : +int age
        Animal : +String gender
        Animal: +isMammal()
        Animal: +mate()
        class Duck{
            +String beakColor
            +swim()
            +quack()
        }
        class Fish{
            -int sizeInFeet
            -canEat()
        }
        class Zebra{
            +bool is_wild
            +run()
        } -->
        class Game{
            +Array~obj~ players
            +Array~obj~ hands
            +addPlayer(player)
            +startHand(hand)
        }
        class Player{
            +int player
            +String name
            +int purse
            +int currentBet
            +bool folded
            +Array~obj~ cards
            makeBet(round)
            buyBack()
        }
        class Hand{
            +Array~obj~ players
            +Array~obj~ communityCards
            +int round
            +int totalMoves
            +int currentRoundMoves
            +int pot
            +int dealerIndex
            anteUp()
            makeBettingRound()
            dealPreFlop()
            dealFlop()
            dealTurn()
            dealRiver()
        }
        Game --> Player
        Game --> Hand
    </pre>
</div>
