require('dotenv').config()
const portNumber = process.env.PORT_NUMBER || 8001
const cluster = require('cluster')
const totalCPUs = require('os').cpus()
const logger = require('./Services/Logger/Logger')
// const https = require('https')
const app = require('./app')
// const fs = require('fs')
const http = require('http')

// const privateKey = fs.readFileSync(
//   '/etc/letsencrypt/live/dap.digitalaidedschool.com/privkey.pem',
//   'utf8'
// )
// const certificate = fs.readFileSync(
//   '/etc/letsencrypt/live/dap.digitalaidedschool.com/cert.pem',
//   'utf8'
// )
// const ca = fs.readFileSync(
//   '/etc/letsencrypt/live/dap.digitalaidedschool.com/chain.pem',
//   'utf8'
// )

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// }

if (cluster.isMaster) {
  totalCPUs.forEach(async (node) => {
    await cluster.fork()
  })

  cluster.on('exit', async (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} has died!`)
    logger.error(`Worker ${worker.process.pid} has died!`)
    logger.info('Creating a new Worker')
    await cluster.fork()
  })
} else {
  http.createServer(app).listen(portNumber, () => {
    logger.info(`Process ${process.pid} is online on port number ${portNumber}`)
  })
  // https
  //   .createServer(credentials, app)
  //   .listen(process.env.PORT || portNumber, () => {
  //     console.log(`running on ${process.env.PORT || portNumber}`)
  //   })
}
