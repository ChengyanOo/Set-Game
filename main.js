import { CardGenerator } from './jsClasses/cardGenerator.js';
import { checkSet, findAllSets, getCards, areThereSets } from './jsClasses/cardSetChecker.js';
import { hintGenerator } from './jsClasses/hintGenerator.js';
import { select } from './jsClasses/cardSelector.js';
import { setGameStats } from './jsClasses/setGameStats.js';
import { displayPopup, timerOverall } from './jsClasses/stats.js';
import { computerTurn } from './jsClasses/computerPlayer.js';

/* Functions below handle initialization of game and adding event listeners to elements */

//a map for cards which has pattern name as key and path as values
const cardUrlMap = new Map([
    ['openRedSquiggle', './img/cards/squiggle_open_red.png'],
    ['openGreenSquiggle', './img/cards/squiggle_open_green.png'],
    ['openBlueSquiggle', './img/cards/squiggle_open_blue.png'],
    ['openRedDiamond', './img/cards/diamond_open_red.png'],
    ['openGreenDiamond', './img/cards/diamond_open_green.png'],
    ['openBlueDiamond', './img/cards/diamond_open_blue.png'],
    ['openRedOval', './img/cards/oval_open_red.png'],
    ['openGreenOval', './img/cards/oval_open_green.png'],
    ['openBlueOval', './img/cards/oval_open_blue.png'],

    ['stripRedSquiggle', './img/cards/squiggle_striped_red.png'],
    ['stripGreenSquiggle', './img/cards/squiggle_striped_green.png'],
    ['stripBlueSquiggle', './img/cards/squiggle_striped_blue.png'],
    ['stripRedDiamond', './img/cards/diamond_striped_red.png'],
    ['stripGreenDiamond', './img/cards/diamond_striped_green.png'],
    ['stripBlueDiamond', './img/cards/diamond_striped_blue.png'],
    ['stripRedOval', './img/cards/oval_striped_red.png'],
    ['stripGreenOval', './img/cards/oval_striped_green.png'],
    ['stripBlueOval', './img/cards/oval_striped_blue.png'],

    ['solidRedSquiggle', './img/cards/squiggle_solid_red.png'],
    ['solidGreenSquiggle', './img/cards/squiggle_solid_green.png'],
    ['solidBlueSquiggle', './img/cards/squiggle_solid_blue.png'],
    ['solidRedDiamond', './img/cards/diamond_solid_red.png'],
    ['solidGreenDiamond', './img/cards/diamond_solid_green.png'],
    ['solidBlueDiamond', './img/cards/diamond_solid_blue.png'],
    ['solidRedOval', './img/cards/oval_solid_red.png'],
    ['solidGreenOval', './img/cards/oval_solid_green.png'],
    ['solidBlueOval', './img/cards/oval_solid_blue.png']
]);
//a map which keys are increasing int as index and values are names of the patterns
const nameMap = new Map();
//a card pool of all combinations.
const cardPool = new Set();

let i = 1;
let index1 = 0; //index of color
let index2 = 0; //index of shape
cardUrlMap.forEach((value, key) => {
    //adding elements to the nameMap
    nameMap.set(i, key);

    index1 = 0; //index of color
    index2 = 0; //index of shape
    for (var k = 0; k < key.length; k++) {
        var currCharCode = key.charCodeAt(k);
        if (currCharCode >= 65 && currCharCode <= 90) { //is uppercase
            index1 = k;
            break;
        }
    }
    for (var j = index1 + 1; j < key.length; j++) {
        var currCharCode = key.charCodeAt(j);
        if (currCharCode >= 65 && currCharCode <= 90) { //is uppercase
            index2 = j;
            break;
        }
    }

    let pattern = key.substring(0, index1)
    let color = key.substring(index1, index2);
    color = color.toLowerCase();
    let shape = key.substring(index2, key.length);
    shape = shape.toLowerCase();
    let str = pattern + "_" + color + "_" + shape;

    cardPool.add('one' + '_' + str);
    cardPool.add('two' + '_' + str);
    cardPool.add('three' + '_' + str);
    i++;
});

//Create appropriate objects
const cardGenerator = new CardGenerator(cardUrlMap, nameMap, cardPool);
const gameStats = new setGameStats();

//INITAILIZATION ENDS.

//make sure there's at least one set when begin a game
cardGenerator.generateCardDeckWhenStart();
let allSets = findAllSets(document);
while (allSets.length == 0) {
    cardGenerator.generateCardDeckWhenStart();
    allSets = findAllSets(document);

}
console.table(allSets);

const cards = getCards(document); //returns the current board as an array of card objects with shape, shading, color, count
console.table(cards);

