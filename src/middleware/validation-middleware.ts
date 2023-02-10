import Joi from 'joi'
import { logger, Severity } from '../utils/logger'
import AppError from '../types/errors'

/**
 * Middleware to validate the body of the requests based on each schema passed
*/
const validateBody = (schema) => (req, res, next) => {
  const { value, error } = Joi.compile(schema).validate(req.body)
  if (error) {
    logger(Severity.ERROR, 'validateBody', {message: 'Validation error'})
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ')
    return next(new AppError(400, errorMessage))
  }

  Object.assign(req, value)
  return next()
}

export default validateBody
