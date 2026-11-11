# Task 7: Login as a Registered User

## cURL Command
```bash
curl -s -c cookies.txt -X POST http://localhost:5001/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"fariha07","password":"pass1234"}'
```

## API Endpoint
POST http://localhost:5001/customer/login

## HTTP Status: 200 OK

## Actual Output (successful login)
```json
{"message":"Customer successfully logged in"}
```

## Invalid Credentials Case
```bash
curl -s -X POST http://localhost:5001/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"fariha07","password":"wrongpassword"}'
```
Output (HTTP 208):
```json
{"message":"Invalid Login. Check username and password"}
```

## Implementation (auth_users.js)
```javascript
const authenticatedUser = (username,password)=>{ //returns boolean
    let matchingUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return matchingUsers.length > 0;
}

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in: Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        };
        return res.status(200).json({ message: "Customer successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});
```
