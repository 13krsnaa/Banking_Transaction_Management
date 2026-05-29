//* ye services folder me ham apne app me jo third party services use krte hai unko add krte hai . *//

require("dotenv").config();

const nodemailer = require("nodemailer");

//* Ye SMTP server se communicate krne ke liyeuse hota hai *//

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

//* Function to send  email *//

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking Transaction Management" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Banking Transaction Management!";
  const text = `Dear ${name},\n\nThank you for registering with Banking Transaction Management. We are excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nBanking Transaction Management Team`;
  const html = `<p>Dear ${name},</p><p>Thank you for registering with Banking Transaction Management. We are excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.</p><p>Best regards,<br>Banking Transaction Management Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Alert: Transaction Successful !";
  const text = `Dear ${name},\n\nWe are pleased to inform you that your transaction of $${amount} to account ${toAccount} has been successfully processed. If you have any questions or need further assistance, please do not hesitate to contact our support team.\n\nBest regards,\nBanking Transaction Management Team`;

  const html = `<p>Dear ${name},</p><p>We are pleased to inform you that your transaction of $${amount} to account ${toAccount} has been successfully processed. If you have any questions or need further assistance, please do not hesitate to contact our support team.</p><p>Best regards,<br>Banking Transaction Management Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendFailedTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Alert: Transaction Failed !";

  const text = `Dear ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please check your account balance and try again. If you continue to experience issues, please contact our support team for assistance.\n\nBest regards,\nBanking Transaction Management Team`;

  const html = `<p>Dear ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please check your account balance and try again. If you continue to experience issues, please contact our support team for assistance.</p><p>Best regards,<br>Banking Transaction Management Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = transporter;
module.exports = sendEmail;

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendFailedTransactionEmail,
};
