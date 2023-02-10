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

## Match 

## Endpoints

## Socket Connection events

## TODOs