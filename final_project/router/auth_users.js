const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let checkUsers = users.filter((user) => { return (user.username == username && user.password == password)});

    if(checkUsers.length > 0)
        return true;
    else
        return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    if(books[isbn])
    {
        let reviews = [];
        const book = books[isbn];
        const username = req.session.authorization.username;
        if(book.reviews.length > 0)
        {
            reviews = book.reviews.filter((element) => { element.username != username });   
            books[isbn].reviews = reviews;
        }
        reviews.push({ 'username': username, 'review': review });
        books[isbn].reviews = reviews;

        return res.status(200).send("The review for the book with ISBN " + isbn + " has been added/updated");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if(books[isbn])
    {
        let reviews = [];
        const book = books[isbn];
        const username = req.session.authorization.username;
        if(book.reviews.length > 0)
        {
            reviews = book.reviews.filter((element) => { element.username != username });   
            books[isbn].reviews = reviews;

            return res.status(200).send("Reviews for the ISBN " + isbn + " posted by the user " + username +" deleted");
        }
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
