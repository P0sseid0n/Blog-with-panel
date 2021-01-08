const Sequelize = require('sequelize')
const connection = require('../database/connection')

const Category = connection.define('category', {
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


Category.sync({ force: false })

module.exports = Category