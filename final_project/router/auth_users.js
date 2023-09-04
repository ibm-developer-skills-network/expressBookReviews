const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let usersFound = users.filter((user)=>{
        return user.username === username
    });
    if(usersFound.length > 0) return true;
    else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean

    //write code to check if username and password match the one we have in records.
     let validusers = users.filter((user)=>{
 
         return (user.username === username && user.password === password)
     });
     if(validusers.length > 0) return true;
     else return false;
 }

//only registered users can login
regd_users.post("/login", (req,res) => {

    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) return res.status(404).json({message: "Error logging in"});
  
    if (authenticatedUser(username,password)) 
    {
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).send(`You have successfully logged in as ${username}.`);
    } 
    return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.body.review;

    if(!books.hasOwnProperty(isbn))
    {
        return res.status(300).json({message: "That book doesn't exist."});
    }
    const book = books[isbn];
     
    if(book.reviews.hasOwnProperty(username))
    {
        book.reviews[username] = (review);
        return res.status(200).json({message: `${username}s review of ${book.title} has been updated.`});
    }    
    else  
    {
        book.reviews[username] = (review);
        return res.status(200).json({message: `${username}s review of ${book.title} has been published.`});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.body.review;

    if(!books.hasOwnProperty(isbn))
    {
        return res.status(300).json({message: "That book doesn't exist."});
    }

    if(books[isbn].reviews.hasOwnProperty(username))
    {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: `${username}s review of ${books[isbn].title} has been deleted.`});
    }    
    else  
    {
        return res.status(200).json({message: `${username} has no review for ${books[isbn].title}.`});
    }
    
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users; 
