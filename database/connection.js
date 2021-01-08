const Sequelize = require('sequelize')

const connetion = new Sequelize('blog', 'root', 'PASSWORD', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timsezone: '-03:00'
})

module.exports = connetion