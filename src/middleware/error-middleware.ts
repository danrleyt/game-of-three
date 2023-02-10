import AppError from "../types/errors"

/** 
 * Middleware function to transform errors to JSON responses 
*/
export const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500)
  res.json({
    statusCode: err.statusCode || 500,
    message: err.message,
  })
}

/**
 * Not found middleware is used when the user sends a request
 * to a endpoint that is non existent in the API
*/
export const notFoundMiddleware = (req, res, next) => {
  next(new AppError(404, 'Not Found'))
}
