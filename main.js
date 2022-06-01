document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [
        []
    ];
    let availableSpace = 1;
    let word;
    let guessedWordCount = 0;
    const keys = document.querySelectorAll(".keyboard-row button");

    function getNewWord() {
        fetch(
                `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                        "x-rapidapi-key": "<YOUR_KEY_GOES_HERE>",
                    },
                }
            )
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                word = res.word;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }

    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }
        return "rgb(181, 159, 59)";

    }


    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
        }

        const currentWord = currentWordArr.join("");


        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate_flipInX");
                letterEl.style = ` background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
        })

        if (currentWord === word) {
            window.alert("Congratulations!");
        }

        if (guessedWords.length === 6) {
            window.alert(`Sorry You lost, word is ${word}.`)
        }
        guessedWords.push([])
    }


    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let sqaure = document.createElement("div");
            sqaure.classList.add("sqaure");
            sqaure.classList.add("animate__animated");
            sqaure.setAttribute("id", index + 1);
            gameBoard.appendChild(sqaure);
        }
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");


            if (letter == "enter ") {
                handleSubmitWord();
                return;
            }
            updateGuessedWords(letter);

        };
    }



});