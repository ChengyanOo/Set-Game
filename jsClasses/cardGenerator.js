import { checkSet, findAllSets, getCards } from './cardSetChecker.js';

//All things responsible for generating cards
export class CardGenerator {
    constructor(CardUrlMap, NameMap, cardPool) {
        this.cardUrlMap = CardUrlMap;
        this.nameMap = NameMap;
        this.cardPool = new Set();
        this.cardPool = cardPool;
        this.currPool = new Set();
        this.currPoolWithIndex = new Map();
        this.patternNumMap = new Map([
            [1, 'one'],
            [2, 'two'],
            [3, 'three'],
        ]);
        this.quantityHelperMap = new Map([
            ['one', 1],
            ['two', 2],
            ['three', 3],
        ]);
        this.remainingCardPool = new Set(Array.from(cardPool));
    }

    //this method generates a 3*4 random card deck
    generateCardDeckWhenStart() { //3*4
        for (let i = 1; i < 13; i++) {
            let randomPatternName = this.randomPatternGenerator();
            let randomQuantity = this.randomQuantityGenerator();
            let randomPatternPath = this.cardUrlMap.get(randomPatternName);
            let cardName = this.checkCard(randomPatternName, randomQuantity);
            if (this.cardPool.has(cardName)) {
                while (this.currPool.has(cardName)) {
                    randomPatternName = this.randomPatternGenerator();
                    randomQuantity = this.randomQuantityGenerator();
                    randomPatternPath = this.cardUrlMap.get(randomPatternName);
                    cardName = this.checkCard(randomPatternName, randomQuantity);
                }
                this.currPool.add(cardName);
                this.remainingCardPool.delete(cardName);
                this.currPoolWithIndex.set((i - 1), cardName);
            }
            this.insertColunms(randomQuantity, i);
            for (let j = 0; j < randomQuantity; j++) {
                let index = j + 1;
                document.querySelector("#card-" + i)
                    .children[0]
                    .children[0]
                    .querySelector("div:nth-of-type(" + index + ")")
                    .children[0]
                    .src = randomPatternPath;
            }
        }
    }

    //helper method to generate a random num between 2&4
    randomQuantityGenerator() {
        let max = 3;
        let min = 1;
        let randomQuantity = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomQuantity;
    }

    //this method will return a random path of a pattern
    randomPatternGenerator() {
        let max = 27;
        let min = 1;
        let randomPatternNum = Math.floor(Math.random() * (max - min + 1)) + min;
        let randomPatternName = this.nameMap.get(randomPatternNum);
        return randomPatternName;
    }

    //this method will insert much ever col divs and contains image needed.
    insertColunms(quantity, cardIndex) {
        const patternColDiv = document.getElementById('card-' + cardIndex).children[0].children[0];
        let insertHtml = '';
        for (let i = 0; i < quantity; i++) {
            insertHtml += "<div class=\"col-12 text-center\">\n<img src=\"\" class=\"adjust-img\">\n</div>"
        }
        patternColDiv.innerHTML = insertHtml;
    }

