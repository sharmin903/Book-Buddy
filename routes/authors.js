const express = require('express')
const router= express.Router()
const Author = require('../models/author')
//all author routes
router.get('/',(req,res)=>{
    res.render('authors/index')
})
//new author routes
router.get('/new',(req,res)=>{
    res.render('authors/new' ,{author: new Author()})
})
//create author routes
router.post('/',(req,res)=>{
    res.send(req.body.name)
})

module.exports = router
