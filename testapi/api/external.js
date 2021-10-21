const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const axios = require("axios");
const router = express.Router();

// Set up Auth0 configuration. These values should be
// the domain and audience for the API that you want to call.
const authConfig = {
  domain: "testbskapi.auth0.com",
  audience: "https://testapplicationapi.com",
  managementapi: "https://testbskapi.auth0.com/api/v2/users/",
  managementapiaudience: "https://testbskapi.auth0.com/api/v2/",
  tokenapi: "https://testbskapi.auth0.com/oauth/token"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from testbskapi.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
});

// Define an endpoint that must be called with an access token
router.get("/", checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});


module.exports = router;