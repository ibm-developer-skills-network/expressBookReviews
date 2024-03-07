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

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  //Write your code here
  const book_list = new Promise((resolve,reject)=> {
    resolve(res.send(JSON.stringify(books,null,4)));
    book_list.then(() => console.log("Promise for Task 10."));
  })
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const detail_list = new Promise((resolve,reject) => {
  const isbn = req.params.isbn;
    resolve(res.send(books[isbn]));
    detail_list.then(() => console.log("Promise for Taske 11."));
  //return res.status(300).json({message: "Yet to be implemented"});
 })});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }
    });
    reject(res.send("The mentioned author does not exist "))
});

    get_books_author.then(function(){
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned author does not exist');
  });

  });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const get_books_by_title = new Promise((resolve,reject) => {
  let bookdetailsbytitle = [];
  let titles = Object.keys(books);
  titles.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      bookdetailsbytitle.push({"isbn":isbn,
                          "author":books[isbn]["author"],
                          "reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({bookdetailsbytitle}, null, 4)));
    }
  });

  reject(res.send("The mentioned author does not exist "))
});

get_books_author.then(function(){
        console.log("Promise is resolved");
}).catch(function () { 
            console.log('The mentioned author does not exist');
});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
  return res.status(300).json({message: "Yet to be implemented"});
});


 

module.exports.general = public_users;
