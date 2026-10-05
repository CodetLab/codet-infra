import crypto from "crypto";

function generateApiKey(app: string) {
  const apiKey = `pk_${app}_${crypto.randomBytes(16).toString("hex")}`;

  const keyHash = crypto
    .createHash("sha256")
    .update(apiKey)
    .digest("hex");

  return { apiKey, keyHash };
}

for (const app of ["vector", "sentinel"]) {
  const { apiKey, keyHash } = generateApiKey(app);

  console.log(`\n${app}`);
  console.log(`pk:   ${apiKey}`);
  console.log(`hash: ${keyHash}`);
}

