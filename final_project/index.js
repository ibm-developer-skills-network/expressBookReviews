const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const books = require('./router/booksdb.js');
const customerRoutes = require('./router/auth_users.js').authenticated;
const genlRoutes = require('./router/general.js').general;
const jwtSecret = require('./router/auth_users.js').jwtSecret;

const app = express();
app.use(express.json());
app.use('/customer', session({
  secret: process.env.SESSION_SECRET || 'change-this-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

// The catalog is served as JSON for Axios-based retrieval in general.js.
app.get('/_internal/books', (_req, res) => res.json(books));

// Authenticate protected review requests with the login session or a Bearer JWT.
app.use('/customer/auth/*', (req, res, next) => {
  if (req.session?.user) {
    req.user = { username: req.session.user };
    return next();
  }

  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ message: 'Authentication required' });

  try {
    req.user = jwt.verify(match[1], jwtSecret);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.use('/customer', customerRoutes);
app.use('/', genlRoutes);

const PORT = Number(process.env.PORT) || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

module.exports = app;
