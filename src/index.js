require('dotenv').config()
const cors = require('cors')
const express = require('express')
const startBot = require('./telegram.lib/startBot')
const app = express()
const port = process.env.PORT || 4000
const router = require('./routes/index.router')
const db = require('./config/database')
app.use(express.json())

async function start() {
    await db.authenticate()
    await db.sync({
        force: true
    })

    app.use(cors({
        origin: '*',
        credentials: true,
        methods: 'GET,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Authorization', 'Content-Type', "Access-Control-Allow-Headers", "Origin, X-Requested-With", "Content-Type", "Accept"],
        exposedHeaders: ['Authorization', 'Content-Type']
    }))
    app.listen(port, () => {
        startBot()
        console.log(`server started on port ${port} `)
    })
    app.use('/api', router)
}
start()