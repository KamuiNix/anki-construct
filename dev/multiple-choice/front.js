const EMPTY = "";

const bankDiv = document.querySelector(".bank");
const guessDiv = document.querySelector(".guesses");
const analysisDiv = document.querySelector(".analysis");
const resetBtn = document.querySelector(".reset");

const context = "明日、銀行に行く予定が2＿";
const bank = "ある から いる くる する".split(" ");

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
            console.log(constructor.guessWords);
        };
    });
};

const setupEvents = () => {
    const btns = document.querySelectorAll(".word-btn");
    setupPopPushEvents(btns);
};

const outputModel = () => {
    paintGuesses();
    paintBank();
    setupEvents();
};

resetBtn.onclick = () => {
    constructor.reset();

    const guessBtns = guessDiv.querySelectorAll("button");
    guessBtns.forEach((btn) => {
        appendElement(bankDiv, btn);
    });

    constructor.shuffle();
    outputModel(constructor);
};

constructor.shuffle();
outputModel();
