const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsameusername = users.filter((user) => {
  return user.username === username
});
if(userswithsameusername.length > 0) {
  return true;
}
else {
  return false;
  }
}
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validUsers = users.filter((user)=> {
  return (user.username === username && user.password === password)
});
if(validUsers.length > 0) {
  return true;
} 
else {
  return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  console.log(users)

  if(!username || !password) {
    return res.status(404).json({message: "Error Logging In: Missing username or password."})
  };

  if(authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in!");
  } else {
    return res.status(208).json({message:"Invalid Login. Check username and/or password."})
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.body.username;

  books[isbn].reviews[user] = review;
  res.send(JSON.stringify(books[isbn])).json({message:"Review added!"})
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    const user = req.body.username;

    delete books[isbn].reviews[user];
    res.send("Review deleted.")
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
