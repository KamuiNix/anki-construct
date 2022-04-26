# Struct

A modern, interactive sentence-oriented Anki note-type for drilling vocabulary, grammar, particles, and others with an emphasis on recall.

## Features

-   Drop down fill in the blanks
-   Multiple choice questions with variable number of correct answers
-   Order the words from a bank
-   Cross-platform and responsive
-   Intuitive UI

## Installation

1. Download the apkg file from the latest release.
2. Import it into anki to load in the construct note type.

## Usage

This note type includes only 2 fields: context and options.
Context is for specifying the surrounding context words for each blank in the sentence.
Options is a delimited list indicating the available options for the blanks, but the behavior and format may vary across cards. More on that below.

The note type comes with 3 different cards. A card is essentially a different representation of the fields in the note type.
The three cards are order-bank, dropdown, and multiple-choice. Configuration and instructions for each type is documented below.

### Order bank

`context` - should contain the unicode underscore character `＿` to indicate `N` number of blanks.

`options` - holds a list of words delimited by a space. This is what shows up in the bank.
It should be noted that the options should be in the **correct order** for all `N` blanks.
The note type relies on this ordering to display the correct answers in the back.

#### Example

```
Context: なかなか＿が取れなくて＿レストランに＿行けることになった。
Options: 予約 行けなかった ようやく
```

In the field data, `options` is in the correct order.
However, the bank options will be shuffled while viewing the card.

### Dropdown

`context` - similarly to order-bank, this should contain `＿` for each dropdown location.

`options` - newline (`\n`) delimited list of option lists. Each option list is space delimited.
If the dropdown's correct answer is just simply a blank, mark the beginning of the specific line with an asterisk (`*`).
The first item in each option list should be the correct answer.

#### Example

```
Context: あのデパート＿、毎日＿１０時＿開店する
Options: は へ が\n*は に\nへ の は
```

The second dropdown's correct answer is to leave it blank, hence the asterisk.

### Multiple choice

This card type is intended to have a single blank only, but also supports multiple answers. In the back, correct answers for the missed ones are highlighted in purple.

`context` - the blank should be indicated with a `＿`.

-   A number that represents how many answer choices they should select should reside right before the underscore.

-   You can also specify whether or not to display the empty box with an "H" right before the choice length. For example, `H1＿` can be used for a single choice prompt where a blank would be unnecessary.

`options` - space delimited list of answer choices

#### Example

```
Context: 明日、銀行に行く予定が2＿
Options: ある から いる くる する
```

In this case, 2 answers must be selected, so there is a 2 right befoer the underscore.
In the options, ある and から are the two right answers, so they come first in the options. The order does not matter as long as they come before the wrong answers.

## Source code architecture

Developing javascript-heavy note types for Anki requires a different approach than developing a traditional website.
Since Anki only offers a small pane with a plain notepad-like editor to quickly edit the HTML, CSS, and JS, it is unsuitable for developing larger scale note types.

For this reason, this repository contains an `anki/` and `dev/` directory. `anki/` is intended to hold the final production code for the note type, with small modifications such as Persistence.
`dev/` contains multple sub-directories for each card and those directories contain the browser-version of the code.

By developing the note type like a regular website, the process is much more streamlined and efficient because of access to debuggers, devtools, a proper editor, and more.
After a period of development, testing, refactoring, and documentation, `dev/` is then ported back into anki, where `anki/` will be consequently updated.

### Persistence

The only dependency for the project is [Persistence](https://github.com/SimonLammer/anki-persistence), which is a small javascript library for passing data from the front to the back. Struct uses this to save the guesses inputted by the user, so the back portion of the card can grade and visually indicate the correct and missed answer choices.

### Constructor

This is a class the note type is dependant upon because it serves as the model and controller for the view (HTML interface). For each card type, the constructor is modified as necessary.
Supported operations include adding to bank, removal, queries, reset, and more.

## License

[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)
