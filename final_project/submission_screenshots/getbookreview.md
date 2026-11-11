# Task 5: Get Book Review

## cURL Command (before adding any review)
```bash
curl -s http://localhost:5001/review/1
```

## API Endpoint
GET http://localhost:5001/review/1

## HTTP Status: 200 OK

## Output (empty reviews initially)
```json
{}
```

## Output (after user fariha07 added a review)
```json
{
    "fariha07": "A profound novel about colonialism and identity"
}
```

## Implementation (general.js)
```javascript
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});
```
