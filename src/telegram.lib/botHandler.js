const vacancyService = require('../services/vacancy.services')
const showdown = require('showdown'),
    converter = new showdown.Converter()
const TelegramBot = require('node-telegram-bot-api')
const {
    startOptions,
    currencyOptions,
    startSearchOptions,
    mainOptions,
    filterOptions
} = require('./options')

class BotHandler {
    // curentPage
    // next = 0
    // prev = -2
    // isQueryMode
    operation = null
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
    async getDisplay() {
        const vacancies = await vacancyService.getVacancies(this.queryParams)
        const vacancy = await vacancyService.getVacancy(vacancies.items[0].id)
        const name = this.escape(vacancy.name)
        const url = this.escape(vacancy.alternate_url)
        // const desc = this.escape(vacancy.description)
        const keySkills = this.escape(vacancy.key_skills.map((item) => item.name).join(', '))
        // console.log(vacancy)
        // console.log(vacancy.description)
        // console.log(desc)
        // console.log(converter.makeMarkdown(vacancy.description))
        this.vacancyId = vacancy.id
        const result = {
            name: name,
            salary: vacancy.salary || 'не указана',
            url: url,
            experience: vacancy.experience.name,
            key_skills: keySkills.length !== 0 ? keySkills : 'Не указаны',
            // description: desc|| 'не указана',
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
        const methods = {
            '/start': async () => {
                await this.bot.sendMessage(chatId, `Введите /auth для авторизации или /get для поиска вакансий без авторизации. Без авториации вы не сможете откликаться на вакансии`)
            },
            '/get': async () => {
                this.operation = 'enterQuery'
                this.queryParams = {}
                await this.bot.sendMessage(chatId, `Введите запрос`)
            },
            '/auth': async () => {
                await this.bot.sendMessage(chatId, `Перейдите по ссылке ${authURL} `)
            },
            'Продолжить поиск': async () => {
                if (this.queryParams.text) {
                    const display = await this.getDisplay()
                    await this.bot.sendMessage(chatId, display, mainOptions)
                } else {
                    this.operation = 'enterQuery'
                    await this.bot.sendMessage(chatId, `Предыдущий запрос отсутствует. Введите новый`)
                }
            },
            'Начать поиск': async () => {
                this.operation = 'enterQuery'
                this.queryParams = {}
                await this.bot.sendMessage(chatId, `Введите запрос`)
            },
            'Установить резюме для отклика': async () => {
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
            },
            'Написать письмо для отклика': async () => {
                this.operation = 'setCoveringLetter'
                await this.bot.sendMessage(chatId, 'Введите письмо')
            },
            'Откликнуться': async () => {
                const resuls = await vacancyService.entertainVacancy(msg.from.id, this.vacancyId)
                await this.bot.sendMessage(chatId, resuls, mainOptions)
            },
            'Получить первую вакансию': async () => {
                this.queryParams.page = 0
                const display = await this.getDisplay()
                // this.next++
                // this.prev++
                await this.bot.sendMessage(chatId, display, mainOptions)
            },
            'Вперед': async () => {
                this.queryParams.page++
                const display = await this.getDisplay()
                // this.next++
                // this.prev++
                await this.bot.sendMessage(chatId, display, mainOptions)
            },
            'Назад': async () => {
                console.log(this.queryParams)
                if (this.queryParams.page === 0) {
                    await this.bot.sendMessage(chatId, 'Это первая вакансия', mainOptions)
                } else {
                    this.queryParams.page--
                    const display = await this.getDisplay()
                    console.log('222222222')
                    console.log(display)
                    // this.next--
                    // this.prev--
                    await this.bot.sendMessage(chatId, display, mainOptions)
                }
            },
            'Первая вакансия': async () => {
                this.queryParams.page = 0
                const display = await this.getDisplay()
                await this.bot.sendMessage(chatId, display, mainOptions)
            },
            // 'Добавить фильтр': async () => {
            //     this.operation = 'addFilter'
            //     await this.bot.sendMessage(chatId, 'Выберите фильтр, который нужно добавить', filterOptions)
            // },
            // 'Город': async () => {
            //     this.operation = 'addFilterArea'
            // }
        }
        const methodsOperation = {
            'setCoveringLetter': async () => {
                await vacancyService.setCoveringLetter(msg.from.id, messageText)
                await this.bot.sendMessage(chatId, 'Письмо для отклика установлено', startOptions)
                this.operation = null
            },
            'setResume': async () => {
                console.log(this.resumeList)
                if (Number.isInteger(+messageText) && this.resumeList[+messageText - 1]) {
                    await vacancyService.setResume(msg.from.id, this.resumeList[+messageText - 1].id)
                    await this.bot.sendMessage(chatId, 'Резюме для отклика установлено', startOptions)
                }
                this.operation = null
            },
            'enterQuery': async () => {
                console.log('neeeen')
                this.queryParams.text = messageText
                console.log(this.queryParams.text = messageText)
                this.operation = null
                await this.bot.sendMessage(chatId, 'Выберите действие', startSearchOptions)
            }

        }

        if (this.operation === null && methods[messageText]) {
            console.log('111')
            await methods[messageText]()
        } else if (this.operation !== null && methodsOperation[this.operation]) {
            methodsOperation[this.operation]()
        }
    }
}



module.exports = new BotHandler()
// class HelperBot {

//     messageHandler = async (msg) => {
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