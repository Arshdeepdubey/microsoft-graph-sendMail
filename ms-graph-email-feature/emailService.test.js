const EmailService = require('./emailService');

jest.mock('@azure/identity', () => ({
  ClientSecretCredential: jest.fn().mockImplementation(() => ({
    getToken: jest.fn().mockResolvedValue({ token: 'fake_mock_token' })
  }))
}));

global.fetch = jest.fn();

describe('EmailService', () => {
  beforeEach(() => {
    process.env.TENANT_ID = 'test-tenant';
    process.env.CLIENT_ID = 'test-client';
    process.env.CLIENT_SECRET = 'test-secret';
    process.env.SENDER_EMAIL = 'sender@test.com';
    jest.clearAllMocks();
  });

  test('should send mail successfully with valid params', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 202,
      ok: true
    });

    const emailService = new EmailService();
    const result = await emailService.sendEmail({
      to: 'recipient@test.com',
      subject: 'Test',
      content: 'Hello'
    });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('should throw error when missing required fields', async () => {
    const emailService = new EmailService();
    await expect(emailService.sendEmail({ to: 'recipient@test.com' }))
      .rejects.toThrow("Missing required parameters: to, subject, or content.");
  });
});