const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

const Categories = require('./categories/Category');
const Articles = require('./articles/Article');
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/Users');

app.set('view engine', 'ejs');

app.use(session({
  secret: 'qualquerCoisa',
  cookie: {
    maxAge: 30000000,
  }
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'))

connection.authenticate()
  .then(() => console.log('Banco de dados conectado'))
  .catch((error) => {
    console.log('Error ao conectar com banco de dados');
    console.log(error)
  })

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.get('/', (req, res) => {

  Article.findAll({
    order: [
      ['id','DESC']
    ],
    limit: 4,
  }).then(articles => {

    Category.findAll().then(categories => {
      res.render('index', {articles, categories});
    })
  })
})

app.get('/:slug', (req, res) => {
  var slug = req.params.slug;

  Article.findOne({
    where: {
      slug,
    }
  }).then(article => {
    if(article != undefined){
      Category.findAll().then(categories => {
        res.render('article', { article, categories })
      })
    }else{
      res.redirect('/')
    }
  }).catch(() => res.redirect('/'));
})

app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug;

  Category.findOne({
    where: {
      slug,
    },
    include: [{model: Article}]
  }).then(category => {
    if(category != undefined){
      Category.findAll().then(categories => {
        res.render('index', { articles: category.articles,  categories })
      })
    }else{
      res.redirect('/')
    }
  }).catch(() => res.redirect('/'));
})


app.listen(process.env.PORT || 8080, (err) => {
  if(err){
    console.log(err);
  }else{
    console.log('Servidor rodando');
  }
})