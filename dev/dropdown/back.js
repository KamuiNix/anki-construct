// if (Persistence.isAvailable()) {
const EMPTY = "";

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function sentenceToWords(splitSentence) {
    return splitSentence.split(/\s+/);
}

const guessDiv = document.querySelector(".guesses");
/* const guessWords = Persistence.getItem();
    Persistence.clear(); */
const guessWords = ["は", "", "の"];

const context = "あのデパート＿、毎日＿１０時＿開店する";
const bankUnsplitted = "は へ が\n*は に\nへ の は";
const bankSplitted = bankUnsplitted.split("\n");

class Constructor {
    constructor(bank, correctSentence) {
        this.bank = bank;
        this.correctSentence = correctSentence;
        this.maxLen = (context.match(/＿/g) || []).length;
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
    const contextSplit = context.split(/(?=＿)|(?<=＿)/g);
    for (let i = 0; i < contextSplit.length; i++) {
        if (contextSplit[i] === "＿") {
            const word = constructor.guessWords[underscore];
            let correct = bankSplitted[underscore].split(" ")[0];
            if (correct[0] === "*") {
                correct = "";
            }
            const element = document.createElement(
                word == EMPTY ? "div" : "button"
            );
            element.className = word === EMPTY ? "empty-word" : "word-btn";
            element.className += word == correct ? " correct " : " incorrect";
            element.appendChild(document.createTextNode(word));
            appendElement(document.querySelector(".guesses"), element);
            underscore++;
        } else {
            const word = contextSplit[i];
            const element = document.createElement("span");
            element.appendChild(document.createTextNode(word));
            appendElement(document.querySelector(".guesses"), element);
        }
    }
}
// }
