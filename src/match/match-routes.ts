import { Router } from 'express'
import validateBody from '../middleware/validation-middleware'
import {
  createMatch,
  newPlayerMatch,
  operateMatch,
  startMatch,
} from './match-handlers'
import {
  createMatchSchema,
  newPlayerMatchSchema,
  operateMatchSchema,
  startMatchSchema,
} from './match-schemas'

/**
 * All routes used for the match interaction
 */
const router = new Router()

router.post('/matches', validateBody(createMatchSchema), createMatch)
router.post(
  '/matches/players',
  validateBody(newPlayerMatchSchema),
  newPlayerMatch
)
router.post('/matches/:matchId', validateBody(startMatchSchema), startMatch)
router.post(
  '/matches/:matchId/operations',
  validateBody(operateMatchSchema),
  operateMatch
)

export default router
