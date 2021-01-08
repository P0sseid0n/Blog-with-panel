const Sequelize = require('sequelize')
const connection = require('../database/connection')

const Admin = connection.define('admins', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Admin.sync({ force: false })

module.exports = Admin