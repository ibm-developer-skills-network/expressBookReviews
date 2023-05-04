const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//code to check is the username is valid
const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
//code to check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{
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
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 * 1000 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});


// Add/update a book review
regd_users.put("/auth/review/:isbn", function auth(req,res){
  let isbn = req.params.isbn;
  const { username, review } = req.body;
  if(!books[isbn]){
    return Promise.reject({message: "Invalid ISBN"})
      .catch(err => res.status(403).json(err));
  } else {
    books[isbn].reviews[username] = review;
    return Promise.resolve("Review has been updated for isbn " + isbn)
      .then(message => res.send(message));
  }
});


// Delete book review added by that particular user
regd_users.delete("/auth/review/delete/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  if (!books[isbn]) {
    return Promise.reject({ message: "Invalid ISBN" });
  } else {
    delete books[isbn].reviews[req.username];
    res.send("Review has been deleted for isbn" + isbn);
    return Promise.resolve();
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
