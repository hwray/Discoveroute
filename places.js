function getPlaces() {
  var httpMethod = "GET", 
    parameters = {
      oauth_consumer_key: "yYfw_hnSvBqGMOxsoggiQQ", 
      oauth_token : "o8G8ptup2cX3iyI6S3S1YG317mCPYsyZ", 
      oauth_nonce : "1234" , 
      oauth_timestamp : (new Date().getTime()), 
      oauth_signature_method : "HMAC-SHA1", 
      oauth_version: "1.0",
    }, 
    consumerSecret = "ocT_ORTEaWMf51qpXg_DevQ15Pk", 
    tokenSecret = "qEIqCuvJ1rw1mkmzBuP4xRy67Cw", 
    encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);
}