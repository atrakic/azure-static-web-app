const jwt = require("jsonwebtoken");

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
// openssl rand -hex 32
// python3 -c "import secrets; print(secrets.token_hex(32))"

const SECRET_KEY =
  process.env.JWT_SECRET ||
  "21a2821bdcf5ac60667d00363f5b97f9b33c548951a6753943fa6b27ec3b9bb9";

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
