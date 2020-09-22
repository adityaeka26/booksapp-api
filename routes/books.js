const errors = require('restify-errors')
const Book = require('../models/Book')
const rjwt = require('restify-jwt-community')
const config = require('../config')

module.exports = (server) => {
    // Get books
    server.get('/books', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        try {
            const books = await Book.find({})
            res.send(books)
            next()
        } catch(err) {
            return next(new errors.InvalidContentError(err))
        }
    })

    // Get single book
    server.get('/books/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        try {
            const book = await Book.findById(req.params.id)
            res.send(book)
            next()
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`))
        }
    })

    // Add book
    server.post('/books', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
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
            res.send(201)
            next()
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }
    })

    // Update book
    server.put('/books/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        // Check for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        try {
            const book = await Book.findOneAndUpdate({ _id: req.params.id }, req.body)
            res.send(200)
            next()
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`))
        }
    })

    // Delete book
    server.del('/books/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        try {
            const book = await Book.findOneAndDelete({ _id: req.params.id })
            res.send(204)
            next()
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`))
        }
    })
}