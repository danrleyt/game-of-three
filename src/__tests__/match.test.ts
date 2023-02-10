import { Match, MatchStatus} from '../types/match'

test('Match functionality', function () {
  const playerOne = { nickname: 'John Doe' }
  const match = new Match(playerOne)

  expect(match.players).toHaveLength(1)
  const playerTwo = { nickname: 'Jane Doe' }
  match.addPlayer(playerTwo)
  expect(match.players).toHaveLength(2)

  const playerThree = { nickname: 'Jim Doe' }
  try {
    expect(match.addPlayer(playerThree)).toThrowError()
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
  }

  const number = 56
  match.start(number, playerOne)

  try {
    expect(match.start(number, playerTwo)).toThrowError()
  } catch (e) {
    expect(e).toBeInstanceOf(Error)
  }

  try {
    match.operate(1, playerOne)
  } catch (e) {
    expect(e).toBeInstanceOf(Error)
  }
  match.operate(1, playerTwo)
  expect(match.currentNumber).toBe(19)

  match.operate(-1, playerOne)
  expect(match.currentNumber).toBe(6)

  expect(match.status).toBe(MatchStatus.ONGOING)

  match.operate(0, playerTwo)

  expect(match.currentNumber).toBe(2)

  match.operate(1, playerOne)

  expect(match.currentNumber).toBe(1)
  expect(match.status).toBe(MatchStatus.FINISHED)
  expect(match.winner).toBe(playerOne)
})
