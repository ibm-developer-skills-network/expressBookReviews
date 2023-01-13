const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
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
  //Write your code here
    let username = req.session.username;
    let isbn = req.params.isbn;
    let review = req.body.review;

    const reviewsToDisplay = ((books, req) => {    
        for(var keys in books){
            if(books[keys].isbn === req.params.isbn){                
                return keys;
            }
        }    
    });

    const bookId = reviewsToDisplay(books, req);
    let added = false;
    if (!Object.prototype.hasOwnProperty.call(books[Number(bookId)].reviews, username)){
        added = true;
    }    
    books[bookId].reviews[username] = review;

    let message = "";
    if(added) {
        message = "Your review " + review + " has been added!"
    } else  {
        message = "Your review " + review + " has been updated!"
    }

    return res.send(message);
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username

    const reviewsToDelete = ((books, req) => {    
        for(var keys in books){
            if(books[keys].isbn === req.params.isbn){                
                return keys;
            }
        }    
    });

    const bookId = reviewsToDelete(books, req);
    let message = "You don't have reviews for this book";
    if(books[bookId].reviews[username]){
        message = "Your review '" + books[bookId].reviews[username] + "' has been deleted";
        delete books[bookId].reviews[username];
    }

    res.send(message);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


