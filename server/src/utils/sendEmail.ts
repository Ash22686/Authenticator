import nodemailer from 'nodemailer';

// Interface for email options
interface MailOptions {
  email: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: MailOptions) => {
  // 1. Create a transporter using SMTP info from .env file
  //    For production, you'd use a real service like SendGrid, Mailgun, or AWS SES
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email content
  const mailOptions = {
    from: '"Your App" <noreply@yourapp.com>', // Sender address
    to: options.email,                         // Recipient
    subject: options.subject,                  // Subject line
    html: options.html,                        // HTML body content
  };

  // 3. Send the email and get info
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  // With Ethereal, a preview URL is generated to view the sent email
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

export default sendEmail;