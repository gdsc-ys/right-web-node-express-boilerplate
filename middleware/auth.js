const jwt = require("../utils/token");

module.exports = async (req, res, next) => {
  const cookie = req.get("cookie");
  if (!cookie) {
    res.status(401).json({ fail: "NO_TOKEN" });
  }
  const token = cookie.split("=")[1];
  jwt.verify(token).then((decode) => {
    if (decode === "TOKEN_EXPIRED") {
      res.status(401).json({ fail: "TOKEN_EXPIRED" });
    } else if (decode === "TOKEN_INVALID") {
      res.status(401).json({ fail: "TOKEN_INVALID" });
    } else {
      req.payload = { id: decode.id, email: decode.email };
      next();
    }
  });
};
