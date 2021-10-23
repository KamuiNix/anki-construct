const EMPTY = "";

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function sentenceToWords(splitSentence) {
    return splitSentence.split(/\s+/);
}

class Constructor {
    constructor(before, after, bank, correctSentence) {
        this.before = before;
        this.after = after;
        this.bank = bank;
        this.correctSentence = correctSentence;
        // Uses empty string for blanks
        this.guessWords = Array(this.bank.length - 1).fill(EMPTY);
    }

    // Inserts a guess at the leftmost empty spot
    insert(word) {
        const insIndex = this.guessWords.find(EMPTY);
        this.guessWords[insIndex] = word;
    }

    // Removes guess at given position and moves empty guesses to the end
    remove(position) {
        this.guessWords[position] = EMPTY;
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
            this.before + this.guessWords.filter(EMPTY).join("") + this.after;
        return this.correctSentence === guess;
    }

    // Clears guesses
    reset() {
        // Place back the guesses into the bank
        this.guessWords.forEach((word) => {
            if (word !== EMPTY) {
                this.bank.push(word);
            }
        });
        this.guessWords = [];
    }
}
