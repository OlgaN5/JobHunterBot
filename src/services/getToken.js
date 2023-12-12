const axios = require('axios')

async function getToken() {
    const params = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "client_credentials"
    }
    const token = await axios.post('https://hh.ru/oauth/token', {}, {
        params,
        headers: {
            'User-Agent': 'JobHunterBot'
        }
    })
    console.log(token)
}
getToken()

// "access_token": "APPLTFLANNPR27K5LRGP0UE484KBTES0IND7UH4BTTMU8JM1M4UN0RBURVAJJSBS"