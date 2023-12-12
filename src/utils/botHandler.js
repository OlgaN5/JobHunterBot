const vacancyService = require('../services/vacancy.services')
const TelegramBot = require('node-telegram-bot-api')
const {
    startOptions,
    currencyOptions,
    startSearchOptions,
    mainOptions,
    filterOptions
} = require('./options')

class BotHandler {
    next = 0
    prev = -2
    // isQueryMode
    operation
    queryParams = {}
    chatIdGlobal
    vacancyId
    constructor() {
        this.bot = new TelegramBot(process.env.TG_TOKEN, {
            webHook: {
                port: 3000,
            }
        })
    }
    escape(text) {
        return text.replace(/[_*\[\]()~`>#\+\-=|{}.!]/g, '\\$&');
    }
    async getDisplay(page) {

        const vacancies = await vacancyService.getVacancies(this.queryParams, page)
        const vacancy = await vacancyService.getVacancy(vacancies.items[0].id)
        const name = this.escape(vacancy.name)
        const url = this.escape(vacancy.alternate_url)
        const keySkills = this.escape(vacancy.key_skills.map((item) => item.name).join(', '))
        console.log(vacancy)
        this.vacancyId = vacancy.id
        const result = {
            name: name,
            salary: vacancy.salary || 'не указана',
            url: url,
            experience: vacancy.experience.name,
            key_skills: keySkills.length !== 0 ? keySkills : 'Не указаны'
        }
        const display = `
            *Краткая информация*:
        
Название вакансии: ${result.name}\nЗаработная плата: от ${result.salary?.from||'не указана'} до ${result.salary?.to||'не указана'} ${result.salary?.currency||''} \nНавыки: ${result.key_skills}
Experience: ${result.experience}\nПодробнее по ссылке: ${result.url} 
            `
        return display
    }
    sendMessage = async (text) => {
        await this.bot.sendMessage(this.chatIdGlobal, text, startOptions)
    }

    messageHandler = async (msg) => {
        const authURL = `https://hh.ru/oauth/authorize?response_type=code&client_id=Q6LS2OENGV6LUMOVMQPC9AT5OCP21M9JIIDOKID8OPV2NJ86GTNC748SNN2AJGUE&state=${msg.from.id}`
        const chatId = msg.chat.id
        this.chatIdGlobal = chatId
        const messageText = msg.text
        console.log(messageText)
        switch (messageText) {
            case '/auth':
                await this.bot.sendMessage(chatId, `Перейдите по ссылке ${authURL} `)
                break
            case 'Начать поиск':
                this.operation = 'enterQuery'
                await this.bot.sendMessage(chatId, `Введите запрос`)
                break
            case 'Установить резюме для отклика':
                this.operation = 'setResume'
                const resumes = await vacancyService.getResumes(msg.from.id)
                this.resumeList = resumes.data.items
                console.log(this.resumeList)
                let countResume = 1
                for (let item of this.resumeList) {
                    await this.bot.sendMessage(chatId, `${countResume}. ${item.title}`, startOptions)
                    countResume++
                }
                await this.bot.sendMessage(chatId, 'Введите номер резюме')
                console.log(resumes.data.items)
                break
            case 'Написать письмо для отклика':
                this.operation = 'setCoveringLetter'
                await this.bot.sendMessage(chatId, 'Введите письмо')
                break
            case 'Откликнуться':
                const resuls = await vacancyService.entertainVacancy(msg.from.id, this.vacancyId)
                await this.bot.sendMessage(chatId, resuls, startOptions)
                break
                // case 'Город':
                //     const areas = messageText.split(',')
                //     const areasId = await Promise.all(areas.map(async (item) => await vacancyService.getAreaId(item)))
                //     this.variableParams.area = areasId.join(':')
                //     console.log(this.variableParams.area)
                //     await this.bot.sendMessage(chatId, 'Выберите действие', startOptions)
                //     break
                // case 'Опыт':
                //     this.variableParams.experience = messageText
                //     // console.log(variableParams)
                //     await this.bot.sendMessage(chatId, 'Выберите действие', startOptions)
                //     break
                // case 'Заработная плата':
                //     this.variableParams.salary = +messageText
                //     console.log(this.variableParams.salary)
                //     await this.bot.sendMessage(chatId, 'Выберите валюту', currencyOptions)
                //     break
            case 'Получить первую вакансию':
                const display = await this.getDisplay()
                this.next++
                this.prev++
                await this.bot.sendMessage(chatId, display, mainOptions)
                break
            case 'Вперед':
                const display2 = await this.getDisplay(this.next)
                this.next++
                this.prev++
                await this.bot.sendMessage(chatId, display2, mainOptions)
                break
            default:
                switch (this.operation) {
                    case 'setCoveringLetter':
                        await vacancyService.setCoveringLetter(msg.from.id, messageText)
                        await this.bot.sendMessage(chatId, 'Письмо для отклика установлено', startOptions)
                        this.operation = null
                        break
                    case 'setResume':
                        console.log(this.resumeList)
                        if (Number.isInteger(+messageText) && this.resumeList[+messageText - 1]) {
                            await vacancyService.setResume(msg.from.id, this.resumeList[+messageText - 1].id)
                            await this.bot.sendMessage(chatId, 'Резюме для отклика установлено', startOptions)
                        }
                        this.operation = null
                        break
                    case 'enterQuery':
                        console.log('neeeen')
                        this.queryParams.text = messageText
                        console.log(this.queryParams.text = messageText)
                        await this.bot.sendMessage(chatId, 'Выберите действие', startSearchOptions)
                        break
                    default:
                        console.log('default')
                        // this.queryParams.text = messageText
                        // console.log(this.queryParams.text = messageText)
                        // await this.bot.sendMessage(chatId, 'Выберите действие', startSearchOptions)
                }

        }
    }
}

module.exports = new BotHandler()
// class HelperBot {
//     // const token = '6940603431:AAFFLUTuL8tndTrIhJ7ixIeA_Yl783YPo9M' prodaction
//     next
//     prev
//     isQueryMode = false
//     query = ''
//     msgId
//     // getBot() {
//     //     return this.bot
//     // }
//     variableParams = {
//         area: null,
//         experience: null,
//         salary: null,
//         currency: null
//     }
//     //helper
//     escape(text) {
//         return text.replace(/[_*\[\]()~`>#\+\-=|{}.!]/g, '\\$&');
//     }
//     async getDisplay(page) {

//         const vacancies = await vacancyService.getVacancies(this.query, page, this.variableParams)
//         const vacancy = await vacancyService.getVacancy(vacancies.items[0].id)
//         const name = this.escape(vacancy.name)
//         const url = this.escape(vacancy.alternate_url)
//         const keySkills = this.escape(vacancy.key_skills.map((item) => item.name).join(', '))
//         console.log(vacancy)
//         // console.log(vacancy.key_skills)
//         const result = {
//             name: name,
//             salary: vacancy.salary || 'не указана',
//             url: url,
//             experience: vacancy.experience.name,
//             // schedule:
//             // description:
//             key_skills: keySkills.length !== 0 ? keySkills : 'Не указаны'
//         }
//         const display = `
//     *Краткая информация*:

// Название вакансии: ${result.name}\nЗаработная плата: от ${result.salary?.from||'не указана'} до ${result.salary?.to||'не указана'} ${result.salary?.currency||''} \nНавыки: ${result.key_skills}
// Experience: ${result.experience}\nПодробнее по ссылке: ${result.url} 
//     `
//         return display
//     }
//     messageHandler = async (msg) => {
//         const URL = `https://hh.ru/oauth/authorize?response_type=code&client_id=Q6LS2OENGV6LUMOVMQPC9AT5OCP21M9JIIDOKID8OPV2NJ86GTNC748SNN2AJGUE`
//         const chatId = msg.chat.id
//         const messageText = msg.text
//         console.log(this)
//         if (messageText === '/code') {
//             console.log(msg)
//         }
//         if (messageText === '/auth') {
//             await bot.sendMessage(chatId, `Перейдите по ссылке ${URL} `)
//             // await vacancyService.getUserToken()
//             await bot.sendMessage(chatId, 'Авторизация прошла успешно', startOptions)

//         }
//         if (messageText === '/start') {
//             await bot.sendMessage(chatId, 'Чтобы начать поиск введите /get. Для авторизации /auth')
//         }
//         if (messageText === '/get') {
//             console.log('11')
//             this.isQueryMode = true
//             await bot.sendMessage(chatId, 'Введите запрос')

//         }
//         if (this.isQueryMode && messageText !== '/get' && messageText !== '/start' && messageText !== '/auth') {
//             this.isQueryMode = false
//             this.query = messageText
//             this.next = 0
//             this.prev = -2
//             this.msgId = (await bot.sendMessage(chatId, 'Нажми кнопку, чтобы начать', startOptions)).message_id
//         }

//         if (this.variableParams.area === 'EnterAreas') {
//             const areas = messageText.split(',')
//             const areasId = await Promise.all(areas.map(async (item) => await vacancyService.getAreaId(item)))
//             this.variableParams.area = areasId.join(':')
//             console.log(this.variableParams.area)
//             await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//         }
//         if (this.variableParams.experience === 'EnterExperience') {
//             this.variableParams.experience = messageText
//             // console.log(variableParams)
//             await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//         }
//         if (this.variableParams.salary === 'EnterSalary') {
//             this.variableParams.salary = +messageText
//             console.log(this.variableParams.salary)
//             await bot.sendMessage(chatId, 'Выберите валюту', currencyOptions)
//         }
//     }
//     callbackQueryHandler = async (msg) => {

//         const chatId = msg.message.chat.id
//         const msgData = msg.data
//         switch (msgData) {
//             case 'firstVacancy':
//                 const display = await this.getDisplay()
//                 this.next++
//                 this.prev++
//                 // await bot.editMessageReplyMarkup(chatId, msgId, keyboard)
//                 await bot.sendMessage(chatId, display, mainOptions)
//                 break;
//             case 'addFilters':
//                 await bot.sendMessage(chatId, 'Выберите фильтр', filterOptions)
//                 break;
//             case 'nextVacancy':
//                 const display2 = await this.getDisplay(this.next)
//                 this.next++
//                 this.prev++
//                 await bot.sendMessage(chatId, display, mainOptions)
//                 break;
//             case 'prevVacancy':
//                 const display3 = await this.getDisplay(this.prev)
//                 this.next--
//                 this.prev--
//                 await bot.sendMessage(chatId, display, mainOptions)
//                 break;
//             case 'newQuery':
//                 await bot.sendMessage(chatId, 'Введите /get')
//                 break;
//             case 'resetFilters':
//                 this.variableParams.area = null
//                 this.variableParams.salary = null
//                 this.variableParams.currency = null
//                 this.variableParams.experience = null
//                 await bot.sendMessage(chatId, 'Фильтры сброшены', mainOptions)
//                 break;
//             case 'filterAreas':
//                 this.variableParams.area = 'EnterAreas'
//                 await bot.sendMessage(chatId, 'Введите город/страну')
//                 break;
//             case 'filterSalary':
//                 this.variableParams.salary = 'EnterSalary'
//                 await bot.sendMessage(chatId, 'Введите зп')
//                 break;
//             case 'filterExperience':
//                 this.variableParams.experience = 'EnterExperience'
//                 await bot.sendMessage(chatId, 'Выберите опыт', experienceOptions)
//                 break;
//             case 'experienceMoreThan6':
//                 this.variableParams.experience = 'moreThan6'
//                 await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//                 break;
//             case 'experienceBetween3And6':
//                 this.variableParams.experience = 'between3And6'
//                 await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//                 break;
//             case 'experienceBetween1And3':
//                 this.variableParams.experience = 'between1And3'
//                 await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//                 break;
//             case 'noExperience':
//                 this.variableParams.experience = 'noExperience'
//                 await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//                 break;
//             case 'currencyByn':
//                 this.variableParams.currency = 'BYR'
//                 await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//                 break;
//             case 'currencyRub':
//                 this.variableParams.currency = 'RUR'
//                 await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//                 break;
//             case 'currencyUsd':
//                 this.variableParams.currency = 'USD'
//                 await bot.sendMessage(chatId, 'Выберите действие', startOptions)
//                 break;
//         }

//     }
// }

// module.exports = {
//     helperBot: new HelperBot(),
//     bot
// }