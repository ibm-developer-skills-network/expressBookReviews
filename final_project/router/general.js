const express = require('express')
let books = require("./booksdb.js")
let isValid = require("./auth_users.js").isValid
let users = require("./auth_users.js").users
const public_users = express.Router()


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password})
      return res.status(200).json({message:"User Successfully registered. Now you can login"})
    }else{
      return res.status(404).json({message:"user already exists!"})
    }
  }else{
    return res.status(404).json({message:"Unable to register user"})
  }
})

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.send(JSON.stringify(books, null, 4))
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  return res.send(books[isbn])
 })

// Get book details based on author
public_users.get('/author/:author',(req, res) => {
  const author = req.params.author
  let bookDetails = []
  let keys = Object.keys(books)
  for(let i = 0 ;i < keys.length;i++){
    let key = keys[i]
    if(books[key].author === author){
      bookDetails.push(books[key])
    }
  }
  return res.send(bookDetails)
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let bookDetalis = []
  let keys = Object.keys(books)
  for(let i = 0; i < keys.length; i++){
    let key = keys[i]
    if(books[key].title === title){
      bookDetalis.push(books[key])
    }
  }
  return res.send(bookDetalis)
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let book = books[isbn]
  if(!book){
    return res.status(404).send("Book is not found")
  }else{
    return res.send(book.reviews)
  }
})



module.exports.general = public_users



