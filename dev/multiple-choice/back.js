// if (Persistence.isAvailable()) {
const EMPTY = "";

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function sentenceToWords(splitSentence) {
    return splitSentence.split(/\s+/);
}

const guessDiv = document.querySelector(".guesses");
const bankDiv = document.querySelector(".bank");
/* const guessWords = Persistence.getItem();
    Persistence.clear(); */
const guessWords = ["ある", "いる"];

const context = "明日、銀行に行く予定が2＿";
const bankUnsplitted = "ある から いる くる する";
const bankSplitted = bankUnsplitted.split(" ");

class Constructor {
    constructor(bank) {
        this.bank = bank;
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
constructor.guessWords = guessWords;

const appendElement = (parent, elm) => {
    if (parent.lastChild) {
        parent.lastChild.after(elm);
    } else {
        parent.appendChild(elm);
    }
};

if (constructor.guessWords && guessDiv.innerHTML === "") {
    let underscore = 0;
    const idx_num = context.match(/(\d)＿/).index;
    const newContext =
        context.slice(0, idx_num) + context.slice(idx_num + 1, context.length);
    const contextSplit = newContext.split(/(?=＿)|(?<=＿)/g);
    for (let i = 0; i < contextSplit.length; i++) {
        if (contextSplit[i] === "＿") {
            const element = document.createElement("div");
            // element.className = word === EMPTY ? "empty-word" : "word-btn";
            element.className = "empty-word";
            // element.appendChild(document.createTextNode(word));
            appendElement(document.querySelector(".guesses"), element);
            underscore++;
        } else {
            const word = contextSplit[i];
            const element = document.createElement("span");
            element.appendChild(document.createTextNode(word));
            appendElement(document.querySelector(".guesses"), element);
        }
    }

    constructor.bank.forEach((word, index) => {
        const cword = constructor.guessWords[index];
        const element = document.createElement("button");
        element.className = "word-btn";
        element.className += word == cword ? " correct " : " incorrect";
        element.appendChild(document.createTextNode(word));
        appendElement(bankDiv, element);
    });
}
// }
