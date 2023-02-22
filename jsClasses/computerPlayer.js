import { select} from  './cardSelector.js';
import { checkSet } from "./cardSetChecker.js";
//FUnction that is responsible for computer player
function computerTurn(allSets, cardGenerator, gameStats, computerTime) {
    document.querySelectorAll(".clicked").forEach(element => {
        element.classList.toggle("clicked");
    });

    const stopClicks = e => {
        e.stopPropagation();
        e.preventDefault();
    }
    
    if(allSets && allSets.length > 0) {
        const singleSet = allSets[Math.floor(Math.random()*allSets.length)];
        document.addEventListener("click", stopClicks, true);

        for(let i = 0; i< 3; i++) {
            const cardIndex = singleSet[i]; 
            let cardID = "card-" + cardIndex
            setTimeout(() => select(cardID, cardGenerator, gameStats, true, computerTime), 750*i)
        }
        setTimeout(() => document.removeEventListener("click", stopClicks, true), 1501);
    }
}
export {computerTurn}
