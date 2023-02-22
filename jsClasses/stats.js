// This file starts the timer, displays the end-game popup with the appropriate stats, and disables the buttons and event listeners for the end game state

//Keeps track of the overall time for the game played
var second = 0;
function timerOverall(count) {return count > 9 ? count : "0" + count; }

/*This function begins the timer that shows game elapsed time */
var timer = setInterval (function() {
    document.getElementById("seconds").innerHTML = timerOverall(++second % 60);
    document.getElementById("minutes").innerHTML = timerOverall(parseInt(second / 60, 10));
}, 1000);

/* This function displays the pop-up that marks the end of the game */
function displayPopup(computerTime, gameStats) {

    clearInterval(computerTime);
    clearInterval(timer);

    //disable the buttons for the endgame state
    document.getElementById("ruleBtn").disabled = true;
    document.getElementById("settingsBtn").disabled = true;
    document.getElementById("signUpBtn").disabled = true;
    document.getElementById("signInBtn").disabled = true;
    document.getElementById("hintBtn").setAttribute("disabled", "disabled");

    //disable event listeners for cards
    document.querySelector(".cards-container").addEventListener("click",e=> 
        {e.stopPropagation();
            e.preventDefault();
        }, true);

    //get the time and display it
    const time = timer;
    const timeElement = document.getElementById("timeElapsed");
    timeElement.textContent = timerOverall(parseInt(second/60, 10)) + ":" + timerOverall(++second % 60);

    //get the scores and display them
    const [playerScore, compScore] = gameStats.getScores();
    const playerScoreElement = document.getElementById("playerScore");
    const compScoreElement = document.getElementById("compScore");

    playerScoreElement.textContent = playerScore;
    compScoreElement.textContent = compScore + 1;


    //change the title based on who won the game, computer or player
    const result = document.getElementById("popupStatsTitle");
    if (compScore > playerScore) {
        result.textContent = "Computer Wins!";
    } else if (compScore == playerScore) {
        result.textContent = "Draw!";
    }
     
    //show the endgame popup
    var popupModal = new bootstrap.Modal(document.getElementById('popupStats'), {
        keyboard: false
        })
    popupModal.show();

}
export {timerOverall, displayPopup}
