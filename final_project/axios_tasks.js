const axios = require('axios');

const PORT = process.env.PORT || 5001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Task 10: Get the list of books available in the shop using async-await with Axios
async function getAllBooksAsync() {
    try {
        console.log("\n--- Task 10: Get all books (Async/Await with Axios) ---");
        const response = await axios.get(`${BASE_URL}/`);
        console.log("Response:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Error in Task 10:", error.response ? error.response.data : error.message);
    }
}

// Task 10 (Promise callback version):
function getAllBooksPromise() {
    console.log("\n--- Task 10: Get all books (Promises with Axios) ---");
    return axios.get(`${BASE_URL}/`)
        .then(response => {
            console.log("Response:", JSON.stringify(response.data, null, 2));
            return response.data;
        })
        .catch(error => {
            console.error("Error in Task 10:", error.response ? error.response.data : error.message);
        });
}

// Task 11: Get book details based on ISBN using async-await with Axios
async function getBookByISBNAsync(isbn) {
    try {
        console.log(`\n--- Task 11: Get book by ISBN: ${isbn} (Async/Await with Axios) ---`);
        const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
        console.log("Response:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Error in Task 11:", error.response ? error.response.data : error.message);
    }
}

// Task 11 (Promise callback version):
function getBookByISBNPromise(isbn) {
    console.log(`\n--- Task 11: Get book by ISBN: ${isbn} (Promises with Axios) ---`);
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => {
            console.log("Response:", JSON.stringify(response.data, null, 2));
            return response.data;
        })
        .catch(error => {
            console.error("Error in Task 11:", error.response ? error.response.data : error.message);
        });
}

// Task 12: Get book details based on Author using async-await with Axios
async function getBooksByAuthorAsync(author) {
    try {
        console.log(`\n--- Task 12: Get books by Author: '${author}' (Async/Await with Axios) ---`);
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
        console.log("Response:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Error in Task 12:", error.response ? error.response.data : error.message);
    }
}

// Task 12 (Promise callback version):
function getBooksByAuthorPromise(author) {
    console.log(`\n--- Task 12: Get books by Author: '${author}' (Promises with Axios) ---`);
    return axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
        .then(response => {
            console.log("Response:", JSON.stringify(response.data, null, 2));
            return response.data;
        })
        .catch(error => {
            console.error("Error in Task 12:", error.response ? error.response.data : error.message);
        });
}

// Task 13: Get book details based on Title using async-await with Axios
async function getBooksByTitleAsync(title) {
    try {
        console.log(`\n--- Task 13: Get books by Title: '${title}' (Async/Await with Axios) ---`);
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
        console.log("Response:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Error in Task 13:", error.response ? error.response.data : error.message);
    }
}

// Task 13 (Promise callback version):
function getBooksByTitlePromise(title) {
    console.log(`\n--- Task 13: Get books by Title: '${title}' (Promises with Axios) ---`);
    return axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
        .then(response => {
            console.log("Response:", JSON.stringify(response.data, null, 2));
            return response.data;
        })
        .catch(error => {
            console.error("Error in Task 13:", error.response ? error.response.data : error.message);
        });
}

// Execute all tasks sequentially when run directly
async function runAllTasks() {
    console.log("Running Axios-based Tasks 10, 11, 12, and 13...");
    await getAllBooksAsync();
    await getBookByISBNAsync(1);
    await getBooksByAuthorAsync("Jane Austen");
    await getBooksByTitleAsync("Pride and Prejudice");
    console.log("\nAll Axios tasks executed successfully!");
}

if (require.main === module) {
    runAllTasks();
}

module.exports = {
    getAllBooksAsync,
    getAllBooksPromise,
    getBookByISBNAsync,
    getBookByISBNPromise,
    getBooksByAuthorAsync,
    getBooksByAuthorPromise,
    getBooksByTitleAsync,
    getBooksByTitlePromise,
};
