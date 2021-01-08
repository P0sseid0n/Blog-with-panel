const Sequelize = require('sequelize')
const connection = require('../database/connection')
const Category = require('../categories/model')

const Article = connection.define('article', {
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article)
Article.belongsTo(Category)

Article.sync({ force: false })

module.exports = Article