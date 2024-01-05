const express = require('express');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

const client = jwksClient({
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

app.post('/verify-token', (req, res) => {
  const { token } = req.body;
  // RSA & SHA256
  // https://github.com/auth0/node-jsonwebtoken/blob/bc28861f1fa981ed9c009e29c044a19760a0b128/verify.js
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).send({ verified: false, message: 'Token verification failed' });
    }
    res.send({ verified: true, decoded });
  });
});

// E: decode token
// https://github.com/auth0/node-jsonwebtoken/blob/bc28861f1fa981ed9c009e29c044a19760a0b128/decode.js
// https://github.com/auth0/node-jws/blob/b9fb8d30e9c009ade6379f308590f1b0703eefc3/lib/verify-stream.js#L56

// E: Token consists of 3 parts
// part 2 is signature, this must be non empty for our case

const port = 3001; // Use a different port from your React app
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
