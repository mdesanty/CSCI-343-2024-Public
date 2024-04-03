const pgClient = require('../config/pgClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function register(req, res) {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);

  pgClient.query('INSERT INTO users (email, password) VALUES($1, $2)', [email, hash])
    .then(results => {
      pgClient.query('SELECT id, email FROM users WHERE email = $1', [email])
        .then(results => {
          const token = generateToken({ id: results.rows[0].id });
          const payload = {
            id: results.rows[0].id,
            email: results.rows[0].email,
            token: token
          };

          res.cookie('jwt', token, {
            maxAge: '1000',
            httpOnly: true
          });

          res.json(payload);
        })
        .catch(error => {
          res.status(500).json({ error: `${error}` });
        });
    })
    .catch(error => {
      res.status(500).json({ error: `${error}` });
    });
}

function login(req, res) {
  const { email, password } = req.body;

  pgClient.query('SELECT id, email, password FROM users WHERE email = $1', [email])
    .then(results => {
      if (results.rowCount > 0) {
        if (bcrypt.compareSync(password, results.rows[0].password)) {
          const token = generateToken({ id: results.rows[0].id });
          const payload = {
            id: results.rows[0].id,
            email: results.rows[0].email,
            token: token
          };

          res.cookie('jwt', token, {
            maxAge: '1000000',
            httpOnly: true
          });

          res.json(payload);
        }
        else {
          res.status(401).json({});
        }
      }
      else {
        res.status(404).json({ error: 'User not found.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `${error}` });
    });
}

function logout(req, res) {
  res.clearCookie('jwt');
  res.json({ message: 'Successfully logged out.' });
}

function verifyToken(req, res) {
  if (res.locals.user !== undefined) {
    res.json(res.locals.user);
  }
  else {
    res.status(401).json({ error: 'No one is logged in.' });
  }
}

function generateToken(attributes) {
  return jwt.sign(attributes, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const authController = {
  register,
  login,
  logout,
  verifyToken
}

module.exports = authController;