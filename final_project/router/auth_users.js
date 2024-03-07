
const express = require('express');
const jwt = require('jsonwebtoken');
const registered = express.Router();

let { books } = require('./booksdb.js');
let users = [];



// db connection not provided in the course



const isValid = (username) => {
    if (/^[a-z0-9]{2,8}$/.test(username)) {
        for (const one of users) {
            if (one.username === username)
                return 0
        }
        return 1
    }
}

const authenticatedUser = (username, password) => {
    for (const one of users) {
        if (one.username === username) {
            if (one.password === password) {
                return 1
            } else return 0
        }
    }
}



registered.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        const token = jwt.sign(
            { data: password },
            'secretOrPrivateKey',
            { expiresIn: '1h' }
        );
        req.session.authorization = { token, username }
        return res.status(200).json({ message: `${username} successfully loggeg in` })
    }
    return res.status(400).json({ message: "Invalid username and/or password" })
});



registered.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params['isbn'];
    if (books[isbn]) {
        if (req.query['review']) {
            books[isbn]['reviews'][req.session.authorization.username] = req.query.review;
            return res.status(200).json({
                message: `The review for the book with ISBN ${isbn} has been added/updated`
            })
        }
        return res.status(200).json({
            message: 'The query string parameter "review" was not found or correctly formed'
        })
    }
    return res.status(400).json({
        message: `No book is registered under ISBN ${isbn}`
    })
});



module.exports.authenticated = registered;
module.exports.isValid = isValid;
module.exports.users = users;
