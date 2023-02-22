import { checkSet } from "./cardSetChecker.js";
import { displayPopup } from "./stats.js";
/* Below functions handles all events related to card selection and set checking*/

// Displays selection of cards visually and call set checking function 
function select(cardID, cardGenerator, gameStats, isComputer = false, computerTime) {
    //border of cards empty unless clicked
    //Add "clicked" into class of cards that were clicked
    document.getElementById(cardID).classList.toggle("clicked");
    
    //check if set
    checkSetForSelectedCards(cardGenerator, gameStats, isComputer, computerTime)
}

//Makes sure 3 cards selected and check if it's a set
const checkSetForSelectedCards = (cardGenerator, gameStats, isComputer, computerTime) => {
    //get clicked cards
    const selectedCards = document.querySelectorAll(".clicked")

    //If there are not enough cards
    if (selectedCards.length != 3) {
        return false;
    }

    //gets card ids of all selected cards
    const ids = Array.from(selectedCards).map(card => card.id.substring(5));

    //check for a set
    let color = checkSet(document, ...ids) ? "green" : "red"

    //if set
    if (color === "green") {
        let isOver = cardGenerator.checkGameStatus();
        //and game not over, remove selected cards from deck
        if (!isOver) {
            let elements = document.querySelectorAll(".clicked");
            let idArr = [];
            elements.forEach(element => {
                let id = element.id;
                idArr.push(id);
                //console.log(id);
            });
            cardGenerator.removeFromDeckById(idArr);
        }
        //if game over
        else {
            //pop-up for game ending
            setTimeout(displayPopup(computerTime, gameStats), 2000);            
        }
    }

    //Set cards back to no border after displaying correctness/incorrectness
    selectedCards.forEach(card => {
        card.style = `border: 5px solid ${color}`;
        card.classList.remove("clicked");
        setTimeout(() => card.style = "", 2000)
    })
    //re-enable hint button
    document.getElementById("hintBtn").removeAttribute("disabled");

    //Handle incrementing/decrementing appropriate scores
    if(isComputer) {
        if (color === "green") {
            gameStats.incP2Score();
            cardAlert(color, "It's a set");
        } else {
            gameStats.decP2Score();
            cardAlert(color, "It's not a set");
        }
    } else {
        if (color === "green") {
            gameStats.incP1Score();
            cardAlert(color, "It's a set");
        } else {
            gameStats.decP1Score();
            cardAlert(color, "It's not a set");
        }
    }
    return color === "green"
}

//Display alert on sidebar to indicate set correctness/incorrectness
function cardAlert(backgroundColor, message) {
    document.getElementById("cardSelectedAlert").style.display = 'block';
    document.getElementById("cardSelectedAlert").style.background = backgroundColor;
    document.getElementById("cardSelectedAlert").innerHTML = (message);
   
    setTimeout(function() { 
        document.getElementById("cardSelectedAlert").style.display = 'none';
    }, 4000);
};

export { select }
