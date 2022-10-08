const config = require("../config/jwtConfig");
const jwt = require("jsonwebtoken");

module.exports = {
  sign: async (payload) => {
    const result = {
      token: jwt.sign(payload, config.secretKey, config.option),
    };
    return result;
  },

  verify: async (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, config.secretKey);
    } catch (err) {
      if (err.message === "jwt expired") {
        return "TOKEN_EXPIRED";
      } else {
        return "TOKEN_INVALID";
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
