const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let does = users.filter((user) => {
         return user.username === username}
        );
       if (does.length > 0) {return true} else {return false};
    };

    const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    })
    if (validusers.length>0) {
        return true; 
        } else {return false}
    };

    //only registered users can login

    regd_users.post("/login", (req,res) => {
      //Write your code here  
      const username = req.body.username;
      const password= req.body.password;
    
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
    console.log(users);
    console.log(req.session.authorization);
    
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
    });
    // Add a book review
    regd_users.put("/auth/review/:isbn", (req, res) => {
      //Write your code here
        //You have to give a review as a request query & it must get posted with the username (stored in the session) posted.
        let isbn = req.params.isbn;
        let book = books[isbn];
        //erstmal eine Review posten
        if (book) {
            let username = req.body.username;
            let review = req.body.review;

            if (review) {  
                book["reviews"]  = JSON.stringify(book["reviews"],null,4) + "Review of "+username+": "+review;
                }
        }
        
        res.send(JSON.stringify(books[isbn],null,4))
    
    });
    module.exports.authenticated = regd_users;
    module.exports.isValid = isValid;
    module.exports.users = users;
    