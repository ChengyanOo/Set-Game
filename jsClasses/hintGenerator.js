//When the hint button is clicked 2 cards from a possible set in the 
//playing field is indicated using a yellow border that presists for one second.
//The hint button is then disabled until the set selected is checked.
function hintGenerator(document, allSets){
    if(allSets && allSets.length > 0) {
        const singleSet = allSets[Math.floor(Math.random()*allSets.length)];
        let i = 0;
        //Change the border of the 2 cards to yellow to display hint
        for(i = 0; i<2; i++) {
            const cardIndex = singleSet[i]; 
            document.getElementById("card-" + cardIndex).style.background = "yellow";
        }
        //Border to show hint persists for 2 seconds
        setTimeout(function() { 
            const cardsClicked = document.querySelectorAll("[id^='card-']");
            cardsClicked.forEach((cardSelected) => {
                cardSelected.style.background = "";
            });
       }, 1000);
    }
    //Disable the hint btn to stop malicious user activity
    document.getElementById("hintBtn").setAttribute("disabled", "disabled");
}
export {hintGenerator}
