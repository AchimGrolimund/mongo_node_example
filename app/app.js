const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const router = express.Router()

require('dotenv').config()
const app = express()

const port = process.env.PORT || 8080


// Setup Mongo connection && WebServer
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected to db')
        app.listen(port, () => console.log(`Server running on port ${port}`))
    })
    .catch((err) => console.error(err))

// Use Morgan to show logs
/*
dev --> :method :url :status :response-time ms - :res[content-length]
    --> GET /products/123 200 2.000 ms - 53
 */
app.use(morgan('dev'))

// Use Cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

// Add BodyParser to parse Keys from URL Encoding and from JSON Body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

router.get('/', (req, res, next) => {
    res.status(200).json({message: "Call OK"})
})

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            status: error.status,
            message: error.message
        }
    })
})
