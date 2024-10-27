const path = require("path");
const fs = require("fs");
const GlobalHelper = require("./helper");
// import templates from "../../../templates/"
class EmailService {
  static signUpOTpEmail = async (data) => {
    try {
      let subject = `Verify your email`;
      let { email, name, otp } = data;
      //console.log("email, name, otp ", email, name, otp );

      let file_path = path.join(
        __dirname,
        "../../public/sign-up-otp.html"
      );
      let html_data = fs.readFileSync(file_path, "utf8");
      html_data = html_data.replace("%USER_NAME%", name);
      html_data = html_data.replace("%OTP%", otp);
      console.log("sending email in emailsercie")
      await GlobalHelper.sendEmail(email, subject, html_data);
    } catch (err) {
      //console.log(" user errr user ", err);
      throw err;
    }
  };

  static welcomeEmail = async (data) => {
    try {
      let subject = `Welcome mail`;
      let { email, name } = data;
      let file_path = path.join(
        __dirname,
        "../../public/welcome-email.html"
      );
      let html_data = fs.readFileSync(file_path, "utf8");
      html_data = html_data.replace("%USER_NAME%", name);

      await GlobalHelper.sendEmail(email, subject, html_data);
    } catch (err) {
      //console.log(" user errr user ", err);
      throw err;
    }
  };

  static ResendOTPEmail = async (data) => {
    try {
      let subject = `Resend OTP`;
      let { email, name, otp } = data;
      let file_path = path.join(
        __dirname,
        "../../public/resend-email-otp.html"
      );
      let html_data = fs.readFileSync(file_path, "utf8");
      html_data = html_data.replace("%USER_NAME%", name);
      html_data = html_data.replace("%OTP%", otp);

      await GlobalHelper.sendEmail(email, subject, html_data);
    } catch (err) {
      //console.log(" user errr user ", err);
      throw err;
    }
  };

  static ResetPasswordEmail = async (data) => {
    try {
      let subject = `Reset Password OTP`;
      let { email, name, fp_otp } = data;
      let file_path = path.join(
        __dirname,
        "../../public/reset-passwrd-otp.html"
      );
      let html_data = fs.readFileSync(file_path, "utf8");
      html_data = html_data.replace("%USER_NAME%", name);
      html_data = html_data.replace("%OTP%", fp_otp);

      //console.log("email send to ", email);
      await GlobalHelper.sendEmail(email, subject, html_data);
    } catch (err) {
      //console.log(" user errr user ", err);
      throw err;
    }
  };
  
  static TaskAssignEmail = async (data) => {
    try {
      let subject = `New Task Assign`;
      let { email, user_name, title } = data;
      let file_path = path.join(
        __dirname,
        "../../public/newtaskassign.html"
      );
      let html_data = fs.readFileSync(file_path, "utf8");
      html_data = html_data.replace("%USER_NAME%", user_name);
      html_data = html_data.replace("%TITLE%", title);

      //console.log("email send to ", email);
      await GlobalHelper.sendEmail(email, subject, html_data);
    } catch (err) {
      //console.log(" user errr user ", err);
      throw err;
    }
  };

  static TaskUpdateEmail = async (data) => {
    try {
      let subject = `Task update`;
      let { email, user_name, title } = data;
      console.log("usern_name00",user_name)
      let file_path = path.join(
        __dirname,
        "../../public/taskupdated.html"
      );
      let html_data = fs.readFileSync(file_path, "utf8");
      html_data = html_data.replace("%USER_NAME%", user_name);
      html_data = html_data.replace("%TITLE%", title);

      //console.log("email send to ", email);
      await GlobalHelper.sendEmail(email, subject, html_data);
    } catch (err) {
      //console.log(" user errr user ", err);
      throw err;
    }
  };
}

module.exports = EmailService;
