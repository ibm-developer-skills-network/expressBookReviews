const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

// Task 10: Get all books using Promise callbacks with Axios
router.get('/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/books');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 11: Get book details by ISBN using Promise callbacks with Axios
router.get('/books/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:3000/books/isbn/${isbn}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Task 12: Get book details by Author using Promise callbacks with Axios
router.get('/books/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:3000/books/author/${author}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: 'No books found for this author' });
    }
});

// Task 13: Get book details by Title using Promise callbacks with Axios
router.get('/books/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:3000/books/title/${title}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: 'No books found with this title' });
    }
});

module.exports = router;
