import AppError from './errors'
import { Player } from './player'

/**
 * Enum representing the possible operations after a match has started
 */
enum Operation {
  PLUS_ONE = 1,
  PLUS_ZERO = 0,
  MINUS_ONE = -1,
}

/**
 * A MatchLog represents an action that it was taken in a Match
 */
type MatchLog = {
  player: Player
  currentNumber: number
  operation?: Operation
  numberAfterOperation?: number
}

/**
 * MatchStatus represents the statuses a match can be transitioned to
 */
export enum MatchStatus {
  WAITING_FOR_PLAYERS = 'Waiting for Players',
  READY_TO_START = 'Ready to Start',
  ONGOING = 'Match is Ongoing',
  FINISHED = 'Match is Finished',
}

/**
 * Match class represents a match where two players are in
 * @class
 */
export class Match {
  public players: Array<Player> = []
  public currentNumber: number = 0
  public playersTurn: number = 0
  public logs: Array<MatchLog> = []
  public status: MatchStatus
  winner: Player | undefined = undefined

  /**
   * The constructor of the Match, it needs a player which will be the 'creator' of the match
   * and will the one able to start it, in addition the status of the Match will be 'Waiting for Players' 
   */
  constructor(firstPlayer: Player) {
    this.players.push(firstPlayer)
    this.playersTurn = 0
    this.status = MatchStatus.WAITING_FOR_PLAYERS
  }

  /**
   * Adds a player to a match, or throws an error if the number of players is 2
   */
  addPlayer(player: Player) {
    if (this.players.length < 2) {
      this.players.push(player)
      this.status = MatchStatus.READY_TO_START
      return true
    }
    throw new AppError(400, 'Matches support only 2 players')
  }

  /**
   * Helper function to add an operation made in the match to the match logs 
   */
  _addToLogs(
    player: Player,
    operation?: Operation,
    numberAfterOperation?: number
  ) {
    const log = {
      player,
      currentNumber: this.currentNumber,
      operation,
      numberAfterOperation,
    }

    this.logs.push(log)
  }

  /**
   * Starts the match, it expects the initial number and the player owner of the Match
   * in addition changes the status of the Match to ONGOING
   */
  start(number: number, player: Player) {
    if (
      this.players.length == 2 &&
      player.nickname == this.players[0].nickname &&
      this.status !== MatchStatus.ONGOING
    ) {
      this.currentNumber = number
      this.status = MatchStatus.ONGOING
      this.playersTurn = 1
      this._addToLogs(player, this.currentNumber)
      return true
    }
    throw new AppError(403, 'player not authorised or match has not started')
  }

  /**
   * Helper function to know whos player turn is 
   */
  getWhosTurn() {
    return this.players[this.playersTurn]
  }

  /**
   * Performs an operation to the current number, and in case the number becomes 1 or less or equal to 0
   * ends the match. 
   */
  operate(operation: Operation, player: Player) {
    if (
      this.players.length == 2 &&
      this.currentNumber > 1 &&
      this.status == MatchStatus.ONGOING &&
      this.getWhosTurn().nickname === player.nickname
    ) {
      const num = Math.floor((this.currentNumber + operation) / 3)
      if (num == 1) {
        this.end(player)
        this.currentNumber = num
        return this.currentNumber
      } else if (num <= 0) {
        this.end(undefined)
      }
      this.playersTurn = this.playersTurn == 0 ? 1 : 0
      this._addToLogs(player, operation, num)
      this.currentNumber = num
      return this.currentNumber
    }
    throw new AppError(403, 'Not your turn or match not started')
  }

  /**
   * Helper function to print the match logs - Used for debug purposes
   */
  printMatch() {
    for (const log of this.logs) {
      console.log(
        `${log.player.nickname} - ${log.currentNumber} - ${
          log.operation !== undefined ? log.operation : ''
        } - ${log.numberAfterOperation ? log.numberAfterOperation : ''}`
      )
    }
  }

  /**
   * Helper function to print current number and status of the match - Used for debug purposes
   */
  printCurrent() {
    console.log(`Status: ${this.status} - Current: ${this.currentNumber}`)
  }

  /**
   * Ends the match and assigns a winner
   */
  end(player: Player | undefined) {
    this.status = MatchStatus.FINISHED
    this.winner = player
    return true
  }
}
