const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"amjad","password":"1234"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
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
  const isbn = req.params.isbn;
    let book = books[isbn]
    if (book) { //Check is friend exists
        let review = req.body.review;
        
        if(review) {
            book["review"] = review
        }
        
        //Add similarly for firstName
        //Add similarly for lastName
        books[isbn]=book;
        res.send(`Book with the ISBN  ${isbn} review updated.`);
    }
    else{
        res.send("Unable to find book!");
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Update the code here
  const isbn = req.params.isbn;
    if (isbn){
        delete books[isbn].reviews
    }
    res.send(`Book with the isbn  ${isbn} reviews deleted.`);
  //res.send("Yet to be implemented")//This line is to be replaced with actual return value
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
