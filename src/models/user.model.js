const Sequelize = require('sequelize')
const db = require('../config/database')
module.exports = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    tgId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    resumeId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    authTokenHH: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
    },
    refreshTokenHH: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
    },
    coveringLetter: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false
    }
})