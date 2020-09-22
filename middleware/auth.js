const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const errors = require('restify-errors')
const User = mongoose.model('User')
const config = require('../config')

module.exports = {
    authenticate: (email, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Get user by email
                const user = await User.findOne({ email })
                // Match the password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err
                    }
    
                    if (isMatch) {
                        resolve(user)
                    } else {
                        reject('Authentication failed')
                    }
                })
            } catch(err) {
                reject('Authentication failed')
            }
        })
    },
    authorize: (roles) => {
        const middleware = (req, res, next) => {
            const usertoken = req.headers.authorization
            const token = usertoken.split(' ')
            const decoded = jwt.verify(token[1], config.JWT_SECRET)

            const found = decoded.roles.some(r=> roles.indexOf(r) >= 0)
            if (!found) {
                next(new errors.UnauthorizedError('Unauthorized role'))
            }
            next()
        }
        return middleware
    }
}
