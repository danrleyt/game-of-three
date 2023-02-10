import Joi from 'joi'

/**
 * Schema used for POST /matches 
 */
export const createMatchSchema = Joi.object().keys({
  matchId: Joi.string().required(),
  player: Joi.object()
    .keys({
      nickname: Joi.string().required(),
    })
    .required(),
})

/**
 * Schema used for POST /matches/players
 */
export const newPlayerMatchSchema = Joi.object().keys({
  player: Joi.object()
    .keys({
      nickname: Joi.string().required(),
    })
    .required(),
})

/**
 * Schema used for POST /matches/:matchId 
 */
export const startMatchSchema = Joi.object().keys({
  player: Joi.object().keys({ nickname: Joi.string().required() }),
  number: Joi.number().integer().required(),
})

/**
 * Schema used for POST /matches/:matchId/operations 
 */
export const operateMatchSchema = Joi.object().keys({
  player: Joi.object().keys({ nickname: Joi.string().required() }),
  operation: Joi.number().integer().min(-1).max(1).required(),
})
