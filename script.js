const EMPTY = "";

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function sentenceToWords(splitSentence) {
    return splitSentence.split(/\s+/);
}
const bankDiv = document.querySelector(".bank");
const beforeSpan = document.querySelector(".before");
const guessDiv = document.querySelector(".guesses");
const afterSpan = document.querySelector(".after");
const analysisDiv = document.querySelector(".analysis");

const checkBtn = document.querySelector(".check");
const resetBtn = document.querySelector(".reset");

class Constructor {
    constructor(before, after, bank, correctSentence) {
        this.before = before;
        this.after = after;
        this.bank = bank;
        this.correctSentence = correctSentence;
        this.maxLen = this.bank.length;
        // Uses empty string for blanks
        this.guessWords = Array(this.maxLen).fill(EMPTY);
    }

    shuffle() {
        shuffle(this.bank);
    }

    findGuess(query) {
        return this.guessWords.findIndex((word) => word === query);
    }

    findBank(query) {
        return this.bank.findIndex((word) => word === query);
    }

    removeFromBank(word) {
        const indx = this.findBank(word);
        this.bank[indx] = EMPTY;
    }

    addToBank(word) {
        const emptySpot = this.bank.findIndex((word) => word === EMPTY);
        this.bank[emptySpot] = word;
    }

    // Inserts a guess at the leftmost empty spot
    insert(word) {
        const insIndex = this.guessWords.findIndex((word) => word === EMPTY);
        this.guessWords[insIndex] = word;
        this.removeFromBank(word);
    }

    // Removes guess at given position and moves empty guesses to the end
    remove(word) {
        this.addToBank(word);
        const index = this.findGuess(word);
        if (index < 0) {
            return;
        }
        this.guessWords[index] = EMPTY;
        this.guessWords.sort((elm) => {
            if (elm === EMPTY) {
                return 1;
            }
            return -1;
        });
    }

    // Returns false for incorrect, true for correct
    check() {
        const guess =
            this.before +
            this.guessWords.filter((word) => word !== EMPTY).join("") +
            this.after;
        return this.correctSentence === guess;
    }

    // Clears guesses
    reset() {
        // Place back the guesses into the bank
        this.guessWords.forEach((word) => {
            if (word !== EMPTY) {
                this.addToBank(word);
            }
        });
        this.guessWords = Array(this.maxLen).fill(EMPTY);
    }
}

const before = "{{Before}}";
const after = "{{After}}";
const correct = "{{Correct}}";
const bankUnsplitted = "{{Options}}";
const bankSplitted = bankUnsplitted.split(" ");

const constructor = new Constructor(before, after, bankSplitted, correct);

const appendElement = (parent, elm) => {
    if (parent.lastChild) {
        parent.lastChild.after(elm);
    } else {
        parent.appendChild(elm);
    }
};

const paintGuesses = () => {
    guessDiv.innerHTML = "";
    constructor.guessWords.forEach((word) => {
        const element = document.createElement(
            word == EMPTY ? "div" : "button"
        );
        element.className = word === EMPTY ? "empty-word" : "word-btn";
        element.appendChild(document.createTextNode(word));
        guessDiv.append(element);
    });
    const guessBtns = guessDiv.querySelectorAll(".word-btn");
    setupPopPushEvents(guessBtns);
};

const paintBank = () => {
    bankDiv.innerHTML = "";
    constructor.bank.forEach((word) => {
        const element = document.createElement("button");
        element.className = "word-btn";
        element.appendChild(document.createTextNode(word));
        bankDiv.append(element);
    });
};

const setupPopPushEvents = (buttons) => {
    buttons.forEach((btn) => {
        btn.onclick = (ev) => {
            const word = ev.target.textContent;
            if (ev.target.parentNode.className === "guesses") {
                // Pop the element
                constructor.remove(word);
                appendElement(bankDiv, btn);
            } else {
                // Add to guesses
                constructor.insert(word);
                appendElement(guessDiv, btn);
            }
            paintGuesses();
        };
    });
};

const setupEvents = () => {
    const btns = document.querySelectorAll(".word-btn");
    setupPopPushEvents(btns);
};

const outputModel = (model) => {
    beforeSpan.innerHTML = model.before;
    afterSpan.innerHTML = model.after;

    paintGuesses();
    paintBank();

    setupEvents();
};

resetBtn.onclick = (ev) => {
    constructor.reset();

    const guessBtns = guessDiv.querySelectorAll("button");
    guessBtns.forEach((btn) => {
        appendElement(bankDiv, btn);
    });
    constructor.shuffle();

    outputModel(constructor);
};

checkBtn.onclick = (ev) => {
    const isCorrect = constructor.check();
    if (isCorrect) {
        analysisDiv.style.color = "#b8bb26";
        analysisDiv.innerHTML = "Correct!";
    } else {
        analysisDiv.style.color = "#ca4e4e";
        analysisDiv.innerHTML = "Incorrect";
    }
    analysisDiv.innerHTML = isCorrect ? "Correct!" : "Incorrect";
};

constructor.shuffle();
outputModel(constructor);
