const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'smtp.mail.ovh.ca',
    port:587, // Or any other email service provider
    auth: {
      user: "postmaster@mazed.com.tn",
      pass: "Mazed@2025" // Your email password
    },
  });

  const mailOptions = {
    from: "postmaster@mazed.com.tn",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
