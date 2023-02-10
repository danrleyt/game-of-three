import express from 'express'
import matchRoutes from './match/match-routes'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { notFoundMiddleware, errorHandler } from './middleware/error-middleware'

/**
 * I am exporting here for testing purposes
 * @todo if that would be deployed I'd only export in dev environment
 */
export const app = express()
const httpServer = http.createServer(app)

/**
 * The server for the socket.io  
 * @todo move all logic with sockets to a different module and using it here
 */
export const io = new Server(httpServer, {
  /**
   * @todo Using cors allowing all origins is not ideal, should allow only the origins that can have access to it
   */
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingInterval: 5000,
  pingTimeout: 5000,
})

/**
 * @todo Using cors allowing all origins is not ideal, should allow only the origins that can have access to it
 */
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api', matchRoutes)

app.use(notFoundMiddleware)
app.use(errorHandler)

/**
 * Function that creates a room for users playing a match together
 * 
 * @todo move all logic with sockets to a different module and using it here
 */
function createRoom(socket, matchId) {
  socket.join(matchId)
}

/**
 * @todo move all logic with sockets to a different module and using it here
 */
io.on('connection', (socket) => {
  createRoom(socket, socket.handshake.query.matchId)
})

httpServer.listen(8080, () => {
  console.log('Game of Three - Server Operational and Running')
})
