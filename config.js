module.exports = {
    ENV: process.env.BOOKSAPP_NODE_ENV || 'development',
    PORT: process.env.BOOKSAPP_PORT || 3000,
    URL: process.env.BOOKSAPP_BASE_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.BOOKSAPP_MONGODB_URI || 'mongodb://localhost:27017/booksdb',
    JWT_SECRET: process.env.BOOKSAPP_JWT_SECRET || 'secret1'
}