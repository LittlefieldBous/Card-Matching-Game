var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
var CardMatchGame = /** @class */ (function () {
    // finish constructor and initialize game state and DOM element references
    // type assertions to tell TypeScript that we are sure these elements exist in the DOM
    function CardMatchGame() {
        this.cards = [];
        // Example: means only code inside this class can use GameState
        this.gameState = GameState.Waiting;
        this.attemptsLeft = 3;
        this.selected = [];
        // Initialize DOM element references
        this.gameBoard = document.querySelector('.game-board');
        this.scoreBoard = document.getElementById('attempts-left');
        this.gameOverMessage = document.getElementById('game-over-message');
        this.restartButton = document.getElementById('restart-button');
        this.startGame();
    }
    /// doesn't give back a value kust resets - use void because it doesn't return anything
    CardMatchGame.prototype.startGame = function () {
        //reset game state and attempts
        this.gameState = GameState.Playing;
        this.attemptsLeft = 0;
        this.selected = [];
        this.scoreBoard.textContent = '0';
        this.gameOverMessage.textContent = '';
        //shuffle cards and render them to the DOM
        this.cards = this.shuffleCards();
        this.renderCardsToDom();
    };
    //shuffles and helps create the cards for the game - use void because it doesn't return anything
    CardMatchGame.prototype.shuffleCards = function () {
        var cardValues = ['alligator.png', 'lion.png', 'giraffe.png'];
        var doubled = __spreadArray(__spreadArray([], cardValues, true), cardValues, true); // duplicate the card values to create pairs
        var shuffled = doubled.sort(function () { return Math.random() - 0.5; }); // shuffle the card values 50/50 chance to be positive or negative, which randomizes the order of the cards
        return shuffled.map(function (value, index) { return ({
            id: index,
            value: value,
            state: CardState.Hidden,
            element: null // will be assigned when the cards are rendered
        }); });
    };
    // updates the cards in the DOM based on their current state - use void because it doesn't return anything
    CardMatchGame.prototype.renderCardsToDom = function () {
        var _this = this;
        var cardElements = document.querySelectorAll('.backcard');
        this.cards.forEach(function (card, index) {
            card.element = cardElements[index];
            card.element.addEventListener('click', function () { return _this.handleCardClick(card.id); });
            _this.renderCard(card);
        });
    };
    // renders an individual card to the DOM - use void because it doesn't return anything
    CardMatchGame.prototype.renderCard = function (card) {
        card.element.innerHTML = ''; // Clear existing content
        if (card.state === CardState.Hidden) {
            // Card is Face Down
            card.element.innerHTML = "<img src=\"./src/card-flip-image.png\" alt=\"Card is face down\" class=\"card-image\">";
            card.element.classList.remove('visible', 'matched');
            card.element.classList.add('hidden');
            //show face up card
        }
        else if (card.state === CardState.Visible) {
            card.element.innerHTML = "<img src=\"./src/".concat(card.value, "\" alt=\"Card is face up\" class=\"card-image\">");
            card.element.classList.remove('hidden', 'matched');
            card.element.classList.add('visible');
            //front image - show matched card
        }
        else if (card.state === CardState.Matched) {
            card.element.innerHTML = "<img src=\"./src/".concat(card.value, "\" alt=\"Card is matched\" class=\"card-image\">");
            card.element.classList.remove('hidden', 'visible');
            card.element.classList.add('matched');
        }
    };
    CardMatchGame.prototype.handleCardClick = function (cardId) {
    };
    return CardMatchGame;
}()); // closes class 
// Initialize
document.addEventListener('DOMContentLoaded', function () {
    new CardMatchGame();
});
