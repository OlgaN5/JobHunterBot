const axios = require('axios')
const User = require('../models/user.model')
const botHandler = require('../telegram.lib/botHandler')
class AuthService {
    getToken = async (code, userId) => {
        console.log(code)
        const params = {
            grant_type: 'authorization_code',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code
        }
        const token = await axios.post('https://hh.ru/oauth/token', {}, {
            params,
            headers: {
                'User-Agent': 'JobHunterBot'
            }
        })
        console.log(token)
        const foundUser = await User.findOne({
            where: {
                tgId: userId
            }
        })
        console.log(foundUser)
        if (foundUser) {
            await User.update({
                authTokenHH: token.data.access_token,
                refreshTokenHH: token.data.refresh_token
            }, {
                where: {
                    tgId: userId
                }
            })
        } else {
            console.log('7777777777777')
            const user = {
                tgId: userId,
                authTokenHH: token.data.access_token,
                refreshTokenHH: token.data.refresh_token
            }

            await User.create(user)
        }
        let timerId = setTimeout(() => this.refreshToken(token.data.refresh_token, userId), token.data.expires_in * 1000)
        // clearTimeout(timerId)
        console.log(token)
        await botHandler.sendMessage('Авторизация прошла успешно')
    }
    refreshToken = async (refreshToken, userId) => {
        const params = {
            grant_type: 'refresh_token',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            refresh_token: refreshToken
        }
        const token = await axios.post('https://hh.ru/oauth/token', {}, {
            params,
            headers: {
                'User-Agent': 'JobHunterBot'
            }
        })
        const dataToUpdate = {
            authTokenHH: token.data.access_token,
            refreshTokenHH: token.data.refresh_token
        }
        console.log(token)
        await Model.update(dataToUpdate, {
            where: {
                tgId: userId
            },
            raw: true
        })
        let timerId = setTimeout(this.refreshToken(token.data.refresh_token), token.data.expires_in)
    }
    // checkAuth = async () => {

    // }
}
module.exports = new AuthService()