const express = require('express')
const router= express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/book')
const uploadPath = path.join('public',Book.coverImageBasePath)
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter:(req, file, callback) =>{
        callback(null,imageMimeTypes.includes(file.mimetype))
    }

})

//all books routes
router.get('/', async (req,res)=>{
    res.send('All Books')
})
//new author routes
router.get('/new', async (req,res)=>{
    renderNewPage(res,new Book())
})

//create book routes
router.post('/', upload.single('cover'), async (req,res)=>{
    const fileName = req.file != null ? req.file.filename : null
     const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publicationDate),
        pageCount: req.body.pageCount,
        description:req.body.description,
        coverImage: fileName,
    })
    try{
        const newBook = await book.save()
//removeBookCover(book.coverImage)
            res.redirect(`books`)
    }
    catch{
       renderNewPage(res, book, true)
    }
})

async function renderNewPage( res, book, hasError = false){
        try{
        const authors = await Author .find({})
        const params ={
            authors: authors,
            book: book  
        }
        if (hasError) params.errorMessage = 'Error Creating Book'   

        res.render("books/new", {
            book: book,
            authors: authors,
            errorMessage: "Error creating Book"
        })
    }
    catch{
        res.redirect('/books')
    }
}
module.exports = router
