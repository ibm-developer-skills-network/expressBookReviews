
const express = require('express');
const jwt = require('jsonwebtoken');
const registered = express.Router();

let books = require('./booksdb.js');
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
            'req.session.secret',
            { expiresIn: '1h' }
        );
        req.session.authorization = { token, username }
        return res.status(200).json({ message: `${username} successfully loggeg in` })
    }
    return res.status(400).json({ message: "Invalid username and/or password" })
});

// clear; curl --header "Content-Type: application/json" --request POST --data '{ "username":"john", "password":"fake" }' localhost:5000/register && curl --header "Content-Type: application/json" --request POST --data '{ "username":"john", "password":"fake" }' localhost:5000/customer/login && curl --header "Content-Type: multipart/form-data" --request PUT localhost:5000/customer/auth/review/8

registered.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params['isbn'];
    console.log('TEST HAS AUTH');
    if (books[isbn]) {
        books[isbn][reviews][req.user] = req.query.review;
        return res.status(200).json({
            message: `The review for the book with ISBN ${isbn} has been added/updated`
        })
    }
    return res.status(400).json({
        message: `No book is registered under ISBN ${isbn}`
    })
});



module.exports.authenticated = registered;
module.exports.isValid = isValid;
module.exports.users = users;
