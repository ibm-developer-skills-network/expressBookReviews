const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return (users.filter(user => user.username === username) > 0)
}

const authenticatedUser = (username,password)=>{
    return users.filter(user => user.username === username && user.password === password).length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!(username && password)) return res.status(404).json({message: "Unnable to login"})
    if(!authenticatedUser(username,password)) {
        return res.status(208).json({message: "Invalid login, check login credentials"
    })}

    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60 * 60});
    
    req.session.authorization = {accessToken,username}

    return res.status(200).send("User successfully logged in!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if(!books[isbn]) return res.send("Unable to find ISBN");

    let review = req.query.review;
    const user = req.session.authorization.username;
    
    if(!review) return res.send("No review given");
    
    if(!books[isbn]["reviews"][user]) {
        res.send("User review added!")
    } else {
        res.send("User review updated!")
    }
    
    books[isbn]["reviews"][user] = review
});

//task 9: delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if(!books[isbn]) return res.send("Unable to find ISBN");

    let review = req.query.review;
    const user = req.session.authorization.username;

    if(!books[isbn]["reviews"][user]) return res.send("No review to delete");

    delete books[isbn]["reviews"][user];

    res.send("Review deleted");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
