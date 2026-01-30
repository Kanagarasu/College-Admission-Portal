const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to College Admission Portal',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for registering with our College Admission Portal.</p>
      <p>You can now login and start your admission process.</p>
      <br>
      <p>Best regards,</p>
      <p>College Admission Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendApplicationStatusEmail = async (email, name, status, remarks = '') => {
  const statusMessages = {
    approved: 'Congratulations! Your application has been approved.',
    rejected: 'We regret to inform you that your application has been rejected.',
    pending: 'Your application is under review.'
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Application Status Update - ${status.toUpperCase()}`,
    html: `
      <h1>Dear ${name},</h1>
      <p>${statusMessages[status]}</p>
      ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
      <br>
      <p>Login to your portal to view more details.</p>
      <br>
      <p>Best regards,</p>
      <p>College Admission Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Status email sent to:', email);
  } catch (error) {
    console.error('Error sending status email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendApplicationStatusEmail
};