document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded DOM!");
    
    let correct = 0;
    let curScore = 0;
    let lowestScore = -Infinity;

    const cards = document.querySelectorAll(".card-wrapper");
    const newGameButton = document.querySelector("header nav li ");
    const playAgainButton = document.querySelector("#restart-button");
    let numCards = cards.length;
    let card1 = null;
    let card2 = null;
    let cardContainer = document.querySelector(".card-container");
    let cardContainerChildren = document.querySelector(".card-container").children;


    const handleClick = e => {
        if (!e.target.classList.contains("front")) return;
        let currentCard = e.target.parentElement;
        console.log("The card-wrapper is, ",currentCard);
        console.log(currentCard.children) // [front, back]
        console.log(`The backside is ${currentCard.children[1]}`)
        console.log(currentCard.children[1])

        if (!card1 || !card2) {
            if (!currentCard.classList.contains("flipped")) {
                curScore++
                console.log(curScore)
            }
            currentCard.classList.add("flipped");
            currentCard.children[1].style.backgroundColor = currentCard.children[1].dataset.backgroundcolor;
            card1 = card1 || currentCard;
            console.log(card1)
            card2 = currentCard === card1 ? null : currentCard;
            console.log(card2)
        }
        if (card1 && card2) {
            let bg1 = card1.children[1].dataset.backgroundcolor;
            let bg2 = card2.children[1].dataset.backgroundcolor;
            if (bg1 === bg2) {
                correct++;
                card1.removeEventListener("click", handleClick)
                card2.removeEventListener("click", handleClick)
                card1 = null;
                card2 = null;
            }
            else {
                setTimeout(() => {
                    card1.classList.remove("flipped")
                    card2.classList.remove("flipped")
                    card1 = null;
                    card2 = null;
                }, 1000)
            }
        }
        if (correct === (numCards / 2)) {
            endGame()
        }
    }

    for (const card of cards) {
        card.addEventListener("click", handleClick);
    }

    const endGame = () => {
        console.log("game is finished")
        const gameisFinished = document.querySelector("#end");
        lowestScore = Math.max(lowestScore, curScore);
        localStorage.setItem("lowestScore", lowestScore);
        if(curScore < lowestScore) {
            gameisFinished.children[1].innerText = ` New Best Score! ${curScore}`
        } else {
            let lowestt = localStorage.getItem("lowestScore")
            gameisFinished.children[1].innerText = `Your score is ${+lowestt}`;
        }
        gameisFinished.classList.add("game-over");
    };

    const shuffle = arr => {
        for(let i = arr.length - 1; i > 0; i--) {
            let rand = Math.floor(Math.random() * i + 1);
            let temp = arr[i]
            arr[i] = arr[rand]
            arr[rand] = temp;
        }
        return arr;
    };

    const shuffleNodes = () => {
        let nodes = cardContainerChildren;
        nodes = Array.prototype.slice.call(nodes);
        nodes = shuffle(nodes);
        let i = 0
        
        while(i < nodes.length) {
            cardContainer.appendChild(nodes[i])
            ++i;
        }
    }
    const newGame = () => {
        const gameisFinished = document.querySelector("#end")
        gameisFinished.classList.remove("game-over")
        curScore = 0
        correct = 0;
        shuffleNodes()
        for(const card of cards) {
            card.classList.contains("flipped") ? card.classList.remove("flipped") : null;
            card.addEventListener("click", handleClick)
        }
       console.log("New game has started!")
    }

    newGameButton.addEventListener("click", newGame)
    playAgainButton.addEventListener("click", newGame)
    newGame()

})

