class EmailTemplate {
  constructor() {}
  getForgetPasswordEmailTemplate(schoolName, token) {
    const logoURL = `${process.env.BACKEND_BASE_URL}/images/logo.png`;
    const authUrl = `${process.env.FRONTEND_BASE_URL}/reset_password/${token}`;

    return `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background: linear-gradient(135deg, #ff9ba8, #6d76e8); box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); border-radius: 10px; font-family: 'Roboto', 'Arial', sans-serif; text-align: center; color: #fff;">
        <div style="margin-bottom: 20px;">
          <img src=${logoURL} alt="DigiSchool Logo" style="width: 150px; height: 150px; border-radius: 50%; border: 5px solid #6d76e8; object-fit: cover;">
        </div>
      
        <h2 style="color: #fff; font-size: 24px; letter-spacing: 2px;">Password Reset</h2>
        <p style="color: #eee; font-size: 16px;">Hello Admin, (${schoolName})</p>
        <p style="color: #eee; font-size: 16px;">We received a request to reset your password for DigiSchool. If you made this request, click the button below to reset your password. If you didn't make this request, you can ignore this email.</p>
      
        <a href=${authUrl} style="display: inline-block; padding: 15px 30px; background: linear-gradient(45deg, #6d76e8, #ff9ba8); color: #fff; text-decoration: none; border: none; border-radius: 30px; font-weight: bold; font-size: 18px; transition: transform 0.3s ease-in-out;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Reset Password</a>
      
        <p style="color: #eee; font-size: 16px; margin-top: 20px;">This password reset link will expire in [expiration time]. Please note that for security reasons, the link is only valid for a limited time.</p>
      
        <p style="color: #eee; font-size: 16px; margin-top: 20px;">If you did not request a password reset or have any concerns, please contact our support team immediately.</p>
      
        <p style="color: #eee; font-size: 16px; margin-top: 20px;">Thank you for choosing DigiSchool!</p>
      
        <p style="color: #eee; font-size: 16px; margin-top: 20px;">Best Regards,<br>DigiSchool Team</p>
      </div>`;
  }

  getCreateSchoolTemplate(schoolName, token) {
    const logoURL = `${process.env.BACKEND_BASE_URL}/images/logo.png`;
    const authUrl = `${process.env.FRONTEND_BASE_URL}/verify_school_email/${token}`;

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DigiSchool</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
      
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
      
              h1 {
                  color: #333;
              }
      
              p {
                  color: #555;
              }
      
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 15px 0;
                  text-decoration: none;
                  background-color: #007BFF;
                  color: #fff;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: linear-gradient(135deg, #ff9ba8, #6d76e8); box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); border-radius: 10px; font-family: 'Roboto', 'Arial', sans-serif; text-align: center; color: #fff;">
        <div style="margin-bottom: 20px;">
          <img src=${logoURL} alt="DigiSchool Logo" style="width: 150px; height: 150px; border-radius: 50%; border: 5px solid #6d76e8; object-fit: cover;">
        </div>
          <div class="container">
              <h1>Welcome to DigiSchool!</h1>
              <p>Dear Admin (${schoolName}),</p>
              <p>We are excited to have you on board. Thank you for joining our platform. To get started, click the button below and verify your email Id:</p>
      
              <a href=${authUrl} class="btn">Verify</a>
              
              <p>Best regards,<br>Your DigiSchool Team</p>
          </div>
      </body>
      </html>
      `;
  }
}
export default new EmailTemplate();
