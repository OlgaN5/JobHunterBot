const authService = require('../services/authService')
const botHandler = require('../telegram.lib/botHandler')
class BotController {
    async auth(req, res) {
        try {
            await authService.getToken(req.query.code, req.query.state)
            res.sendStatus(200)
        } catch (e) {
            res.status(500)
        }
    }
    async eventHandle(req, res) {
        try {
            console.log(req.body)
            console.log(req.query.code)
            // if ()
            await botHandler.messageHandler(req.body.message)
            res.sendStatus(200)
        } catch (e) {
            res.status(500)
        }
    }
}
module.exports = new BotController()