//Waiting on new game button to be clicked to start timer (counting up)
const newGame = document.querySelectorAll("#navNewGameBtn");
newGame.forEach((newGameSelected) => {
    newGameSelected.addEventListener("click", function () { timerOverall }, false);
});

//Add event listeners for all cards
const cardsClicked = document.querySelectorAll("[id^='card-']");
cardsClicked.forEach((cardSelected) => {
    cardSelected.addEventListener("click", function () { select(cardSelected.id, cardGenerator, gameStats) }, false);
})

//Start computer player's turns to run at steady time interval
let compPlayerSec = sessionStorage.getItem("computerSecondsKey") || 15;
let computerTime = setInterval(function () {
    computerTurn(findAllSets(document), cardGenerator, gameStats, computerTime);
    setTimeout(() => updateDisplayStats(gameStats, cardGenerator.getRemainingDeck()), 1501)
}, compPlayerSec * 1000);

//Waiting on hint button to be clicked to generate hint
const hint = document.getElementById("hintBtn");
hint.addEventListener("click", function () { hintGenerator(document, findAllSets(document)) }, false);

//Add event listeners for icons
const iconRow = document.querySelector("#iconRow");
const iconsClicked = iconRow.querySelectorAll("[id^='chooseIcon']");
iconsClicked.forEach((clicked) => {
    clicked.addEventListener("click", function () { iconHandler(clicked.id) }, false);
})

//Reload the game when newGame is clicked
let computerSeconds = 15;
newGame.forEach((newGameSelected) => {
        newGameSelected.addEventListener("click", function () { 
        sessionStorage.setItem("computerSecondsKey", computerSeconds);
        location.reload();
     }, false);

});

//Update display stats to reflect internal state
const updateDisplayStats = (gameStats, remainingDeck) => {
    console.log("updating stats...")
    //update cards in deck
    document.querySelector("#deck-count + td").innerText = remainingDeck.size;

    //update number of sets found
    document.querySelector("#sets-found + td").innerText = gameStats.getSetsFound()[0] + gameStats.getSetsFound()[1];

    //update player 1 score
    document.querySelector("#p1-score + td").innerText = gameStats.getScores()[0];

    //update player 2 score
    document.querySelector("#p2-score + td").innerText = gameStats.getScores()[1];

    //If no sets on board when updating score, reshuffle or handle game ending
    if (findAllSets(document).length == 0) {
        console.error("NO SETS ON BOARD, CALL RESHUFFLE BOARD HERE")
        cardGenerator.shuffleDeck();
        let allSets = findAllSets(document);
        while (allSets.length == 0 && areThereSets(cardGenerator.remainingCardPool, cardGenerator.currPool)) {
            cardGenerator.shuffleDeck();
            allSets = findAllSets(document);
        }
        
        if(!areThereSets(cardGenerator.remainingCardPool, cardGenerator.currPool)) {
            setTimeout(displayPopup(computerTime, gameStats), 2000);
     
        }
        console.log("remainingCardPool:");
        console.log(cardGenerator.remainingCardPool);
        console.log("currPool:");
        console.log(cardGenerator.currPool);
        console.log("currPoolWithIndex:");
        console.log(cardGenerator.currPoolWithIndex);
    }
}
//update display stats upon click in container
document.querySelector(".cards-container")
    .addEventListener("click", () => updateDisplayStats(gameStats, cardGenerator.getRemainingDeck()));

// hue shift on slider value change (color change feature)
document.querySelector("#hue-slider").addEventListener("change", (e) => {
    //update hue filter
    document.querySelectorAll("[id^=card-]>div").forEach(element => element.style.filter = `hue-rotate(${e.target.value}deg)`);
})

// Get Username and Icon selected for sign up/sign in
const btn = document.getElementById("footerSignUpBtn");
const username = document.querySelector('#usernameInput');
const icon = document.querySelector('#selectIcon');
let flag = true;
btn.onclick = (event) => {
    event.preventDefault();
    const myDiv = document.getElementById("navBar");
    // myDiv.innerHTML += "\n<li class=\"nav-item\">\n " + username.value + '<img src="' + icon.value + '" width="50" height="50" alt="User Avatar">\n' +
    //     "</li>"

    if(flag) {
        const avatarSrc = icon.value;
        const usernameText = username.value;
        myDiv.innerHTML += `
        <li class="nav-item" style="margin-left: 10px;">
        <span class="username">${usernameText}</span><img src="${avatarSrc}" width="50" height="50" alt="User Avatar">
        </li>`;
    }
    flag = false;
};

// Add event for clicking Mode functionality
const modeDoneBtn = document.getElementById("selectModeFooter");
const mode = document.querySelector('#selectMode');
modeDoneBtn.onclick = (event) => {
    computerSeconds = mode.value;
    sessionStorage.setItem("computerSecondsKey", computerSeconds);
    //Reload game
    location.reload();
};