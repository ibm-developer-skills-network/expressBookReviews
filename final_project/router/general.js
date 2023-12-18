const express = require('express');

let books = require('./booksdb.js');
// const books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post('/register', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: 'Missing Credentials' });
  }

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      console.log(`Username: ${username} has registered successfully!`);
      return res
        .status(200)
        .json({ message: 'User successfully registred. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  // }else{
  //   return res.status(404).json({message: "Please provide username and password"})
  // }
  return res.status(404).json({ message: 'Unable to register user.' });
});

public_users.get('/asyncallback/books', async function (req, res) {
  try {
    let response = await axios.get('http://localhost:5000/');
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error getting book list' });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here

  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let booksArr = Object.keys(books).map((key) => books[key]);
  let isbnBook = booksArr.filter((book) => book.isbn === isbn);
  console.log(isbnBook);
  // console.log(booksArr);

  if (isbnBook.length > 0) {
    return res.send(JSON.stringify(isbnBook), null, 4);
  } else {
    res.status(404).json({ message: 'Not Found!' });
    return res.send('Not Found!');
  }
  // return res.status(300).json({ message: 'Yet to be implemented' });
});

// async calls for isbn details 
public_users.get("/asyncallback/books/isbn/:isbn", function (req,res) {
  let isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let author = req.params.author;
  let booksArr = Object.keys(books).map((key) => books[key]);
  let authorBook = booksArr.filter((book) => book.author === author);
  console.log(authorBook);
  // console.log(booksArr);

  if (authorBook.length > 0) {
    return res.send(JSON.stringify(authorBook));
  } else {
    res.status(404).json({ message: 'Not Found!' });
    return res.send('Not Found!');
  }
});

// async for author
public_users.get("/asyncallback/books/author/:author", function (req,res) {
  let author = req.params.author;
  axios.get(`http://localhost:5000/author/${author}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});



// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksArr = Object.keys(books).map((key) => books[key]);
  let titleBook = booksArr.filter((book) => book.title === title);
  console.log(titleBook);
  // console.log(booksArr);

  if (titleBook.length > 0) {
    return res.send(JSON.stringify(titleBook));
  } else {
    res.status(404).json({ message: 'Not Found!' });
    return res.send('Not Found!');
  }
});

// async for title
public_users.get("/asyncallback/books/title/:title", function (req,res) {
  let title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let booksArr = Object.keys(books).map((key) => books[key]);
  let isbnBook = booksArr.filter((book) => book.isbn === isbn);
  console.log(isbnBook[0]['title']);
  // console.log(booksArr);

  if (isbnBook.length > 0) {
    let reviews = isbnBook[0]['reviews'];
    return res.send(JSON.stringify({ reviews: reviews }), null, 4);
  } else {
    res.status(404).json({ message: 'Not Found!' });
    return res.send('Not Found!');
  }
});

module.exports.general = public_users;
