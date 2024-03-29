require('dotenv').config()
const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/error')
const authRoute = require('./routes/auth-route')
const borrowRoute = require('./routes/borrows-route')
const bookRoute = require('./routes/book-route')
const memberRoute = require('./routes/member-route')
const recordRoute = require('./routes/record-route')

const app = express()

app.use(cors())
app.use(express.json())

// service
app.use('/auth', authRoute)
app.use('/borrow', borrowRoute)
app.use('/book', bookRoute)
app.use('/member', memberRoute)
app.use('/record', recordRoute)

// notFound
app.use( notFound )

// error
app.use(errorMiddleware)

let port = process.env.PORT || 8000
app.listen(port, ()=> console.log('Server on Port :', port))