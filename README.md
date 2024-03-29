# OIDC Test App

Simple Web App that obtains JWT token with Google Login and verifies it using a javascript lib `jsonwebtoken`. 

## Run
Backend
```
node verifcation-server/server.js
```

Frontend
```
npm start
```

## Info 
### Frontend

```
npx create-react-app oidc-test-app
npm install @react-oauth/google
npm install axios jsonwebtoken
```

`npm start`

This credential is a JWT token.

{credential: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjkxNDEzY2Y0ZmEwY2I5Mm…csvUeosdGTTxxxxH9VH5fg', clientId: '469413265754-ov4onucxxxx', select_by: 'btn'}

Consists of Header, Payload, and Signature, separated by dot. 

### Backend

```
mkdir verification-server
cd verification-server
npm init -y
npm install express jsonwebtoken jwks-rsa cors
```
Add file `server.js` with this code:
```javascript
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
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).send({ verified: false, message: 'Token verification failed' });
    }
    res.send({ verified: true, decoded });
  });
});

const port = 3001; // Use a different port from your React app
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

```

Run with `node server.js`