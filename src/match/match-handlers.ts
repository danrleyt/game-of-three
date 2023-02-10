import { logger, Severity } from '../utils/logger'
import { io } from '..'
import AppError from '../types/errors'
import { Match, MatchStatus } from '../types/match'
import matchStorage from './match-storage'

/**
 * Handler for endpoint POST /matches
 * it creates a match and return its id, status and message
 * in addition it adds the match created to the in memory storage of the Match
 */
export const createMatch = (req, res) => {
  try {
    const player = req.body.player
    const matchId = req.body.matchId
    const match = new Match(player)

    if (matchStorage.getMatch(matchId) !== undefined) {
      res.status(400).send({
        statusCode: 400,
        message: 'Match already exists',
      })
    }

    matchStorage.addMatch(matchId, match)
    logger(Severity.INFO, 'createMatch', {
      message: 'Match created',
      matchId,
      status: match.status,
    })
    res.send({
      matchId: matchId,
      matchStatus: match.status,
      message: 'Match created successfully',
    })
    return
  } catch (error) {
    logger(Severity.ERROR, 'createMatch', error)
    throw error
  }
}

/**
 * Handler for endpoint POST /matches/player
 * it receives a player and looks for a match where there are still a spot to include a new player
 */
export const newPlayerMatch = (req, res) => {
  try {
    const player = req.body.player
    const foundMatch = matchStorage.findMatchesWaitingForPlayers()

    if (foundMatch === undefined) {
      throw new AppError(404, 'No matches were found')
    }

    const match = matchStorage.getMatch(foundMatch)

    match?.addPlayer(player)
    io.to(foundMatch).emit('new player', {
      matchStatus: match?.status,
    })

    logger(Severity.INFO, 'newPlayerMatch', {
      matchId: foundMatch,
      status: match?.status,
      players: match?.players,
    })

    res.send({
      matchId: foundMatch,
      matchStatus: match?.status,
    })

    return
  } catch (error) {
    logger(Severity.ERROR, 'newPlayerMatch', error)
    throw error
  }
}

/**
 * Handler for POST /matches/:matchId
 * it gets a number and player and start the match
 */
export const startMatch = (req, res) => {
  const player = req.body.player
  const number = req.body.number
  const matchId = req.params.matchId

  try {
    const match = matchStorage.getMatch(matchId)
    const isStarted = match?.start(number, player)

    if (isStarted) {
      const data = {
        matchId: 'myMatch',
        currentNumber: match?.currentNumber,
        matchStatus: match?.status,
        whosTurn: match?.getWhosTurn(),
      }
      io.to(matchId).emit('started', data)
      res.send(data)
    }
    return
  } catch (error) {
    logger(Severity.ERROR, 'startMatch', error)
    throw error
  }
}

/**
 * Handler for POST /matches/:matchId/operations
 * it gets an operation and player and performs the operation in the match
 * in addition it emits an event to all connected players to the match informing the operation
 * it can also disconnect all players if the operation results in a match ended
 */
export const operateMatch = (req, res) => {
  const player = req.body.player
  const operation = req.body.operation
  const matchId = req.params.matchId

  try {
    const match = matchStorage.getMatch(matchId)
    if (match !== undefined) {
      match.operate(operation, player)
      const data = {
        whosTurn: match.getWhosTurn(),
        currentNumber: match.currentNumber,
        log: match.logs[match.logs.length - 1],
      }
      if (match.status === MatchStatus.FINISHED) {
        io.to(matchId).emit('end', { ...data, winner: match.winner })
        io.to(matchId).disconnectSockets()
        res.send({ ...data, winner: match.winner })
        matchStorage.removeMatch(matchId)
        return
      }
      io.to(matchId).emit('operation', data)
      res.send(data)
      return
    }
  } catch (error) {
    logger(Severity.ERROR, 'operateMatch', error)
    throw error
  }
}
