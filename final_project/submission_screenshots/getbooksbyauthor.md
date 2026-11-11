# Task 3: Get Book Details Based on Author

## cURL Command
```bash
curl -s http://localhost:5001/author/Jane%20Austen
```

## API Endpoint
GET http://localhost:5001/author/Jane%20Austen

## HTTP Status: 200 OK

## Actual Output
```json
[
    {
        "author": "Jane Austen",
        "title": "Pride and Prejudice",
        "reviews": {}
    }
]
```

## Implementation (general.js)
Route uses a Promise-based async approach (Task 3 / Task 12 combined):
```javascript
function getFromAuthor(author) {
    return new Promise((resolve, reject) => {
        let matchingBooks = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push(books[isbn]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "No books found for this author" });
        }
    });
}

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getFromAuthor(author)
        .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});
```
