const crypto = require("crypto");

const key = crypto.randomBytes(8).toString("hex");
console.log(key);
