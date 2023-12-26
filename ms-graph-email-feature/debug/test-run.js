const EmailService = require('./emailService');

async function runTest() {
  const emailService = new EmailService();
  console.log("Sending email...");

  try {
    await emailService.sendEmail({
      to: "arshdeepdubey.ad@gmail.com",
      subject: "Test Email from Node.js Graph Feature",
      content: "<h1>Success!</h1><p>The feature works properly using client credentials.</p>"
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("\n-- Microsoft Graph API Error --");
    console.error("Status Code:", error.statusCode || error.status || "N/A");
    console.error("Error Code Name:", error.code || "N/A");
    console.error("Error Message:", error.message);
    
    // Proper way to log enumerable + non-enumerable properties of an error
    console.error("Detailed Error Stack / Object:", 
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
  }
}

runTest();