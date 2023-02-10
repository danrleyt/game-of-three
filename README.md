# Game of Three

This repo has an implementation of the Game of Three, and it exposes it through a REST API and uses Web Sockets to real time messaging.

## How to set up the project on your local

1. Install dependencies ```yarn install```
2. Start the server ```yarn dev```
3. Open a browser window and input the URL ```http://localhost:8080/index.html```

## How does it work? 

1. Player One sends a request to create a match 'A';
2. The server creates Match called 'A' and opens a socket connection room called 'A' and adds Player One;
3. Player Two sends request to find a match;
4. The server finds match 'A' adds player Two to match 'A' and adds Player Two to the room 'A';
5. Player One starts the match giving a number;
6. Player Two receives a message with the number and it is now able to send an operation;
7. The two players play each turn until the match ends.

[DEMO](https://user-images.githubusercontent.com/6784789/218100366-16e8f203-c07d-4dce-bb9c-1a6a78bc968a.webm)

Here is a small representation of how the services communicate

![Diagram](https://user-images.githubusercontent.com/6784789/218115105-2e194c60-041b-491b-af24-8288cdc210b8.png)

### Structure 

Here we can find a generic representation of how the server is structured.

![Structure](https://user-images.githubusercontent.com/6784789/218116229-911fd767-a3ba-4f18-b441-57ea72f9c1b2.png)

## Match

A Match is a representation to a match between two players.

A Match has the following statuses which represents its state. 

![Match state drawio](https://user-images.githubusercontent.com/6784789/218102355-dff73fb0-2473-4f4d-aaff-7e5ce99d7eb7.png)

More details on the Match can be found [here](https://github.com/danrleyt/game-of-three/blob/main/src/types/match.ts)

## Endpoints

### POST

CREATES A MATCH [/api/matches](#post-apimatches) <br/>
ADDS PLAYER TO MATCH [/api/matches/players](#post-apimatchesplayers) <br/>
START A MATCH [/api/matches/:matchId](#post-apimatchesmatchid) <br/>
PERFORM AN OPERATION [/api/matches/:matchId/operations](#post-apimatchesmatchidoperations) <br/>

#### POST /api/matches

Creates a match and return its id, status and message in addition it adds the match created to the in memory storage of the Match
 
**Parameters**

| Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player` | required | Player  | an Object with a field `nickname` representing the player |
| `matchId` | required | string  | Id of the match |


**Response** 

```
  {
    matchId: matchId,
    matchStatus: 'Waiting for Players',
    message: 'Match created successfully'
  }
```

#### POST /api/matches/players

Receives a player and looks for a match where there are still a spot to include a new player
 
**Parameters**

| Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player` | required | Player  | an Object with a field `nickname` representing the player |


**Response** 

```
  {
    matchId: matchId,
    matchStatus: 'Ready to Start',
  }
```

#### POST /api/matches/:matchId

Receives a number and player and start the match

**URL Parameters**
| Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `matchId` | required | string  | Id of the match |
 
**Parameters**

| Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player` | required | Player  | an Object with a field `nickname` representing the player |
| `number` | required | number  | an intenger that will be initial number of the match |


**Response** 

```
  {
    matchId: matchId,
    currentNumber: match.currentNumber,
    matchStatus: match.status,
    whosTurn: matchNextPlayer
  }
```

#### POST /api/matches/:matchId/operations

Gets an operation and player and performs the operation in the match in addition it emits an event to all connected players to the match informing the operation it can also disconnect all players if the operation results in a match ended

**URL Parameters**
| Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `matchId` | required | string  | Id of the match |
 
**Parameters**

| Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player` | required | Player  | an Object with a field `nickname` representing the player |
| `operation` | required | number  | a number that can only be -1, 0 or 1 that will be used as operation|


**Response** 

```
  {
    whosTurn: matchNextPlayer,
    currentNumber: match.currentNumber,
    log: MatchLog
  }
```

## Socket Connection Events

After creating a match successfully, the client is requested to open an connection with the server (see example)[]. To get the real time match details the socket will have to listen to certain events. The following are the events emitted by the server. 

### 'new player'

A new player has joined the room

**data**
```
 {
   matchStatus: match.status
 }
```

### 'started'

A match that the client is connected just started

**data**

```
  {
    matchId: matchId,
    currentNumber: match.currentNumber,
    matchStatus: match.status,
    whosTurn: matchNextPlayer
  }
```

### 'operation'

A new operation was made

**data**

```
  {
    whosTurn: matchNextPlayer,
    currentNumber: match.currentNumber,
    log: MatchLog
  }
```

### 'end'

The Match has ended

**data**

```
  {
    whosTurn: matchNextPlayer,
    currentNumber: match.currentNumber,
    log: MatchLog,
    winner: winnerOfTheMatch
  }
```

### 'disconnect'

Connection got disconnected

## TODOs

While doing this API I found out that there are many improvements and fixes to be made. Here are some of them:

1. Support client to emit events through their socket connections
2. Separate the socket into a module
3. Add exception when matchId is already being used
4. Add event listener to when player disconnects
5. add support to an actual database

In the code you may find more todos
