# Task 2: Get Book Details Based on ISBN

## cURL Command
```bash
curl -s http://localhost:5001/isbn/1
```

## API Endpoint
GET http://localhost:5001/isbn/1

## HTTP Status: 200 OK

## Actual Output
```json
{
    "author": "Chinua Achebe",
    "title": "Things Fall Apart",
    "reviews": {}
}
```

## 404 Case (non-existent ISBN)
```bash
curl -s http://localhost:5001/isbn/999
```
Output:
```json
{"message":"Book not found"}
```

## Implementation (general.js)
Route uses a Promise-based async approach (Task 2 / Task 11 combined):
```javascript
function getFromISBN(isbn) {
    return new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ status: 404, message: "Book not found" });
        }
    });
}

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn)
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});
```
