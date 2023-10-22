const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  //Write the authenication mechanism here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(200).json({message: 'Username or password missing'});
  }

  if(isValid(username)) {
    users.push({username, password});
    return res.status(200).send('User Successfully registered.');
  } else {
    return res.status(200).send({message: 'User already exist.'});
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
      if(books) resolve(books);
      reject('No books found');
    })
    .then(response => {
      return res.status(200).json({message: JSON.stringify(response, null, 4)});
    })
    .catch(err => {
      res.status(404).json({message: err})
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;

  new Promise ((resolve, reject) => {
    let match = [];
    for (const [key, value] of Object.entries(books)) {
      if(value.isbn === isbn) match = value;
    }
    if (!match) reject({message: "No books matches this isbn"});
    resolve(matches);
  })
  .then(response => {
    return res.status(200).json(response);
  }).catch(err => {
    return res.status(200).json(err);
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  new Promise((resolve, reject) => {
      if (typeof author === 'string') {
        author = author
            .replaceAll('%20', ' ')
            .replaceAll('+', ' ')
      }else throw {message: "Invalid params"};
      let matches = [];
      for (const [key, value] of Object.entries(books)) {
        if(value.author === author) matches.push(value);
      }
      if (matches.length > 0) {
        resolve(matches);
      } else throw {message: "No books matches this author"};
    })
    .then(response => {
      return res.status(200).json(response);
    })
    .catch(err => {
      return res.status(200).json(err);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;

  new Promise((resolve, reject) => {
    if (typeof title === 'string') {
      title = title
          .replaceAll('%20', ' ')
          .replaceAll('+', ' ')
    }else throw {message: "Invalid params"};
    let matches = [];
    for (const [key, value] of Object.entries(books)) {
      if(value.title === title) matches.push(value);
    }
    if (matches.length > 0) {
      resolve(matches);
    } else throw {message: "No books matches this title"};
  })
      .then(response => {
        return res.status(200).json(response);
      })
      .catch(err => {
        return res.status(200).json(err);
      });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(typeof isbn === 'string') {
    isbn = isbn.replaceAll('%20', ' ')
    isbn = isbn.replaceAll('+', ' ')
  }

  let matches = [];
  for( const [key, value] of Object.entries(books)) {
    if(value?.reviews?.isbn === isbn) matches.push(value);
  }

  if (matches.length > 0) {
    return res.status(200).json(matches);
  }
  return res.status(200).json({message: "No books matches this title"});
});

module.exports.general = public_users;
