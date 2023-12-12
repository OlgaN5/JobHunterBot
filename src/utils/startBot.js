const botHandler = require('./botHandler')
const bot = botHandler.bot
async function startBot() {
    try {

        // bot.setMyCommands([{
        //         command: '/start',
        //         description: 'Начать'
        //     },
        //     {
        //         command: '/get',
        //         description: 'Получить вакансию'
        //     }
        // ])
        bot.setWebHook(`${process.env.URL_LOCALHOST}/api/bot${process.env.TG_TOKEN}`)

        
    } catch (e) {
        console.log(e.message)
    }
}
module.exports = startBot