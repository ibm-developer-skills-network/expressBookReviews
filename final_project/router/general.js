const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({'username': username, 'password': password});
      res.status(300).send("User successfully registerd. Now you can login");
    }
    else {
      res.status(404).send("User already exists");
    }
  }
  res.status(404).send("body empty");

  // const { username, password } = req.body;
  // if (!username || !password) {
  //   return res.status(404).json({ message: "Username and password are required" });
  // }
  // if (users.find((user) => user.username === username)) {
  //   return res.status(409).json({ message: "Username already exists" });
  // }
  // users.push({ "username": username, "password": password });
  // return res.status(201).json({ message: "User registered successfully" });
});

// use Async callback to get all books, which will return a promise
public_users.get("/server/asynbooks", async function(req, res) {
  try {
    let response = await axios.get("http://127.0.0.1:3000/");
    console.log(response.data);
    return res.status(200).json(response.data);
  }
  catch (error) {
    console.error(error);
    return res.status(404).json({message: "Error getting book list"});
  }
});

// // use Promise to get all books (tried by myself)
// public_users.get("/server/promisebooks", (req, res) => {
//   const promise = axios.get("http://127.0.0.1:3000/");
//   promise.then((msg) => {
//     // console.log(msg);
//     res.status(200).send(msg.data);
//   })
//   .catch((err) => {
//     res.status(404).send(err);
//   })
// })

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // below is the result that this assignment required
  res.send(JSON.stringify({books}, null, 4));

  // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/booktitle', (req, res) => {
  // const booktitle = [];
  // for (const key in books) {
  //   booktitle.push(books[key].title);
  // }
  // return res.status(200).send(booktitle);

  const booktitle = JSON.parse(JSON.stringify(books));
  for (const key in booktitle) {
    booktitle[key] = booktitle[key].title;
  }
  return res.status(200).send(booktitle);
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  // return res.status(300).json({message: "Yet to be implemented"});
 });

// use promise to get the detail of the book based on ISBN
public_users.get("/server/asyncbooks/isbn/:isbn", function(req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://127.0.0.1:3000/isbn/${isbn}`)
  .then(response => {
    console.log(response.data);
    return res.status(200).send(response.data);
  })
  .catch(error => {
    console.log(error);
    return res.status(500).send("Error occurred");
  })
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // hint: obtain all the keys for the 'books' object
  const author = req.params.author;
  const authorBooks = []
  for (const book in books) {
    if (books[book].author === author) {
      authorBooks.push(books[book]);
    }
  }
  if (authorBooks.length > 0) {
    res.send(authorBooks);
  }
  else {
    res.status(404).send("No books found for this author");
  }

  // return res.status(300).json({message: "Yet to be implemented"});
});

// use promise to get book details based on author
// public_users.get("/server/asyncbooks/author/:author", (req, res) => {
//   const author = req.params.author;
//   axios.get(`http://127.0.0.1:3000/author/${author}`)
//   .then((response) => {
//     return res.status(200).send(response.data);
//   })
//   .catch((error) => {
//     return res.status(500).send("Error occurred");
//   })
// })

// use async-await to get book details based on author
public_users.get("/server/asyncbooks/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://127.0.0.1:3000/author/${author}`);
    return res.status(200).send(response.data);
  }
  catch(err) {
    return res.status(500).send("Error occurred");
  }
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleBooks = [];
  for (const key in books) {
    if (books[key].title === title) {
      titleBooks.push(books[key]);
    }
  }
  if (titleBooks.length > 0) {
    res.send(titleBooks);
  }
  else {
    res.status(404).send("No title exists for any book");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// use promise to get all books based on title
// public_users.get("/server/asyncbooks/title/:title", (req, res) => {
//   const title = req.params.title;
//   axios.get(`http://127.0.0.1:3000/title/${title}`)
//   .then((response) => {
//     return res.status(200).send(response.data);
//   })
//   .catch((err) => {
//     return res.status(500).send("Error occurred when get the url");
//   })
// })

// use async-await to get all books based on title
public_users.get("/server/asyncbooks/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://127.0.0.1:3000/title/${title}`);
    return res.status(200).send(response.data);
  }
  catch(err) {
    return res.status(500).json({message: "Error occurred"});
  }
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
