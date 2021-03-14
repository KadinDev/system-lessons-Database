const { urlencoded } = require('express')
const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')

const methodOverride = require('method-override')

const server = express()

server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))

// tem que ser antes do routes
server.use(methodOverride('_method'))

server.use(routes)

server.set('view engine', 'njk')

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(2000, function(){
    console.log('server running')
})