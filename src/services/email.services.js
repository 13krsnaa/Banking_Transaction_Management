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

//* Function to send email *//

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

module.exports = transporter;
module.exports = sendEmail;

module.exports = {
  sendRegistrationEmail,
};
