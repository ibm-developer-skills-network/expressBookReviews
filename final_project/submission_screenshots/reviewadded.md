# Task 8: Add / Modify a Book Review

## Step 1 – Login and save session cookie
```bash
curl -s -c cookies.txt -X POST http://localhost:5001/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"fariha07","password":"pass1234"}'
```
Output:
```json
{"message":"Customer successfully logged in"}
```

## Step 2 – Add a review (review as query parameter)
```bash
curl -s -b cookies.txt -X PUT \
  "http://localhost:5001/customer/auth/review/1?review=A+profound+novel+about+colonialism+and+identity" \
  -H "Content-Type: application/json"
```

## API Endpoint
PUT http://localhost:5001/customer/auth/review/1?review=A+profound+novel+about+colonialism+and+identity

## HTTP Status: 200 OK

## Actual Output (add)
```json
{"message":"Review for the book with ISBN 1 successfully added/updated."}
```

## Step 3 – Verify the review was saved
```bash
curl -s http://localhost:5001/review/1
```
Output:
```json
{
    "fariha07": "A profound novel about colonialism and identity"
}
```

## Step 4 – Modify the review (same endpoint, new query value)
```bash
curl -s -b cookies.txt -X PUT \
  "http://localhost:5001/customer/auth/review/1?review=Masterpiece+of+African+literature" \
  -H "Content-Type: application/json"
```

## HTTP Status: 200 OK

## Output (modify)
```json
{"message":"Review for the book with ISBN 1 successfully added/updated."}
```

## Implementation (auth_users.js)
```javascript
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review || req.body.review;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: `Review for the book with ISBN ${isbn} successfully added/updated.` });
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});
```
