const restify = require('restify')
const mongoose = require('mongoose')
const config = require('./config')

const server = restify.createServer()

server.use(restify.plugins.bodyParser())

server.listen(config.PORT, () => {
    mongoose.set('useFindAndModify', false)
    mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    require('./routes/books')(server)
    require('./routes/users')(server)
    console.log(`Server started on port ${config.PORT}`)
})