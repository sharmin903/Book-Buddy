const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require ('fs')
const Book = require('../models/book')
const uploadPath = path.join(__dirname, '..', 'public', Book.coverImageBasePath)
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter:(req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//all books routes
router.get('/', async (req,res)=>{
    try{
        const books = await Book.find({})
res.render('books/index',{books: books, searchOptions: req.query})
    }
    catch{
        res.redirect('/')
    }
    
})

//new book routes
router.get('/new', async (req,res)=>{
    renderNewPage(res, new Book())
})

//create book routes
router.post('/', upload.single('cover'), async (req,res)=>{
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName,
    })
    try{
        const newBook = await book.save()
        res.redirect('/books')
    }
    catch(error){
        if (book.coverImageName != null){
        removeBookCover(book.coverImageName)
    }
        renderNewPage(res, book, true)
    }
})
function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath,fileName), err =>{
        if (err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book  
        }
        if (hasError) params.errorMessage = 'Error Creating Book'   

        res.render("books/new", params)
    }
    catch{
        res.redirect('/books')
    }
}

module.exports = router