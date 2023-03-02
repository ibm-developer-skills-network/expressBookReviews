const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [ { "username": "Alejo", "password": "123"}];

const isValid = (username) => { //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    console.log(users)
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn
    let text = req.query.review
    let usernameAuth = req.session.authorization.username
    if(isbn) {
        if(books[isbn]) {
            books[isbn].reviews[usernameAuth] = text
            console.log(books)
            res.send("Your review was written successfully")
        }
    }
    res.send("An error occurred")
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn
    let usernameAuth = req.session.authorization.username
    if(isbn) {
        delete books[isbn].reviews[usernameAuth]
        console.log(books)
        res.send("Your review was delted successfully")
    }
    res.send("An error occurred")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
