# Task 4: Get All Books Based on Title

## cURL Command
```bash
curl -s http://localhost:5001/title/Pride%20and%20Prejudice
```

## API Endpoint
GET http://localhost:5001/title/Pride%20and%20Prejudice

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
Route uses a Promise-based async approach (Task 4 / Task 13 combined):
```javascript
function getFromTitle(title) {
    return new Promise((resolve, reject) => {
        let matchingBooks = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push(books[isbn]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "No books found with this title" });
        }
    });
}

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
        .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});
```
