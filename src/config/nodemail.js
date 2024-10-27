const nodemailer = require("nodemailer");

const sendmail = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.PASSWORD,
    },
  });

  const mailConfigurations = {
    from: "sumit.k.henceforth@gmai.com",
    to: "skchauhan15101966@@gmail.com",
    subject: "Sending Email using Node.js",
    text:
      "Hi! There, You know I am using the NodeJS " +
      "Code along with NodeMailer to send this email.",
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("Email Sent Successfully");
    console.log(info);
  });
};
module.exports = sendmail;
