# Welcome to Set!

Set is a card game that revolves around the correct selection of three cards at a time. Each card contains four features: shape, number of shapes, shading, and color. A correct selection is called a set and occurs when the features on all 3 cards combine in a certain way. The combinations of features that are considered a set will be expanded upon in the instructions section. 

This version of set involves an 81 card deck with 12 cards displayed at a time on the playing board. A user plays against a computer player that continously tries to find sets. The game ends when there are no cards remaining in the deck. A player's points are incremented when sets are found and decremented when they are not, although negative point values are not allowed. The winner of the game is either the player or the computer, depending on who finishes with more points. The player can customize their game experience by choosing the color scheme of their cards and difficulty mode of the computer player (easy, medium, hard). They can also utlize the hint functionality throughout the game.

# Installation

The game is deployed via GitHub pages and can be accessed via this link [here](https://cse-3901-sharkey.github.io/Team-5-Lab-1/). For playing the game while viewing this README, it's recommended to open the game in a new tab.



# Instructions

## General
The user can see their score and the computer's score, how many cards are in the deck, how many sets they've found, and how long the game has been going on for in the table to the left of the playing board. The top row of the game allows the user to find buttons for starting a new game, the rules for the game and what constitutes a set, and buttons for signing in/signing up. The game can still be played without signing in or signing up, but if the user selects to sign up then they will be given a prompt to enter a username and select an avatar. To the right, the set of 12 cards from which sets will be chosen is displayed. 

The "New Game" button allows the user to restart the game at any point. The "Rules" button can be accessed at any point during the game and acts as a quick reference to how the game should be played. The "Game Settings" buttons provides the user the ability to change the color scheme of the cards via a slider. They can also select the difficulty mode from the "Mode" button in the "Game Settings" popup and select easy, medium, or hard from the drop down.

When the user lands on the site, the game automatically begins. The computer player will try to find a set at a time interval consistent with the difficulty mode. For example, the computer player selects cards faster in the hard mode and slower in the easy mode. While the computer player is playing, the user is not able to select cards. When the player selects three cards, they will be alerted to whether it was a set or not. If it was a set, their score will increase by one. If it was not a set, their score will decrease by one. If their score was already zero, it does not get decremented to negative values. When the game ends ends, the user will be alerted to who won and can either exit or begin a new game.

## What is a set?

The entire game involves the selection of three cards that satisfy the conditions of a set. Note that each card has a shape (diamond, squiggle, oval), a number of shapes (one, two, or three), a shading (striped, solid, open), and a color (set of 3 colors based on color scheme). A set is found when for each of the four features, the selected three cards display the feature as A) all the same or B) all different. In other words, for each feature, no two cards should show one version of the feature and the third another.

### Examples of sets
<img width="250" alt="image" src="https://user-images.githubusercontent.com/122496729/219981868-2130f5ad-ae80-4975-a55b-cd8e33b60d5f.png">
All three cards have the same color, shape, and number but all differ in their shading.
<img width="250" alt="image" src="https://user-images.githubusercontent.com/122496729/219982059-a55348d3-2417-4f1d-8da5-9a0c5906a6f4.png">
All three cards have different shapes, numbers, and colors but all have the same shading.

### Examples of non-sets
<img width="250" alt="image" src="https://user-images.githubusercontent.com/122496729/219995677-dc6b28a7-447b-4514-92bc-39f29bee93df.png">
First and second card are the same shape while the third card isn't. The second and third card have the same number of shapes while the first card doesn't.
<img width="250" alt="image" src="https://user-images.githubusercontent.com/122496729/219995927-d3a17a59-939a-4d84-a59a-57be29e0c9b9.png">
First and third card are the same color while the second card isn't. The second and third card have the same number of shapes while the first card doesn't.

# Features
The basic functionality for a game of Set is easily covered in this version. Twelve cards are correctly dealt and replaced when the player/computer makes a set. A set is correctly identified by the algorithm and visually tagged to indicated correctness. The score of each player is correctly kept as well as the duration of play. Additional features that enhance the game are documented below.

## Hint button
When the hint button is pressed, two of the cards that form a set on the playing board are highlighted as a clue for the user. The hint button cannot be clicked again until the user or computer selects a set. Then it will reactivate for another hint.

## Card Color Customization
Upon clicking the "Game Settings" button at the the top of the page, a popup appears with a sliding scale. This scale can be used to change the color scheme of the cards on the playing deck to suit the player's aesthetic preference.

## Playing Mode
The popup that appears when "Game Settings" is clicked also contains a button titled "Mode." Upon clicking this, the user can select the computer player's mode of difficulty from the dropdown. The user can select between easy, medium, and hard. This feature augments the speed at which the computer plays.

## Sign In/Sign Up
This version of the game has the beginning architecture of a sign in/sign up functionality for the user. This is not complete nor fully functional but great efforts were made to set up a database and attempt to get it running. Currently, the user can sign up with a user name and select an avatar of choice. This avatar will display next to the "Game Settings" button at the top of the site. However, this doesn't currently persist across games. So, when a user clicks "New Game," they will have to sign up/sign in again. The sign in currently allows you to enter your username but doesn't recognize the user. Nevertheless, here is more information about the backend.

### Backend setup

This project includes a CRUD API built using Node.js, with the backend code located in the mariadbConnector package under new_connector.js.

To set up the backend, you will need a computer or virtual machine to host the service, as well as a MariaDB server installed and running. You will also need to install Node.js if you haven't already.

To get the Node.js application running, you will need to install several Node.js packages, including mariadb, express, and dotenv. You can install these packages by running the command npm install [package name] after installing Node.js.

Once you have installed the necessary packages, you can start the backend server by running the command npm start in the project directory.

Note: You will need to set up the appropriate environment variables in a .env file in the project directory to connect to your MariaDB server. Please refer to the example.env file for the required environment variables.

Right now, all the services can be accessed with the following urls:

to get all users
http://129.158.58.83:8080/v1/allusers

to get user by name
http://129.158.58.83:8080/v1/ActualUserName

to update new user(remember to change all '/' to '%2F')
http://129.158.58.83:8080/v1/adduser/user_name/highest_score/path%2Fto%2Ffile

to change user score by username
http://129.158.58.83:8080/v1/changescore/ActualUserName/ActualScore

# Features in Motion
All the aforementioned features are seen actively below:

![3901Lab1DisplayVid (1)](https://user-images.githubusercontent.com/69735000/219993398-f25a6dd1-b1e3-4cc3-9de6-83f1c6ae086e.gif)

# Logical Walkthrough
Here is a walkthrough of what a player's game of Set could look like:
 1. Player navigates to page, the game of Set automatically begins on the default mode: easy.
 2. Player wants to play on medium mode, they navigate to "Game Settings" and click the correct dropdown.
 3. The game begins on medium mode, the user clicks a set correctly. Their score is incremented by 1.
 4. The computer becomes active. It also correctly clicks a set. The computer's score is incremented by 1.
 5. The user clicks a set incorrectly. Their score is decremented by 1, back to 0.
 6. Steps 3 - 5 continue. The player and computer continue playing. The player cannot play when the computer is playing. Scores are incremented and decremented           accordingly.
 7. This continues until there are no cards in the deck. Upon this condition, a pop-up activates. It announces the winner, the time elapsed, and each player's           score.
 8. The player selects "New Game" from the pop-up. The game begins again at Step 1.
# Now...your turn! Enjoy the game!


 
