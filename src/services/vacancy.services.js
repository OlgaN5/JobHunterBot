const axios = require('axios')

class VacancyService {
  async getVacancies(query, page) {

    const params = {
      per_page: 1,
      page: page || 0
    }
    const vac = await axios.get(`https://api.hh.ru/vacancies?text=${query}`, {
      params,
      headers: {
        'User-Agent': 'JobHunterBot'
      }
    })
    // console.log(vac)
    return vac.data

  }
  async getVacancy(vacancyId) {
    const vac = await axios.get(`https://api.hh.ru/vacancies/${vacancyId}`, {
      // params,
      headers: {
        'User-Agent': 'JobHunterBot'
      }
    })
    return vac.data
  }
  // async.
}
module.exports = new VacancyService()