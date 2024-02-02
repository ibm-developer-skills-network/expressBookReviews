const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=> {
        return user.username === username
    });

    if (userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });

    if (validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    console.log(users);

    if (!username || !password) {
        return res.status(404).json({"message": "Error logging in. Please provide a username and password."});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, "access", {expiresIn: 60*60});
        req.session.auth = {
            accessToken, username
        }
        return res.status(200).json({"message": "User logged in."});
    } else {
        return res.status(208).json({"message": "Invalid login."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.session.auth.username;
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!(isbn in books)) {
        return res.status(404).json({"message": `ISBN ${isbn} not found in our collection of books.`});
    }
    const book = books[isbn];
    if (!review) {
        return res.status(400).json({"message": `Please provide a review for ${book.title} by ${book.author}`});
    }
    books[isbn].reviews[user] = review;
    res.status(200).json({"message" : `Successfully added review for ${book.title} by ${book.author}: ${review}`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
