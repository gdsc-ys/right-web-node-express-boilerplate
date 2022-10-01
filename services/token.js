const config = require("../config/jwtConfig");
const jwt = require("jsonwebtoken");

module.exports = {
  sign: async (payload) => {
    const result = {
      //sign메소드를 통해 access token 발급!
      token: jwt.sign(payload, config.secretKey, config.option),
    };
    return result;
  },

  verify: async (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err.message === "jwt expired") {
        console.log("expired token");
        return TOKEN_EXPIRED;
      } else if (err.message === "invalid token") {
        console.log("invalid token");
        console.log(TOKEN_INVALID);
        return TOKEN_INVALID;
      } else {
        console.log("invalid token");
        return TOKEN_INVALID;
      }
    }
    return decoded;
  },
};

// function generateToken(payload) {
//   return new Promise((resolve, reject) => {
//     jwt.sign(payload, config.secretKey, config.option, (error, token) => {
//       if (error) reject(error);
//       resolve(token);
//     });
//   });
// }
// exports.generateToken = generateToken;
