const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const axios = require("axios");

// Create a new Express app
const app = express();

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
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});

app.post("/api/order",checkJwt, (req, res) => {
    var emailverified = req.headers.emailverified;
    var user = req.headers.user;
    var authorizationHeader = req.headers.authorization;
    if(emailverified)
    {
      var axios = require("axios").default;
      var headers = {headers:{Authorization: authorizationHeader}};
      var options = {
        method: 'POST',
        url: 'https://testbskapi.auth0.com/oauth/token',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: {
          grant_type: 'client_credentials',
          client_id: 'WW0N3upjQepDBZx9m4HxyAcowPGDxNP3',
          client_secret: 'Xfa2E1KbsMchtMNcSrZ5-N_cekE-c6f0DmaDFrwZ32ZMC0VXDuV2g7j-FwqckJax',
          audience: 'https://testbskapi.auth0.com/api/v2/'
        }
      };
      
      axios.post(authConfig.tokenapi,options.data,headers).then(function (response) {
        //console.log(response.data);
        var orderId = new Date()+"232";
        var token = response.data.access_token;
        var headers = {headers:{Authorization: `Bearer ${token}`}};
        var requesturl = authConfig.managementapi+user;
        var payload = {
          "user_metadata" : { "orders": orderId }
        };
  
        axios.patch(requesturl,payload, headers).then(function(data){ 
          res.send({
            msg: "Order placed and profile updated with metadata"
          });                                      
         });
      }).catch(function (error) {
        console.error(error);
      });

     
    }
    else
    {
      res.send({
        msg: "Enable your email address"
      });
    }    
});

function getToken()
{


}

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));