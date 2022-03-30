const EMPTY = "";

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function sentenceToWords(splitSentence) {
    return splitSentence.split(/\s+/);
}

const bankDiv = document.querySelector(".bank");
const guessDiv = document.querySelector(".guesses");
const analysisDiv = document.querySelector(".analysis");
const resetBtn = document.querySelector(".reset");

const context = "明日、銀行に行く予定が2＿";
const bankUnsplitted = "ある から いる くる する";
const bankSplitted = bankUnsplitted.split(" ");

class Constructor {
    constructor(bank, correctSentence) {
        this.bank = bank;
        this.correctSentence = correctSentence;
        this.maxLen = parseInt(context.match(/(\d)＿/)[1]);
        // Uses empty string for blanks
        this.guessWords = Array(this.maxLen).fill(EMPTY);
    }

    isFull() {
        return (
            this.guessWords.filter((word) => word !== EMPTY).length ===
            this.maxLen
        );
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
        for (let x = 0; x < this.guessWords.length; x++) {
            const curr = this.guessWords[x];
            if (curr == EMPTY) {
                this.guessWords.push(this.guessWords.splice(x, 1)[0]);
            }
        }
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

const constructor = new Constructor([...bankSplitted]);

const appendElement = (parent, elm) => {
    if (parent.lastChild) {
        parent.lastChild.after(elm);
    } else {
        parent.appendChild(elm);
    }
};

const paintGuesses = () => {
    guessDiv.innerHTML = "";
    let underscore = 0;
    const idx_num = context.match(/(\d)＿/).index;
    const newContext =
        context.slice(0, idx_num) + context.slice(idx_num + 1, context.length);
    const contextSplit = newContext.split(/(?=＿)|(?<=＿)/g);
    for (let i = 0; i < contextSplit.length; i++) {
        if (contextSplit[i] === "＿") {
            const word = constructor.guessWords[underscore];
            const element = document.createElement(
                word == EMPTY ? "div" : "button"
            );
            element.className = "empty-word";
            guessDiv.append(element);
            underscore++;
        } else {
            const word = contextSplit[i];
            const element = document.createElement("span");
            element.appendChild(document.createTextNode(word));
            guessDiv.append(element);
        }
    }
    const guessBtns = guessDiv.querySelectorAll(".word-btn");
    setupPopPushEvents(guessBtns);
};

const paintBank = () => {
    bankDiv.innerHTML = "";
    constructor.bank.forEach((word) => {
        const element = document.createElement("button");
        element.className = "word-btn";
        element.appendChild(document.createTextNode(word));
        appendElement(bankDiv, element);
    });
};

const setupPopPushEvents = (buttons) => {
    buttons.forEach((btn) => {
        btn.onclick = (ev) => {
            // Persistence.setItem(constructor.guessWords);
            const word = ev.target.textContent;
            if (ev.target.classList.contains("outline")) {
                // Pop the element
                constructor.remove(word);
                btn.classList.remove("outline");
            } else if (!constructor.isFull()) {
                // Add to guesses
                constructor.insert(word);
                btn.classList.add("outline");
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

constructor.shuffle();
outputModel(constructor);