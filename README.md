# Game of Three

This repo has an implementation of the Game of Three, and it exposes it through a REST API and uses Web Sockets to real time messaging

## How does it work? 

1. Player One sends a request to create a match 'A';
2. The server creates Match called 'A' and opens a socket connection room called 'A' and adds Player One;
3. Player Two sends request to find a match;
4. The server finds match 'A' adds player Two to match 'A' and adds Player Two to the room 'A';
5. Player One starts the match giving a number;
6. Player Two receives a message with the number and it is now able to send an operation;
7. The two players play each turn until the match ends.

[DEMO](https://user-images.githubusercontent.com/6784789/218100366-16e8f203-c07d-4dce-bb9c-1a6a78bc968a.webm)

## Match

A Match is a representation to a match between two players.

A Match has the following statuses which represents its state. 

![Match state drawio](https://user-images.githubusercontent.com/6784789/218102355-dff73fb0-2473-4f4d-aaff-7e5ce99d7eb7.png)

More details on the Match can be found (here)[https://github.com/danrleyt/game-of-three/blob/main/src/types/match.ts]

## Endpoints

### POST

CREATES A MATCH [/api/matches](#/api/matches)
ADDS PLAYER TO MATCH [/api/matches/players]()
START A MATCH [/api/matches/:matchId]()
PERFORM AN OPERATION [/api/matches/:matchId/operations]()

#### POST /api/matches

Creates a match and return its id, status and message in addition it adds the match created to the in memory storage of the Match
 
**Parameters**

| Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player` | required | Player  | an Object with a field `nickname` representing the player |
| `matchId` | required | string  | Id of the match |


## Socket Connection Events

## TODOs
