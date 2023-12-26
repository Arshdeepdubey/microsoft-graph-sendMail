// inspect-token.js
require('dotenv').config();
const { ClientSecretCredential } = require('@azure/identity');

async function inspectToken() {
  const credential = new ClientSecretCredential(
    process.env.TENANT_ID,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  const tokenObj = await credential.getToken(["https://graph.microsoft.com/.default"]);
  const payloadBase64 = tokenObj.token.split('.')[1];
  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));

  console.log("--- GRANTED ROLES IN TOKEN ---");
  console.log("Roles:", payload.roles || "NO ROLES (Missing Admin Consent or Application Permission!)");
}

inspectToken();