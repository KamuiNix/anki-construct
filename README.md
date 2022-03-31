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

`context` - the blank should be indicated with a `＿`. A number that represents how many answer choices they should select should reside right before the underscore.

`options` - space delimited list of answer choices

#### Example

```
Context: 明日、銀行に行く予定が2＿
Options: ある から いる くる する
```

In this case, 2 answers must be selected, so there is a 2 right befoer the underscore.
In the options, ある and から are the two right answers, so they come first in the options. The order does not matter as long as they come before the wrong answers.

## License

[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)
