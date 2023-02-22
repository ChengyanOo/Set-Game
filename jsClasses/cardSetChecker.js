// contains all functions needed to check whether 3 cards are a set

const attributes = ["shape", "shading", "color", "count"]
const attributesToNum = {
    diamond: 1,
    oval: 2,
    squiggle: 3,

    open: 1,
    striped: 2,
    solid: 3,

    blue: 1,
    green: 2,
    red: 3,

    one: 1,
    two: 2,
    three: 3
}

//checks if the cards given by id numbers are a valid set
const checkSet = (doc, ...ids) => {
    const cards = getCards(doc, ...ids);

    for(let i = 0; i<attributes.length; i++) {
        if(sumOverAttribute(cards, attributes[i]) % 3 != 0) {
            return false;
        }
    }
    return true;
}

//finds all sets on the board, returns as a list of arrays with the IDs of each card in the set.
const findAllSets = (doc, numCards = 12) => {
    const allSetsOnBoard = [];
    for(let i = 1; i <= numCards; i++) {
        for(let j = i + 1; j <= numCards; j++) {
            for(let k = j + 1; k <= numCards; k++) {
                if(checkSet(doc, i, j, k)) {
                    allSetsOnBoard.push([i, j, k]);
                    break; //since there is no third card k that can create a set with cards[i] and cards[j]
                }
            }
        }
    }
    return allSetsOnBoard;
}

//gets card object array, given the ids of the requested cards. if no ids are given, the whole board is returned
const getCards = (doc, ...ids) => {
    if(ids.length == 0) {
        ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    return ids.map(index => getCardFromID(doc, index));
}

// checks if there are any sets remaining in the game
const areThereSets = (deckSet, boardSet) => {
    const deckStrings = [...deckSet, ...boardSet];  
    console.log(deckStrings)

    if(deckStrings.length > 20) { //if there are more than 20 cards remaining, there must be a set
        return true;
    }

    const deck = deckStrings.map(s => parseCardString(s));

    if(deck.length > 20) { //if there are more than 20 cards remaining, there must be a set
        return true;
    }

    for(let i = 1; i < deck.length; i++) {
        for(let j = i + 1; j < deck.length; j++) {
            for(let k = j + 1; k < deck.length; k++) {
                if(checkSetFromCards(deck[i], deck[j], deck[k])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// pass three card object with the correct attributes to check if they are sets
const checkSetFromCards = (...cards) => {
    if(cards.length != 3) {
        return false;
    }

    for(let i = 0; i<attributes.length; i++) {
        if(sumOverAttribute(cards, attributes[i]) % 3 != 0) {
            return false;
        }
    }
    return true;
}

//returns an object with attributes count, shading, color, and shape based on the string passed
//helper method for areThereSets, since the strings in that set are in the form count_shading_color_shape
const parseCardString = (s) => {
    let [count, shading, color, shape] = s.split('_');
    return {count, shading, color, shape};
}

//returns a card object from a specific ID
const getCardFromID = (doc, id) => {
    const card = parseDataFromImgSrc(doc.querySelector(`#card-${id} img`).src);
    card.count = doc.querySelectorAll(`#card-${id} img`).length;
    return card;
}

//parses image source string to the individual card attributes
const parseDataFromImgSrc = (srcString) => {
    // "./img/cards/shape_shading_color"
    let indexOffset = srcString.indexOf("cards") + 6;
    let [shape, shading, color] = srcString.slice(indexOffset, -4).split("_");
    return {shape: shape, shading: shading, color: color}; 
}

//sums cards over a specific attribute
const sumOverAttribute = (cards, attribute) => {
    let sum = 0;
    cards.forEach(card => {
        sum += attributesToNum[card[attribute]] ? attributesToNum[card[attribute]] : card[attribute];
    })
    return sum;
}


export {checkSet, findAllSets, getCards, areThereSets};