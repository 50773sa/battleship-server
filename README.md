# BattleShip game

This is the Readme-file for the server repository. The repository for the client is located [here](https://github.com/marialovgren/battleship-client)

### Languages and Frameworks used:
- Node.js
- Socket.io
- React

## Table of contents

- [Assignment](#assignment)
- [Tools](#tools)
- [Printscreen](#printscreen)

## Assignment
- Create a 2-player Battleship game where the goal is to sink the opponents ships. Each player has 4 ships in 3 different sizes. 
- The assignment must be completed in a group of 3 students 

#### The game must follow this structure:
1. Start game - waiting for opponent
2. Once player have joined, start the game
3. Each players ships are placed randomly on the game board
4. Players take turns firing at the opponent by clicking on a box on the game board. 
    4.a. If the box contains a ship, it should be marked as a hit
    4.b. If the box does not contain a ship, it should be marked as a miss
5. If a player has no ships left, the opponent wins and the game ends

#### Game rules
The ships will be placed randomly to the game board at the beguinning of the game. Each player only sees their own ships but can see the opponents empty game board. You play in turn with a randomly selected player starting. You shoot a shot on a square in the opponent's battle board per round. You see if you have shot on the box before and if you have hit a ship. The game is about sinking all the opponent's ships before your own has sunk. A ship sinks only when all the boxes the ship is in have been hit.

#### Time limit

- 3 weeks

## Tools

- VS Code
- Heroku
- Netlify

  
## Run Locally

Clone the project

```bash
  git clone https://github.com/50773sa/battleship-server.git
```

Go to the project directory

```bash
  cd battleship-server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


