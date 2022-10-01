const jwt = require("jsonwebtoken");
const token = jwt.sign(
  { foo: "bar" },
  "secret-key",
  { expiresIn: "7d" },
  (err, token) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(token);
  }
);
