const Sequelize = require('sequelize')
// console.log(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, 
//   process.env.DB_HOST,
//     process.env.DIALECT)
module.exports = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT
})