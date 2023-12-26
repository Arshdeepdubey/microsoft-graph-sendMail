require('dotenv').config();
const { ClientSecretCredential } = require('@azure/identity');

class EmailService {
  constructor() {
    this.tenantId = process.env.TENANT_ID;
    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = process.env.CLIENT_SECRET;
    this.senderEmail = process.env.SENDER_EMAIL;

    if (!this.tenantId || !this.clientId || !this.clientSecret) {
      throw new Error("Missing Azure AD credentials in environment variables.");
    }

    // Initialize Azure Identity credential
    this.credential = new ClientSecretCredential(
      this.tenantId,
      this.clientId,
      this.clientSecret
    );
  }

  /**
   * Acquires the access token directly from Azure Identity
   */
  async getAccessToken() {
    const tokenResponse = await this.credential.getToken([
      "https://graph.microsoft.com/.default"
    ]);
    return tokenResponse.token;
  }

  /**
   * Sends an email via Microsoft Graph REST API using native fetch
   */
  async sendEmail({ to, subject, content, isHtml = true, senderEmail = this.senderEmail }) {
    if (!to || !subject || !content) {
      throw new Error("Missing required parameters: to, subject, or content.");
    }

    if (!senderEmail) {
      throw new Error("SENDER_EMAIL is missing. Ensure it is defined in .env or passed to sendEmail.");
    }

    // Acquire valid token
    const token = await this.getAccessToken();

    // Prepare mail payload
    const mailPayload = {
      message: {
        subject: subject,
        body: {
          contentType: isHtml ? "HTML" : "Text",
          content: content
        },
        toRecipients: [
          {
            emailAddress: {
              address: to
            }
          }
        ]
      },
      saveToSentItems: true
    };

    const endpoint = `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`;

    // Make direct API call
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mailPayload)
    });

    // HTTP 202 Accepted means the email was queued and sent successfully
    if (response.status === 202) {
      return { success: true, status: 202 };
    }

    // If request failed, extract error body
    const errorBody = await response.json().catch(() => ({}));
    const err = new Error(`Microsoft Graph API Error [HTTP ${response.status}]`);
    err.status = response.status;
    err.statusCode = response.status;
    err.body = errorBody;
    throw err;
  }
}

module.exports = EmailService;