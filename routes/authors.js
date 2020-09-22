const errors = require('restify-errors')
const Author = require('../models/Author')
const rjwt = require('restify-jwt-community')
const config = require('../config')
const auth = require('../middleware/auth')

module.exports = (server) => {
    // Get authors
    server.get('/authors', rjwt({ secret: config.JWT_SECRET }), auth.authorize(['admin']), async (req, res, next) => {
        try {
            const authors = await Author.find({})
            res.send(authors)
            next()
        } catch(err) {
            return next(new errors.InvalidContentError(err))
        }
    })

    // Get single author
    server.get('/authors/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        try {
            const author = await Author.findById(req.params.id)
            if (author) {
                res.send(author)
            } else {
                return next(new errors.ResourceNotFoundError(`There is no author with the id of ${req.params.id}`))
            }            
            next()
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no author with the id of ${req.params.id}`))
        }
    })

    // Add author
    server.post('/authors', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        // Check for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        const { name, gender, books } = req.body
        
        const author = new Author({
            name,
            gender,
            books
        })

        try {
            const newAuthor = await author.save()
            res.send(201)
            next()
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }
    })

    // Update author
    server.put('/authors/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        // Check for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        try {
            const author = await Author.findOneAndUpdate({ _id: req.params.id }, req.body)
            res.send(200)
            next()
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no author with the id of ${req.params.id}`))
        }
    })

    // Delete author
    server.del('/authors/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        try {
            const author = await Author.findOneAndDelete({ _id: req.params.id })
            res.send(204)
            next()
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no author with the id of ${req.params.id}`))
        }
    })
}