const express = require('express')
const router = express.Router()
const botController = require('../controllers/bot.controller')
router.post(`/bot${process.env.TG_TOKEN}`, botController.eventHandle)
router.get(`/bot${process.env.TG_TOKEN}`, botController.auth)

module.exports = router