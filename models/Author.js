const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    gender: {
        type: String,
        required: true 
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }]
})

AuthorSchema.plugin(timestamp)

const Author = mongoose.model('Author', AuthorSchema)

module.exports = Author