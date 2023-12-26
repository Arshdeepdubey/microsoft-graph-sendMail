require('dotenv').config();

async function testRawAuth() {
  const tenantId = process.env.TENANT_ID;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  console.log("--- Testing Raw Azure AD Auth ---");
  console.log("Tenant ID:", tenantId);
  console.log("Client ID:", clientId);
  console.log("Secret Length:", clientSecret ? clientSecret.length : 0);

  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default'
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("\n❌ ENTRA ID REJECTED CREDENTIALS:");
      console.error("Error Code:", data.error);
      console.error("Error Description:", data.error_description);
    } else {
      console.log("\n✅ AUTH SUCCESSFUL!");
      console.log("Access Token acquired successfully. Token starts with:", data.access_token.substring(0, 20) + "...");
    }
  } catch (err) {
    console.error("Network Error:", err.message);
  }
}

testRawAuth();