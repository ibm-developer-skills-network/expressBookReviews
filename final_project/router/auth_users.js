const express = require('express')
const jwt = require('jsonwebtoken')
let books = require("./booksdb.js")
const regd_users = express.Router()

let users = []

const isValid = (username)=>{
  let userswithsamename = users.filter((user) => {return user.username === username})
  if(userswithsamename.length > 0){
    return true
  }else{
    return false
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {return user.username === username && user.password === password})
if(validusers.length > 0){
  return true
}else{
  return false
}
}

//Get request: retrieve all users
regd_users.get("/users",(req,res) => {
  res.send(users)
})

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password){
    return res.status(404).json({message:"Error in login"})
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    },'access',{expiresIn: 60 * 60})
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in")
  }else{
    return res.status(208).json({message:"Invalid Login: Check from username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  let book = books[isbn]
  let review = req.query.review
  if(!book){
    return res.status(404).send("Book is not found")
  }
  if(book){
    if(review){
      books[isbn].reviews = {"user1":review}
      res.status(200).send("the review has been added")
    }else{
      res.status(404).send("Error")
    }
  }
  })

  // DELETE request: Delete a user by isbn
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    // Check if the ISBN exists in the books object
    if(isbn in books){
      // Check if the user has posted a review for this ISBN
      if(books[isbn]["reviews"][username] === username){
        // Delete the review
        delete books[isbn].reviews
        res.status(200).send("Review deleted successfully.");
      } else {
        res.status(404).json({message: "Review not found."});
      }
    } else {
      res.status(404).json({message: "Book not found."});
    }
  })

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users


