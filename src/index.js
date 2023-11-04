require('dotenv').config()
const express = require('express')
const startBot = require('./utils/startBot')
const app = express()
const port = process.env.PORT || 4000

app.listen(port, () => {
    startBot()
    console.log(`server started on port ${port} `)
})