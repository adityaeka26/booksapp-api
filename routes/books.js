const errors = require('restify-errors')
const rjwt = require('restify-jwt-community')
const Book = require('../models/Book')
const User = require('../models/User')
const Author = require('../models/Author')
const config = require('../config')
const auth = require('../middleware/auth')

module.exports = (server) => {
    // Get books
    server.get('/books', rjwt({ secret: config.JWT_SECRET }), auth.authorize(['visitor']), async (req, res, next) => {
        try {
            const books = await Book.find({})
            res.send(books)
            next()
        } catch(err) {
            return next(new errors.InvalidContentError(err))
        }
    })

    // Get single book
    server.get('/books/:id', rjwt({ secret: config.JWT_SECRET }), auth.authorize(['visitor']), async (req, res, next) => {
        try {
            const book = await Book.findById(req.params.id).populate('author')
            if (book) {
                res.send(book)
                next()
            } else {
                return next(new errors.ResourceNotFoundError(`There is no book with the id of ${req.params.id}`))
            }                    
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no book with the id of ${req.params.id}`))
        }
    })

    // Add book
    server.post('/books', rjwt({ secret: config.JWT_SECRET }), auth.authorize(['admin']), async (req, res, next) => {
        // Check for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        const { title, author, publisher } = req.body
        
        const book = new Book({
            title,
            author,
            publisher
        })

        try {
            const newBook = await book.save()
            const author = await Author.findOne({ _id: req.body.author })
            await author.books.push(newBook)
            author.save()
            res.send(201)
            next()
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }
    })

    // Update book
    server.put('/books/:id', rjwt({ secret: config.JWT_SECRET }), auth.authorize(['admin']), async (req, res, next) => {
        // Check for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        try {
            const book = await Book.findOneAndUpdate({ _id: req.params.id }, req.body)
            if (book) {
                res.send(200)
                next()
            } else {
                return next(new errors.ResourceNotFoundError(`There is no book with the id of ${req.params.id}`))
            }
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no book with the id of ${req.params.id}`))
        }
    })

    // Delete book
    server.del('/books/:id', rjwt({ secret: config.JWT_SECRET }), auth.authorize(['admin']), async (req, res, next) => {
        try {
            const book = await Book.findOneAndDelete({ _id: req.params.id })
            if (book) {
                res.send(204)
                next()
            } else {
                return next(new errors.ResourceNotFoundError(`There is no book with the id of ${req.params.id}`))
            }
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no book with the id of ${req.params.id}`))
        }
    })
}