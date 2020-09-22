const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author"
    },
    publisher: {
        type: String,
        required: true
    }
})

BookSchema.plugin(timestamp)

const Book = mongoose.model('Book', BookSchema)

module.exports = Book