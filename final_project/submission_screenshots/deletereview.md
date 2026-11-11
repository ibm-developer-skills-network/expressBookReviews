# Task 9: Delete Book Review

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

## Step 2 – Delete the review for ISBN 1
```bash
curl -s -b cookies.txt -X DELETE \
  "http://localhost:5001/customer/auth/review/1" \
  -H "Content-Type: application/json"
```

## API Endpoint
DELETE http://localhost:5001/customer/auth/review/1

## HTTP Status: 200 OK

## Actual Output
```json
{"message":"Review for ISBN 1 posted by fariha07 deleted."}
```

## Step 3 – Verify review is gone
```bash
curl -s http://localhost:5001/review/1
```
Output (review removed):
```json
{}
```

## Implementation (auth_users.js)
```javascript
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (books[isbn]) {
        if (books[isbn].reviews && books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: `Review for ISBN ${isbn} posted by ${username} deleted.` });
        } else {
            return res.status(404).json({ message: `Review for ISBN ${isbn} by user ${username} not found.` });
        }
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});
```
