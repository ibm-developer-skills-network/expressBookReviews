const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books = require("./router/booksdb.js");
const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({ message: "User not authenticated" })
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" })
    }
});

const doesReviewExist = (isbn,) => {
    if (books[isbn]) {
        if (Object.keys(books[isbn].reviews).length === 0) {
            return false;
        } else {
            // let user = req.body.username;
            return true;
        }
    } else {
        return false;
    }
}

users = [];
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});
app.put("/auth/review/:isbn", (req, res) => {
    let review = req.body.review;
    let isbn = req.params.isbn;
    let user = req.body.username;
    let existing_review = doesReviewExist(isbn);
    if (!existing_review) {
        books[isbn].reviews = {
            "user": user,
            "review": review
        }
        return res.send(`this is the first review -  ${JSON.stringify(books[isbn].reviews)}`);
    } else {
        if (existing_review.user === user) {
            books[isbn].reviews[user] = {
                "review": review
            }
            return res.send(`you have updated your review -  ${JSON.stringify(books[isbn].reviews)}`);
        } else {
            books[isbn].reviews[user] = {
                "review": review
            }
            return res.send(`there is a review  ${JSON.stringify(books[isbn].reviews)}`);
        }
    }
});

//Get the book list available in the shop
app.get('/books', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

app.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
app.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        res.json({
            success: true,
            message: `Books by ${author} found`,
            books: booksByAuthor
        });
    } else {
        res.status(404).json({
            success: false,
            message: `No books found by ${author}`
        });
    }
});

app.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let user = req.body.username;
    let existing_review = doesReviewExist(isbn);
    if (!existing_review) {
        return res.send(`No review found for ISBN ${isbn}`);
    } else {
        if (existing_review.user === user) {
            delete books[isbn].reviews[user];
            return res.send(`Your review has been deleted - ${JSON.stringify(books[isbn].reviews)}`);
        } else {
            return res.send(`You can only delete your own review`);
        }
    }
});
app.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        res.json({
            success: true,
            message: `Books by ${author} found`,
            books: booksByAuthor
        });
    } else {
        res.status(404).json({
            success: false,
            message: `No books found by ${author}`
        });
    }
});

app.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    if (booksByTitle.length > 0) {
        res.json({
            success: true,
            message: `Books by ${title} found`,
            books: booksByTitle
        });
    } else {
        res.status(404).json({
            success: false,
            message: `No books found by ${title}`
        });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
