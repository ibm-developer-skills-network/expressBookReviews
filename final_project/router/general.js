const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.send(req.body.username)
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  var mytemp="";
  //let friend = books[email]
  for(var key in books) {
   for (var data in books[key]) {
     // mytemp=key.map((item, i) => ('author', item.author));
    //key.filter(el => el.target.author === str);

   }
}
const matches = Object.values(books).filter(authr => authr.author === author)
res.send(matches)
//res.send(books[author])
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matches = Object.values(books).filter(authr => authr.title === title)
  res.send(matches)

//res.send(books[title])
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const matches = Object.values(books).filter(authr => authr.isbn === isbn)
  //res.send(matches)
  for (var data in books[isbn]) {
//res.send(data[reviews])
  }
  const mmatches=books[isbn];
  //res.send(mmatches[reviews])
  for (x in mmatches) {
 if (mmatches.hasOwnProperty(x)) {
   //res.send(mmatches[x].reviews);
 }
}
res.send(books[isbn].reviews)
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
