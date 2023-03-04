const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let usersamename = users.filter((user)=>{
    return user.username === username
  });
  if(usersamename.length > 0){
    return true;
  } else {
    return false;
  }
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
  //return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60  });
    
    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    }
    else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

//for register
regd_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

  
// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) =>{
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization.username	
    let book = books[isbn]
    if (book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            book['reviews'][reviewer] = review;
            books[isbn] = await book;
        }
        res.send("The review for the book with ISBN  ${isbn} has been added/updated.");
    }  else{
        res.send("Unable to find this ISBN");
    }
    });

// delete book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
   //*Write your code here

    const isbn = req.params.isbn
    const username = req.session.authorization.username
    if (books[isbn]) {
        let book = await books[isbn]
        delete book.reviews[username]
        return res.status(200).send("Review successfully deleted")
    } else {
        return res.status(404).json({message: "ISBN not found"})
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;