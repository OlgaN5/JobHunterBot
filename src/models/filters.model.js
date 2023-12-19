const Sequelize = require('sequelize')
const db = require('../config/database')
module.exports = db.define('filter', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    area: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    experience: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        referenses: {
            model: 'user',
            key: 'id'
        }
    }

})
