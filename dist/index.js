"use strict";
var CardState;
(function (CardState) {
    CardState[CardState["Hidden"] = 0] = "Hidden";
    CardState[CardState["Visible"] = 1] = "Visible";
    CardState[CardState["Matched"] = 2] = "Matched"; //card is matched and removed from the game 2
})(CardState || (CardState = {}));
var GameState;
(function (GameState) {
    GameState["Waiting"] = "waiting";
    GameState["Playing"] = "playing";
    GameState["Won"] = "won";
    GameState["Lost"] = "lost";
})(GameState || (GameState = {}));
// create a blueprint for the Card Match Game
// using private properties and methods to encapsulate the game logic and state management - cut down on bugs 
class CardMatchGame {
    // finish constructor and initialize game state and DOM element references
    // type assertions to tell TypeScript that we are sure these elements exist in the DOM
    constructor() {
        this.cards = [];
        // Example: means only code inside this class can use GameState
        this.gameState = GameState.Waiting;
        this.attemptsLeft = 0;
        this.selected = [];
        // Initialize DOM element references
        this.gameBoard = document.querySelector('.game-board');
        this.scoreBoard = document.getElementById('attempts-left');
        this.gameOverMessage = document.getElementById('game-over-message');
        this.restartButton = document.getElementById('restart-button');
        // Add event listener to restart button
        this.restartButton.addEventListener('click', () => this.startGame());
        this.startGame();
    }
    /// doesn't give back a value kust resets - use void because it doesn't return anything
    startGame() {
        //reset game state and attempts
        this.gameState = GameState.Playing;
        this.attemptsLeft = 0;
        this.selected = [];
        this.scoreBoard.textContent = '0';
        this.gameOverMessage.parentElement.style.display = "none"; // hide the game over message container
        //shuffle cards and render them to the DOM
        this.cards = this.shuffleCards();
        this.renderCardsToDom();
    }
    //shuffles and helps create the cards for the game - use void because it doesn't return anything
    shuffleCards() {
        const cardValues = ['alligator.png', 'lion.png', 'giraffe.png'];
        const doubled = [...cardValues, ...cardValues]; // duplicate the card values to create pairs
        const shuffled = doubled.sort(() => Math.random() - 0.5); // shuffle the card values 50/50 chance to be positive or negative, which randomizes the order of the cards
        return shuffled.map((value, index) => ({
            id: index,
            value,
            state: CardState.Hidden,
            element: null // will be assigned when the cards are rendered
        }));
    }
    // updates the cards in the DOM based on their current state - use void because it doesn't return anything
    renderCardsToDom() {
        const cardElements = document.querySelectorAll('.backcard');
        this.cards.forEach((card, index) => {
            card.element = cardElements[index];
            card.element.addEventListener('click', () => this.handleCardClick(card.id));
            this.renderCard(card);
        });
    }
    // renders an individual card to the DOM - use void because it doesn't return anything
    renderCard(card) {
        card.element.innerHTML = ''; // Clear existing content
        if (card.state === CardState.Hidden) {
            // Card is Face Down
            card.element.innerHTML = `<img src="./src/card-flip-image.png" alt="Card is face down" class="card-image">`;
            card.element.classList.remove('visible', 'matched');
            card.element.classList.add('hidden');
            //show face up card
        }
        else if (card.state === CardState.Visible) {
            card.element.innerHTML = `<img src="./src/${card.value}" alt="Card is face up" class="card-image">`;
            card.element.classList.remove('hidden', 'matched');
            card.element.classList.add('visible');
            //front image - show matched card
        }
        else if (card.state === CardState.Matched) {
            card.element.innerHTML = `<img src="./src/${card.value}" alt="Card is matched" class="card-image">`;
            card.element.classList.remove('hidden', 'visible');
            card.element.classList.add('matched');
        }
    }
    // dont allow the player to click on more than two cards at a time or click on already matched cards - use void because it doesn't return anything
    handleCardClick(cardId) {
        // only allow clicks when the game is in the playing state
        if (this.gameState !== GameState.Playing)
            return;
        if (this.selected.length >= 2)
            return; // prevent clicking more than two cards
        const card = this.cards.find(c => c.id === cardId);
        if (!card || card.state !== CardState.Hidden)
            return; // prevent clicking on visible or matched cards
        if (this.selected.indexOf(cardId) !== -1)
            return; // prevent clicking the same card twice
        // flip the card to visible
        card.state = CardState.Visible;
        this.renderCard(card);
        this.selected.push(cardId);
        // check for a match if two cards are selected
        if (this.selected.length === 2) {
            this.checkForMatch();
        }
    }
    checkForMatch() {
        this.attemptsLeft++;
        this.scoreBoard.textContent = String(this.attemptsLeft);
        const [card1, card2] = this.selected.map(id => this.cards.find(c => c.id === id));
        if (card1.value === card2.value) {
            // Cards match
            card1.state = CardState.Matched;
            card2.state = CardState.Matched;
            this.renderCard(card1);
            this.renderCard(card2);
            this.selected = [];
            this.checkWinCondition();
        }
        else {
            // Cards do not match - flip them back after a short delay
            setTimeout(() => {
                card1.state = CardState.Hidden;
                card2.state = CardState.Hidden;
                this.renderCard(card1);
                this.renderCard(card2);
                this.selected = [];
                this.checkLoseCondition();
            }, 1000); // 1 second delay before flipping back
        }
    }
    // check win and check lose functions
    checkWinCondition() {
        const allCardsMatched = this.cards.every(c => c.state === CardState.Matched);
        if (allCardsMatched) {
            this.gameState = GameState.Won;
            this.gameOverMessage.textContent = "Congratulations! You won!";
            this.gameOverMessage.parentElement.style.display = "flex";
        }
    }
    checkLoseCondition() {
        if (this.attemptsLeft >= 3) {
            this.gameState = GameState.Lost;
            this.gameOverMessage.textContent = "Game Over! You lost.";
            this.gameOverMessage.parentElement.style.display = "flex";
        }
    }
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CardMatchGame();
});
