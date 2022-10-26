const jwt = require("../utils/token");
const STATUS_CODE = require("../utils/status");

module.exports = async (req, res, next) => {
  const cookie = req.get("cookie");
  if (!cookie) {
    res.status(STATUS_CODE.Unauthorized).json({ fail: "NO_TOKEN" });
  }
  const token = cookie.split("=")[1];
  jwt.verify(token).then((decode) => {
    if (decode === "TOKEN_EXPIRED") {
      res.status(STATUS_CODE.Unauthorized).json({ fail: "TOKEN_EXPIRED" });
    } else if (decode === "TOKEN_INVALID") {
      res.status(STATUS_CODE.Unauthorized).json({ fail: "TOKEN_INVALID" });
    } else {
      console.log(decode.id, decode.email);
      req.payload = { id: decode.id, email: decode.email };
      next();
    }
  });
};
