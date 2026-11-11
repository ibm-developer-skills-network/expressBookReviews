# Task 6: Register New User

## cURL Command
```bash
curl -s -X POST http://localhost:5001/register \
  -H "Content-Type: application/json" \
  -d '{"username":"fariha07","password":"pass1234"}'
```

## API Endpoint
POST http://localhost:5001/register

## HTTP Status: 200 OK

## Actual Output
```json
{"message":"Customer successfully registered. Now you can login"}
```

## Duplicate Registration (same username) — Error case
```bash
curl -s -X POST http://localhost:5001/register \
  -H "Content-Type: application/json" \
  -d '{"username":"fariha07","password":"pass1234"}'
```
Output (HTTP 404):
```json
{"message":"User already exists!"}
```

## Implementation (general.js)
```javascript
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});
```
