const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const bcrypt = require('bcryptjs')

const Category = require('../categories/model')
const Article = require('../articles/model')
const Admin = require('../admin/model')

router.get('/', async (req, res) => {
    res.render('admin/admin')
})

router.get('/list', async (req, res) => {
    const admins = await Admin.findAll()

    res.render('admin/list', { admins })
})

router.get('/add', async (req, res) => {
    res.render('admin/add')
})

router.post('/add', async (req, res) => {
    const { username, password } = req.body

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    await Admin.create({ username, password: hash  })

    res.redirect('/admin/list')
})

router.post('/remove', async (req, res) => {
    const { id } = req.body

    await Admin.destroy({ where: { id }  })

    res.redirect('/admin/list')
})


router.get('/categories', async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    res.render('admin/categories/categories', { categories })
})

router.get('/categories/new', (req, res) => {
    res.render('admin/categories/new-category')
})

router.post('/categories/save', async (req, res) => {
    const name = req.body.category
    if(!name) return res.redirect(req.header('Referer'))

    await Category.create({ slug: slugify(name), name  })

    res.redirect('/admin/categories')
})

router.get('/categories/edit/:id', async (req, res) => {
    const category = await Category.findByPk(req.params.id, { raw: true })
    if(!category || isNaN(req.params.id)) return res.redirect('/admin/categories')
    res.render('admin/categories/edit-category', { category })
})

router.post('/categories/edit/update', async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    if(isNaN(id) || !name) return res.redirect('/admin/categories')

    await Category.update({ slug: slugify(name), name }, { where: { id } })

    res.redirect('/admin/categories')
})

router.post('/categories/delete', async (req, res) => {
    const id = req.body.id
    if(!id || isNaN(id)) return res.redirect(req.header('Referer'))

    await Article.destroy({ where: { categoryId: id } })

    await Category.destroy({ where: { id } })

    res.redirect('/admin/categories')
})


router.get('/articles', async (req, res) => {
    res.redirect('/admin/articles/page/0')
})

router.get('/articles/page/:page', async (req, res) => {
    const articlesByPage = 4

    let page
    if(req.params.page === undefined || isNaN(req.params.page)){
        page = 0
    } else {
        page = req.params.page
    }

    const articles = await Article.findAndCountAll({ 
        include: [{ model: Category }],
        limit: articlesByPage,
        offset: page * articlesByPage
    })

    let value = articles.count / articlesByPage

    if(Number.isInteger(value)){
        value -= 1
    } else {
        value = Math.floor(value)
    }

    if(page > value && articles.count > 0) return res.redirect(`/admin/articles/page/${value}`)

    res.render('admin/articles/articles', { articles , page: { current: page, last: value } })
})

router.get('/articles/new', async (req, res) => {
    const categories = await Category.findAll( { raw: true } )
    res.render('admin/articles/new-article', { categories })
})

router.post('/articles/save', async (req, res) => {
    const { title, categoryId, body } = req.body
    
    if(!title || !categoryId || !body) return res.redirect(req.header('Referer'))

    await Article.create({ slug: slugify(title), title, body, categoryId  })

    res.redirect('/admin/articles')
})

router.get('/articles/edit/:id', async (req, res) => {
    const id = req.params.id
    if(!id || isNaN(id)) return res.redirect(req.header('Referer'))

    const article = await Article.findOne({ where: { id }  })

    res.render('admin/articles/edit-article', { article })
})

router.post('/articles/edit/update', async (req, res) => {
    const { id, title, body } = req.body
    if(!id || !title || !body) return res.redirect(req.header('Referer'))

    await Article.update({ slug: slugify(title), title, body }, { where: { id } })

    res.redirect('/admin/articles')
})


router.post('/articles/delete', async (req, res) => {
    const id = req.body.id
    if(!id || isNaN(id)) return res.redirect(req.header('Referer'))

    await Article.destroy({ where: { id }  })

    res.redirect('/admin/articles')
})

module.exports = router