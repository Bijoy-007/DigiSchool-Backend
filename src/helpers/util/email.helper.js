import nodemailer from "nodemailer";

class Email {
  constructor() {}

  async sendEmail(to, subject, html) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_ID,
        to: to,
        subject: subject,
        html: html,
      };

      return transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Email();
