
const express = require('express');
const jwt = require('jsonwebtoken');
const registered = express.Router();

let books = require('./booksdb.js');
let users = [];



// db connection not provided in the course



const isValid = (username) => {
    if (/^[a-z0-9]{2,8}$/.test(username)) {
        for (const exist of users) {
            if (exist.username === username) return 0
        }
        return 1
    }
}

const authenticatedUser = (username, password) => { // Returns boolean

    // Write code to check if username and password match the one we have in records.

}



registered.post('/login', (req, res) => { // Only registered users can login

    // Write your code here

    return res.status(300).json({ message: 'Yet to be implemented' })
});

registered.put('/auth/review/:isbn', (req, res) => { // Add a book review

    // Write your code here

    return res.status(300).json({ message: 'Yet to be implemented' })
});



module.exports.authenticated = registered;
module.exports.isValid = isValid;
module.exports.users = users;
