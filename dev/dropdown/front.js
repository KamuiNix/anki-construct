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
    const contextSplit = context.split(/(?=＿)|(?<=＿)/g);
    for (let i = 0; i < contextSplit.length; i++) {
        if (contextSplit[i] === "＿") {
            // const word = constructor.guessWords[underscore];
            const element = document.createElement("select");
            element.className = "dropdown";

            const dropdownOptions = [""].concat(
                bankSplitted[underscore].split(" ")
            );
            for (let word of dropdownOptions) {
                if (word[0] === "*") {
                    word = word.slice(1, word.length);
                }
                const opt = document.createElement("option");
                opt.text = word;
                opt.value = word;
                element.options.add(opt);
            }

            guessDiv.append(element);
            underscore++;
        } else {
            const word = contextSplit[i];
            const element = document.createElement("span");
            element.appendChild(document.createTextNode(word));
            guessDiv.append(element);
        }
    }
    const guessBtns = guessDiv.querySelectorAll(".dropdown");
    setupPopPushEvents(guessBtns);
};

const setupPopPushEvents = (dropdowns) => {
    dropdowns.forEach((dropdown, index) => {
        dropdown.onchange = (ev) => {
            // Persistence.setItem(constructor.guessWords);
            const word = ev.target.value;
            constructor.guessWords[index] = word;
        };
    });
};

const setupEvents = () => {
    const dropdowns = document.querySelectorAll(".dropdown");
    setupPopPushEvents(dropdowns);
};

const outputModel = () => {
    paintGuesses();
    setupEvents();
};

constructor.shuffle();
outputModel();
