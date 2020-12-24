const http = require('http')
const logger = require('./utils/logger')
const config = require('./utils/config')
const app = require('./app')

const server = http.createServer(app)

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})