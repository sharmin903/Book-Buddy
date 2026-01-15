const express = require('express')
const router= express.Router()
const book = require('../models/book')
const Author = require('../models/author')

//all books routes
router.get('/', async (req,res)=>{
    res.send('All Books')
})
//new author routes
router.get('/new', async (req,res)=>{
    try{
        const authors = await Author .find({})
        const book = new Book()
        res.render("books/new", {
            book: book,
            authors: authors,
            errorMessage: "Error creating Book"
        })
    }
    catch{
        res.redirect('/books')
    }
})

//create book routes
router.post('/', async (req,res)=>{
     res.send('create Books')
})


module.exports = router
