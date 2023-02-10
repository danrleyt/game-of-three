import { Match, MatchStatus } from '../types/match'

/**
 * MatchStorage is my way of simulating a storage layer
 * @todo use a connection to a database 
 * @class
 */
class MatchStorage {
  /**
   * matches Map, where key is the matchId and Match the actual Match
   */
  matches: Map<string, Match>

  constructor() {
    this.matches = new Map<string, Match>()
  }

  /**
   * Adds a match to the Map
   */
  addMatch(matchId: string, match: Match) {
    this.matches.set(matchId, match)
  }

  /**
   * Retrieves a match from the Map, if it exists
   */
  getMatch(matchId: string) {
    return this.matches.get(matchId)
  }

  /**
   * Returns all matches
   */
  getAllMatches() {
    return this.matches.values()
  }

  /**
   * Finds a match where is still waiting for players
   */
  findMatchesWaitingForPlayers(): string | undefined {
    let matchId: string | undefined = undefined
    this.matches.forEach((match, matchKey) => {
      if (match.status === MatchStatus.WAITING_FOR_PLAYERS) {
        matchId = matchKey
        return
      }
    })
    return matchId
  }

  /**
   * Removes a match from the storage
   */
  removeMatch(matchId:string) {
    this.matches.delete(matchId)
  }
}

export default new MatchStorage()