    //return a card name by random num and random quantity
    checkCard(randomPatternName, randomQuantity) {
        let index1 = 0; //index of color
        let index2 = 0; //index of shape
        for (var k = 0; k < randomPatternName.length; k++) {
            var currCharCode = randomPatternName.charCodeAt(k);
            if (currCharCode >= 65 && currCharCode <= 90) { //is uppercase
                index1 = k;
                break;
            }
        }
        for (var j = index1 + 1; j < randomPatternName.length; j++) {
            var currCharCode = randomPatternName.charCodeAt(j);
            if (currCharCode >= 65 && currCharCode <= 90) { //is uppercase
                index2 = j;
                break;
            }
        }

        let pattern = randomPatternName.substring(0, index1)
        let color = randomPatternName.substring(index1, index2);
        color = color.toLowerCase();
        let shape = randomPatternName.substring(index2, randomPatternName.length);
        shape = shape.toLowerCase();
        let str = pattern + "_" + color + "_" + shape;
        let quantity = this.patternNumMap.get(randomQuantity);
        let cardName = quantity + "_" + str;
        return cardName;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //removes card from the currPool and remainingPool
    async removeFromDeckById(...ids) {
        this.fadeOutById(ids);
        await this.delay(2000);

        for (let i = 0; i < ids[0].length; i++) {
            let currId = ids[0][i]; //"card-#"
            // console.log(currId);
            let parts = currId.split("-");
            let cardId = parseInt(parts[1]) - 1; //just number
            let card = this.currPoolWithIndex.get(cardId);
            if (this.currPool.has(card)) {
                this.currPool.delete(card);
            } else {
                console.error("NO NO NO! This card has not been removed from the currPool: " + card)
            }
            //console.log(this.currPool);
            this.generateOneCard(this.remainingCardPool, currId);
        }

        const selectedCards = document.querySelectorAll(".fade-out")
        selectedCards.forEach(card => {
            card.classList.remove("fade-out");
        })
    }

    generateOneCard(remainingCardPool, id) {
        let cardArray = Array.from(remainingCardPool);
        let randomIndex = Math.floor(Math.random() * cardArray.length);
        let randomElement = cardArray[randomIndex];
        this.clearCardById(id);
        // insert muchever div by the new randomElement 
        let parts = randomElement.split("_");
        let quantity = parts[0];
        let parsedQuantity = this.quantityHelperMap.get(quantity);
        let IdParts = id.split("-");
        let cardId = parseInt(IdParts[1]);
        this.insertColunms(parsedQuantity, cardId);
        //  parse the randomElement to path
        let imgName = parts[1] + this.firstLettertoUpper(parts[2]) + this.firstLettertoUpper(parts[3]);
        //get path by the imgName
        let path = this.cardUrlMap.get(imgName);
        //put the path into the divs by id
        this.insertSrcByIdQuantity(id, parsedQuantity, path);

        //replace the ramianing pool with index
        this.currPoolWithIndex.set((cardId - 1), randomElement);
        //delete randomElement from the remaining pool
        this.remainingCardPool.delete(randomElement);
        //adding randomElement to the currPool
        this.currPool.add(randomElement);

        if (this.currPool.size != 12) {
            console.error("There's something wrong this the currPool, size is off");
            document.getElementById("randomError").style.display = 'block';
            console.error(this.currPool);
        }
    }

    insertSrcByIdQuantity(id, quantity, path) {
        for (let j = 0; j < quantity; j++) {
            let index = j + 1; //since id is (id -1)
            document.querySelector("#" + id)
                .children[0]
                .children[0]
                .querySelector("div:nth-of-type(" + index + ")")
                .children[0]
                .src = path;
        }
    }

    firstLettertoUpper(str) {
        let firstLetter = str.charAt(0).toUpperCase();
        let modifiedString = firstLetter + str.slice(1);
        return modifiedString;
    }

    clearCardById(id) {
        let div = document.getElementById(id);
        if (div) {
            let firstChild = div.children[0];
            if (firstChild) {
                let firstChildFirstChild = firstChild.children[0];
                if (firstChildFirstChild) {
                    firstChildFirstChild.innerHTML = "";
                }
            }
        }
    }

    fadeOutById(...ids) {
        for (let i = 0; i < 3; i++) {
            let id = ids[0][0][i];
            let div = document.getElementById(id);
            if (div) {
                let firstChild = div.children[0];
                if (firstChild) {
                    let firstChildFirstChild = firstChild.children[0];
                    if (firstChildFirstChild) {
                        firstChildFirstChild.classList.toggle("fade-out");
                    }
                }
            }
        }
    }

    shuffleDeck() {
        //add currDeck to the remaining deck, clear index map
        for (let currCard of this.currPool) {
            this.remainingCardPool.add(currCard);
            this.currPool.delete(currCard)
        }
        this.currPool = new Set();
        //1 generate a new currdeck and add them to the html
        for (let i = 0; i < 12; i++) {
            let remainingCardPoolArray = Array.from(this.remainingCardPool);
            let randomIndex = Math.floor(Math.random() * remainingCardPoolArray.length);
            let randomElement = remainingCardPoolArray[randomIndex];
            this.remainingCardPool.delete(randomElement);
            this.currPool.add(randomElement);

            let camelledCardName = this.toCamelCase(randomElement);
            let path = this.cardUrlMap.get(camelledCardName);

            //get the quantity of divs from the "randomElement"
            let parts = randomElement.split("_");
            let strQuantity = parts[0];
            let quantity = this.quantityHelperMap.get(strQuantity)
            //insert right amount of divs
            this.insertColunms(quantity, (i + 1));
            // set the srcs
            for (let j = 0; j < quantity; j++) {
                let index = j + 1;
                document.querySelector("#card-" + (i + 1))
                    .children[0]
                    .children[0]
                    .querySelector("div:nth-of-type(" + index + ")")
                    .children[0]
                    .src = path;
            }
            //update the index map
            this.currPoolWithIndex.set(i, randomElement);
        }
        
    }

    toCamelCase(str) {
        // split the string by underscore
        const parts = str.split('_');

        // discard the first element
        parts.shift();

        // convert the remaining parts to camel case
        const camelCase = parts.map((part, index) => {
            // for the first part, convert to lowercase
            if (index === 0) {
                return part.toLowerCase();
            }
            // for the remaining parts, capitalize the first letter
            return part.charAt(0).toUpperCase() + part.slice(1);
        }).join('');

        return camelCase;
    }

    getCurrDeck() {
        return this.currPool;
    }

    checkGameStatus() {
        return (this.remainingCardPool.size == 0) ? true : false;
    }

    getRemainingDeck() {
        return this.remainingCardPool;
    }
}