import crypto from "crypto";

const apiKey =
  "pk_fiogp_" +
  crypto.randomBytes(16).toString("hex");

console.log(apiKey);

const hash = crypto
  .createHash("sha256")
  .update(apiKey)
  .digest("hex");

console.log(hash);