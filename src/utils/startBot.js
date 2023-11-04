const TelegramBot = require('node-telegram-bot-api')
const token = '6940603431:AAFFLUTuL8tndTrIhJ7ixIeA_Yl783YPo9M'
const vacancyService = require('../services/vacancy.services')
// process.env.TG_TOKEN
const bot = new TelegramBot(token, {
    polling: true
})

async function startBot() {
    let next
    let prev
    let isQueryMode = false
    let query = ''
    const startOptions = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{
                    text: 'Первая вакансия',
                    callback_data: 'firstVacancy'
                }],
            ]
        })
    }

    const getDislay = async (page) => {
        const escape = (text) => {
            return text.replace(/[_*\[\]()~`>#\+\-=|{}.!]/g, '\\$&');
        }
        const vacancies = await vacancyService.getVacancies(query, page)
        const vacancy = await vacancyService.getVacancy(vacancies.items[0].id)
        const name = escape(vacancy.name)
        const url = escape(vacancy.alternate_url)
        const keySkills = escape(vacancy.key_skills.map((item) => item.name).join(', '))
        console.log(vacancy)
        // console.log(vacancy.key_skills)
        const result = {
            name: name,
            salary: vacancy.salary || 'не указана',
            url: url,
            experience: vacancy.experience.name,
            // schedule:
            // description:
            key_skills: keySkills.length !== 0 ? keySkills : 'Не указаны'
        }
        const display = `
        *Краткая информация*:

Название вакансии: ${result.name}\nЗаработная плата: от ${result.salary?.from||'не указана'} до ${result.salary?.to||'не указана'} ${result.salary?.currency||''} \nНавыки: ${result.key_skills}
Experience: ${result.experience}\nПодробнее по ссылке: ${result.url} 
        `
        return display
    }
    bot.setMyCommands([{
            command: '/start',
            description: 'Начать'
        },
        {
            command: '/get',
            description: 'Получить вакансию'
        }
    ])

    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{
                    text: 'Новый запрос',
                    callback_data: 'newQuery'
                }],
                [{
                        text: 'Первая вакансия',
                        callback_data: 'firstVacancy',
                        // index: ''

                    },
                    {
                        text: 'Следующая вакансия',
                        callback_data: 'nextVacancy',
                        // index: next

                    },
                    {
                        text: 'Предыдущая вакансия',
                        callback_data: 'prevVacancy',
                        // index: prev

                    },
                    {
                        text: 'Получить ссылку',
                        callback_data: 'getUrl',
                    }

                ]

            ]
        }),
        parse_mode: 'MarkdownV2'
    }
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id
        const messageText = msg.text

        if (messageText === '/start') {
            await bot.sendMessage(chatId, 'Чтобы начать поиск введите /get')
        }
        if (messageText === '/get') {
            isQueryMode = true
            await bot.sendMessage(chatId, 'Введите запрос')

        }
        if (isQueryMode && messageText !== '/get' && messageText !== '/start') {
            isQueryMode = false
            query = messageText
            next = 0
            prev = -2
            await bot.sendMessage(chatId, 'Нажми кнопку, чтобы начать', startOptions)
        }

    })
    bot.on('callback_query', async (msg) => {

        const chatId = msg.message.chat.id
        if (msg.data === 'firstVacancy') {
            const display = await getDislay()
            next++
            prev++
            bot.sendMessage(chatId, display, options)
        }
        if (msg.data === 'nextVacancy') {
            const display = await getDislay(next)
            next++
            prev++
            bot.sendMessage(chatId, display, options)
        }
        if (msg.data === 'prevVacancy') {
            const display = await getDislay(prev)
            next--
            prev--
            bot.sendMessage(chatId, display, options)
        }
        if (msg.data === 'newQuery') {
            bot.sendMessage(chatId, 'Введите /get')
        }
    })
}
module.exports = startBot