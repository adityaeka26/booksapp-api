const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    }
})

BookSchema.plugin(timestamp)

const Book = mongoose.model('Book', BookSchema)

module.exports = Book