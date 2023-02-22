//This file is where all the stats is handled
export class setGameStats {
    constructor() {
        this.p1Score = 0;
        this.p2Score = 0;
        this.p1SetsFound = 0;
        this.p2SetsFound = 0;
    }

    //increments player 1's score, as well as sets found
    incP1Score() {
        this.p1Score++;
        this.p1SetsFound++;
    }

    //increments player 2's score, as well as sets found
    incP2Score() {
        this.p2Score++;
        this.p2SetsFound++;
    }

    //decrements player 1's score, lower bounded to 0
    decP1Score() {
        this.p1Score = Math.max(this.p1Score-1, 0);
    }

    //decrements player 2's score, lower bounded to 0
    decP2Score() {
        this.p2Score = Math.max(this.p2Score-1, 0);
    }

    //returns both players scores
    getScores() {
        return [this.p1Score, this.p2Score];
    }

    //returns both players sets found
    getSetsFound() {
        return [this.p1SetsFound, this.p2SetsFound];
    }
    
}