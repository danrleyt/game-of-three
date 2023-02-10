import { MatchStatus } from '../types/match'
import { app } from '..'
import request from 'supertest'

describe('Match handlers', function () {
  it('should return a success message', async function () {
    const req = {
      body: { player: { nickname: 'john' }, matchId: 'mymatch-123' },
    }
    const expectedResponseBody = {
      matchId: req.body.matchId,
      matchStatus: MatchStatus.WAITING_FOR_PLAYERS,
      message: 'Match created successfully',
    }
    const response = await request(app)
      .post('/api/matches')
      .send(req.body)
      .set('Accept', 'application/json')
    expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedResponseBody))
  })
})
