const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const url = 'https://esraahisham7-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/';


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password) {
      return res.json({"message": "Error: Not provided username or password"});
  }
  else if(isValid(username)) {
      return res.json({"message": "Error: User already exists"});
  }
  else {
      let newUser = {
          username,
          password
      };

      users.push(newUser);
      res.json({"message": "User added successfully"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
});

async function get_books() {
    let book_list = (await axios.get(url)).data;

    return book_list;
}

async function get_book_by_isbn(isbn) {
    let book = (await axios.get(url + 'isbn/'+ isbn)).data;

    return book;
}

async function get_book_by_author(author) {
    let book = (await axios.get(url + 'author/'+ author)).data;

    return book;
}

async function get_book_by_title(title) {
    let book = (await axios.get(url + 'title/'+ title)).data;

    return book;
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books[req.params.isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let keys = Object.keys(books);

  keys.forEach(key => {
      if(books[key]["author"] === author) {
          return res.status(200).send(JSON.stringify(books[key]));
      }
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  let keys = Object.keys(books);

  keys.forEach((key) => {
      if(books[key]["title"] === title) {
          return res.status(200).send(JSON.stringify(books[key]));
      }
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let reviews = books[isbn]["reviews"];

  return res.status(200).send(JSON.stringify(reviews));
  
});

module.exports.general = public_users;
module.exports.func = get_book_by_title;
