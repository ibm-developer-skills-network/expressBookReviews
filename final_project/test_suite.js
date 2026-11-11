const axios = require('axios');
const http = require('http');

let BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

async function getWorkingBaseUrl() {
    if (process.env.BASE_URL) return process.env.BASE_URL;
    if (process.env.PORT) return `http://localhost:${process.env.PORT}`;
    try {
        const testRes = await axios.get('http://localhost:5000/', { timeout: 800 });
        if (testRes.status === 200 && testRes.data && testRes.data[1]) {
            return 'http://localhost:5000';
        }
    } catch (e) {}
    return 'http://localhost:5001';
}

async function runTests() {
    BASE_URL = await getWorkingBaseUrl();
    console.log(`Connecting to server at: ${BASE_URL}`);
    let passed = 0;
    let failed = 0;

    function assert(condition, testName) {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] ${testName}`);
            failed++;
        }
    }

    try {
        console.log("=========================================");
        console.log("   EXPRESS BOOK REVIEW COMPREHENSIVE TESTS");
        console.log("=========================================\n");

        // 1. Task 1: Get all books
        console.log("--- Task 1: Get All Books Available in the Shop ---");
        const resBooks = await axios.get(`${BASE_URL}/`);
        assert(resBooks.status === 200, "Task 1: GET / returns HTTP 200");
        assert(resBooks.data && Object.keys(resBooks.data).length === 10, "Task 1: Catalog contains 10 books");

        // 2. Task 2: Get book by ISBN
        console.log("\n--- Task 2: Get Book Details Based on ISBN ---");
        const resIsbn = await axios.get(`${BASE_URL}/isbn/1`);
        assert(resIsbn.status === 200, "Task 2: GET /isbn/1 returns HTTP 200");
        assert(resIsbn.data.title === "Things Fall Apart", "Task 2: ISBN 1 title matches 'Things Fall Apart'");
        
        try {
            await axios.get(`${BASE_URL}/isbn/999`);
            assert(false, "Task 2: Non-existent ISBN should fail with 404");
        } catch (err) {
            assert(err.response && err.response.status === 404, "Task 2: GET /isbn/999 correctly returns 404");
        }

        // 3. Task 3: Get books by Author
        console.log("\n--- Task 3: Get Book Details Based on Author ---");
        const resAuthor = await axios.get(`${BASE_URL}/author/Jane%20Austen`);
        assert(resAuthor.status === 200, "Task 3: GET /author/Jane Austen returns HTTP 200");
        assert(Array.isArray(resAuthor.data) && resAuthor.data[0].title === "Pride and Prejudice", "Task 3: Found book for author 'Jane Austen'");

        // 4. Task 4: Get books by Title
        console.log("\n--- Task 4: Get All Books Based on Title ---");
        const resTitle = await axios.get(`${BASE_URL}/title/Pride%20and%20Prejudice`);
        assert(resTitle.status === 200, "Task 4: GET /title/Pride and Prejudice returns HTTP 200");
        assert(Array.isArray(resTitle.data) && resTitle.data[0].author === "Jane Austen", "Task 4: Found book with title 'Pride and Prejudice'");

        // 5. Task 5: Get book reviews
        console.log("\n--- Task 5: Get Book Reviews ---");
        const resReviews = await axios.get(`${BASE_URL}/review/1`);
        assert(resReviews.status === 200, "Task 5: GET /review/1 returns HTTP 200");
        assert(typeof resReviews.data === 'object', "Task 5: Returns reviews object for ISBN 1");

        // 6. Task 6: Register New User
        console.log("\n--- Task 6: Register New User ---");
        const testUser = "learner_" + Date.now();
        const testPass = "securePassword123";

        const resReg = await axios.post(`${BASE_URL}/register`, {
            username: testUser,
            password: testPass
        });
        assert(resReg.status === 200, "Task 6: POST /register returns HTTP 200");
        assert(resReg.data.message.includes("registered"), "Task 6: Success message returned for user registration");

        // Duplicate registration check
        try {
            await axios.post(`${BASE_URL}/register`, {
                username: testUser,
                password: testPass
            });
            assert(false, "Task 6: Duplicate registration should fail");
        } catch (err) {
            assert(err.response && err.response.status === 404, "Task 6: Duplicate username correctly rejected with 404");
        }

        // 7. Task 7: User Login
        console.log("\n--- Task 7: Login as a Registered User ---");
        // Test wrong credentials
        const resBadLogin = await axios.post(`${BASE_URL}/customer/login`, {
            username: testUser,
            password: "wrongpassword"
        });
        assert(resBadLogin.status === 208, "Task 7: Invalid login returns HTTP 208");

        // Test valid login and capture session cookie
        const resLogin = await axios.post(`${BASE_URL}/customer/login`, {
            username: testUser,
            password: testPass
        });
        assert(resLogin.status === 200, "Task 7: Valid login returns HTTP 200");
        
        const setCookie = resLogin.headers['set-cookie'];
        assert(setCookie && setCookie.length > 0, "Task 7: Session cookie received upon login");
        const cookie = setCookie[0];

        // 8. Task 8: Add / Modify Book Review
        console.log("\n--- Task 8: Add / Modify a Book Review ---");
        // Add review using query param
        const resAddReview = await axios.put(
            `${BASE_URL}/customer/auth/review/1?review=Incredible+classic+novel`,
            {},
            { headers: { Cookie: cookie } }
        );
        assert(resAddReview.status === 200, "Task 8: PUT /customer/auth/review/1 (add review) returns HTTP 200");

        // Check review was persisted under the logged-in user
        const resCheckReview = await axios.get(`${BASE_URL}/review/1`);
        assert(resCheckReview.data[testUser] === "Incredible classic novel", "Task 8: Added review confirmed under username");

        // Modify review
        const resModReview = await axios.put(
            `${BASE_URL}/customer/auth/review/1?review=Updated+insightful+review`,
            {},
            { headers: { Cookie: cookie } }
        );
        assert(resModReview.status === 200, "Task 8: PUT /customer/auth/review/1 (modify review) returns HTTP 200");

        const resCheckReview2 = await axios.get(`${BASE_URL}/review/1`);
        assert(resCheckReview2.data[testUser] === "Updated insightful review", "Task 8: Modified review confirmed under username");

        // 9. Task 9: Delete Book Review
        console.log("\n--- Task 9: Delete Book Review Added by that User ---");
        const resDelReview = await axios.delete(
            `${BASE_URL}/customer/auth/review/1`,
            { headers: { Cookie: cookie } }
        );
        assert(resDelReview.status === 200, "Task 9: DELETE /customer/auth/review/1 returns HTTP 200");

        const resCheckReview3 = await axios.get(`${BASE_URL}/review/1`);
        assert(resCheckReview3.data[testUser] === undefined, "Task 9: Deleted review no longer appears in book reviews");

        // 10. Task 10: Get all books using Axios / async-await & Promises
        console.log("\n--- Task 10: Get All Books – Using Axios (Async/Await & Promises) ---");
        const axiosTasks = require('./axios_tasks');
        const booksAsync = await axiosTasks.getAllBooksAsync();
        assert(booksAsync && Object.keys(booksAsync).length === 10, "Task 10 (Async/Await): All 10 books fetched");
        const booksPromise = await axiosTasks.getAllBooksPromise();
        assert(booksPromise && Object.keys(booksPromise).length === 10, "Task 10 (Promises): All 10 books fetched");

        // 11. Task 11: Search by ISBN using Axios / async-await & Promises
        console.log("\n--- Task 11: Search by ISBN – Using Axios (Async/Await & Promises) ---");
        const isbnAsync = await axiosTasks.getBookByISBNAsync(1);
        assert(isbnAsync && isbnAsync.author === "Chinua Achebe", "Task 11 (Async/Await): Book fetched by ISBN 1");
        const isbnPromise = await axiosTasks.getBookByISBNPromise(1);
        assert(isbnPromise && isbnPromise.author === "Chinua Achebe", "Task 11 (Promises): Book fetched by ISBN 1");

        // 12. Task 12: Search by Author using Axios / async-await & Promises
        console.log("\n--- Task 12: Search by Author – Using Axios (Async/Await & Promises) ---");
        const authorAsync = await axiosTasks.getBooksByAuthorAsync("Jane Austen");
        assert(authorAsync && authorAsync.length > 0 && authorAsync[0].title === "Pride and Prejudice", "Task 12 (Async/Await): Book found for 'Jane Austen'");
        const authorPromise = await axiosTasks.getBooksByAuthorPromise("Jane Austen");
        assert(authorPromise && authorPromise.length > 0 && authorPromise[0].title === "Pride and Prejudice", "Task 12 (Promises): Book found for 'Jane Austen'");

        // 13. Task 13: Search by Title using Axios / async-await & Promises
        console.log("\n--- Task 13: Search by Title – Using Axios (Async/Await & Promises) ---");
        const titleAsync = await axiosTasks.getBooksByTitleAsync("Pride and Prejudice");
        assert(titleAsync && titleAsync.length > 0 && titleAsync[0].author === "Jane Austen", "Task 13 (Async/Await): Book found for title 'Pride and Prejudice'");
        const titlePromise = await axiosTasks.getBooksByTitlePromise("Pride and Prejudice");
        assert(titlePromise && titlePromise.length > 0 && titlePromise[0].author === "Jane Austen", "Task 13 (Promises): Book found for title 'Pride and Prejudice'");

        console.log("\n=========================================");
        console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
        console.log("=========================================\n");

        if (failed > 0) {
            process.exit(1);
        }
    } catch (err) {
        console.error("Test execution failed with error:", err);
        process.exit(1);
    }
}

runTests();
