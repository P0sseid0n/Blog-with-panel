const bodyParser = require('body-parser')

const express = require('express')
const app = express()

const categoriesCtllr = require('./categories/controller')
const articlesCtllr = require('./articles/controller')
const adminCtllr = require('./admin/controller')

const categoriesModel = require('./categories/model')
const articlesModel = require('./articles/model')
const adminModel = require('./admin/model')

const connection = require('./database/connection')

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

connection.authenticate().then(() => console.log('Authenticated')).catch(erro => console.log('Authentication failed', erro))


app.get('/', async (req, res) => {
    const categories = await categoriesModel.findAll({ include: [{ model: articlesModel }] })
    const articles = await articlesModel.findAll({
        order: [ ['id', 'DESC'] ],
        raw: true
    })
    res.render('index', { categories, articles })
})

app.get('/article/:slug', async (req, res) => {
    const article = await articlesModel.findOne({
        where: { slug: req.params.slug },
        include: [{ model: categoriesModel }]
    })

    if(!article) return res.redirect('/')

    const categories = await categoriesModel.findAll({ raw: true })
    res.render('read-article', { article, categories })
})

app.get('/category/:slug', async (req, res) => {
    const category = await categoriesModel.findOne({ 
        where: { slug: req.params.slug }, 
        include: [{ model: articlesModel }]
    })
    console.log(await category.articles.length)

    if(!category) return res.redirect('/')
    
    const categories = await categoriesModel.findAll({ raw: true })
    
    res.render('view-categories', { category, categories })
})

app.use('/categories', categoriesCtllr)
app.use('/articles', articlesCtllr)
app.use('/admin', adminCtllr)


app.listen(3000, () => console.log('OK'))