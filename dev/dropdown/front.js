const EMPTY = "";

const bankDiv = document.querySelector(".bank");
const guessDiv = document.querySelector(".guesses");

const context = "あのデパート＿、毎日＿１０時＿開店する";
const bank = "は へ が\n*は に\nへ の は".split("\n");

class Constructor {
    constructor(bank) {
        this.bank = bank;
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
        this.bank.sort(() => Math.random() - 0.5);
    }

    findWord(list, query) {
        return list.findIndex((word) => word === query);
    }

    findEmpty(list) {
        return this.findWord(list, EMPTY);
    }

    findGuess(query) {
        return this.findWord(this.guessWords, query);
    }

    findBank(query) {
        return this.findWord(this.bank, query);
    }

    removeFromBank(word) {
        const indx = this.findBank(word);
        this.bank[indx] = EMPTY;
    }

    addToBank(word) {
        const emptySpot = this.findEmpty(this.bank);
        this.bank[emptySpot] = word;
    }

    // Inserts a guess at the leftmost empty spot
    insert(word) {
        const insIndex = this.findEmpty(this.guessWords);
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
            if (curr === EMPTY) {
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

const constructor = new Constructor([...bank]);

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

            const dropdownOptions = [""].concat(bank[underscore].split(" "));
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
            const word = ev.target.value;
            constructor.guessWords[index] = word;
            // Persistence.setItem(constructor.guessWords);
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
