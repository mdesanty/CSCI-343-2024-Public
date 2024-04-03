const jwt = require('jsonwebtoken');
const pgClient = require('../config/pgClient');

function authenticate(req, res, next) {
  const token = req.cookies?.jwt || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: `Bad token. ${error}` });
    }
    else {
      pgClient.query('SELECT id, email, is_admin FROM users WHERE id = $1', [decoded.id])
        .then(results => {
          if (results.rowCount > 0) {
            res.locals.user = results.rows[0];
            next();
          }
          else {
            res.status(401).json({ error: 'User not found.' });
          }

        })
        .catch(error => {
          res.status(401).json({ error: `Unauthorized. ${error}` });
        })
    }
  });
}

function authorizeAdmin(req, res, next) {
  if (!res.locals.user.is_admin) {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  next();
}

function authorizeBookOwner(req, res, next) {
  const bookId = req.params.id;
  const userId = res.locals.user.id;

  pgClient.query('SELECT id FROM books WHERE id = $1 AND user_id = $2', [bookId, userId])
    .then(results => {
      if (results.rowCount > 0) {
        next();
      }
      else {
        res.status(403).json({ error: 'Unauthorized.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeBookOwner
};