let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.hasOwnProperty(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the user to the database
  users[username] = password;
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const bookId = req.params.isbn;
  const book = books[bookId];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});
// Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author === author);
  if (authorBooks.length === 0) {
    return res.status(404).json({ message: "Books by this author not found" });
  }
  const response = {
    "books by author": authorBooks
  };
  return res.status(200).json(response);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(book => book.title === title);
  if (titleBooks.length === 0) {
    return res.status(404).json({ message: "Books by this title not found" });
  }
  const response = {
    "books by title": titleBooks
  };
  return res.status(200).json(response);
});

// Get book review 
public_users.get('/review/:isbn', function (req, res) {
  const bookId = req.params.isbn;
  const book = books[bookId];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews || {});
});


exports.general = public_users;
