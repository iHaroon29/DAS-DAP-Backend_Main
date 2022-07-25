const Express = require('express')
const Router = Express.Router()
const cors = require('cors')
const logger = require('../Services/Logger/Logger')
const AdminRoutes = require('./AdminRoutes/AdminRoutes')
const SuperAdminRoutes = require('./SuperAdminRoutes/SuperAdminRoutes')
// const AIRoutes = require('./AIRoutes/AIRoutes')
const ExtensionRoutes = require('./ExtensionRoutes/ExtensionRoutes')
const AuthorizationRoutes = require('./AuthorizationRoutes/AuthorizationRoutes')

Router.use(cors())
Router.use(Express.urlencoded({ extended: true }))
Router.use(Express.json())
Router.use(require('morgan')('combined'))

// Error Handling for invalid JSON

Router.use((err, req, res, next) => {
  // Invalid JSON format
  if (err.status === 400) {
    logger.error(
      `Invalid JSON request from ${req.url} having host ${
        req.hostname || req.baseUrl
      }`
    )
    return res
      .status(err.status)
      .send({ status: err.status, message: 'Invalid JSON format' })
  }
  return next(err)
})

// Routes Middleware

Router.use('/Auth', AuthorizationRoutes)
Router.use('/Admin', AdminRoutes)
Router.use('/Extension', ExtensionRoutes)
Router.use('/SuperAdmin', SuperAdminRoutes)

// Invalid request Middleware

Router.use((req, res, next) => {
  // Invalid request / Invalid routes
  logger.error(
    `Invalid URL request i.e ${req.url} from host ${
      req.hostname || req.baseUrl
    }`
  )

  res.status(404).json({
    name: 'Error',
    status: 404,
    message: 'Invalid Request',
    statusCode: 404,
  })
})

module.exports = Router
