const axios = require('axios')
const User = require('../models/user.model')
class VacancyService {
  async getVacancies(variableParams) {
    const constParams = {
      per_page: 1,
    }
    const params = {
      ...constParams,
      ...variableParams,
    }
    console.log(params)
    const vac = await axios.get(`https://api.hh.ru/vacancies`, {
      params,
      headers: {
        'User-Agent': 'JobHunterBot'
      }
    })
    return vac.data

  }
  async getAreaId(query) {
    const params = {
      text: query
    }
    // console.log(params)
    return (await axios.get('https://api.hh.ru/suggests/areas', {
      params,
      headers: {
        'User-Agent': 'JobHunterBot'
      }
    })).data.items[0].id
  }
  async getVacancy(vacancyId) {
    const vac = await axios.get(`https://api.hh.ru/vacancies/${vacancyId}`, {
      headers: {
        'User-Agent': 'JobHunterBot'
      }
    })
    return vac.data
  }
  async getResumes(userId) {
    const user = await User.findOne({
      where: {
        tgId: userId
      }
    })
    console.log(user)
    return await axios.get(`https://api.hh.ru/resumes/mine`, {
      headers: {
        'HH-User-Agent': 'JobHunterBot',
        'Authorization': `Bearer ${user.dataValues.authTokenHH}`
      }
    })

  }
  async setResume(userId, resumeId) {
    console.log(userId, resumeId)
    await User.update({
      resumeId
    }, {
      where: {
        tgId: +userId
      }
    })
  }
  async setCoveringLetter(userId, text) {
    console.log(userId, text)
    await User.update({
      coveringLetter: text
    }, {
      where: {
        tgId: +userId
      }
    })
  }
  async entertainVacancy(userId, vacancyId) {
    const user = await User.findOne({
      where: {
        tgId: +userId
      }
    })
    if (user == null || user.dataValues.authTokenHH == null) return 'Вы не авторизованы и не можете отправить отклик. Для авторизации введите /auth'

    const result = await axios.post(`https://api.hh.ru/negotiations`, {}, {
      params: {
        vacancy_id: vacancyId,
        resume_id: user.dataValues.resumeId,
        message: user.dataValues.coveringLetter
      },
      headers: {
        'Authorization': `Bearer ${user.dataValues.authTokenHH}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log(result.data)
    return 'Отклик отправлен'
  }
}
module.exports = new VacancyService()