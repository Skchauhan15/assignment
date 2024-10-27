const FCM = require("fcm-push");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { SALT_ROUNDS, NOTIFICATION_KEY, DEFAULT_LIMIT } = process.env;

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const phone_no = process.env.TWILIO_PHONE;
// const client = require("twilio")(accountSid, authToken);

require("dotenv").config();

console.log('Email:', process.env.EMAIL ? 'Loaded' : 'Not loaded');
console.log('Password:', process.env.PASSWORD ? 'Loaded' : 'Not loaded');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // Correct SMTP server hostname for Gmail
  port: 587,               // Port for secure TLS connection
  secure: false,  
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
  }
});

class GlobalHelper {
  static handleSuccess(res, response) {
    if (!res.req.originalUrl.includes('notifications')) {
      //console.log("response============", response)
    }
    res.send(response);
  }

  static handleCatch(res, error) {
    const { type, status_code, message: error_message } = error;
    res.status(status_code === undefined ? 400 : status_code).send({
      success: false,
      type: type === undefined ? "BAD_REQUEST" : type,
      message: error_message,
    });
  }

  static async handleCustomError(error) {
    const { status_code, error_message, type } = error;
    throw {
      status_code: status_code,
      type: type,
      message: error_message,
    };
  }

  static async handleJoiError(error) {
    const error_message = error.details[0].message;
    const custom_message = error_message.replace(/"/g, "");
    throw {
      status_code: 400,
      type: "Joi Error",
      message: custom_message,
    };
  }

  static async bcryptPassword(password) {
    try {
      const hash = await bcrypt.hash(password, Number(SALT_ROUNDS));
      return hash;
    } catch (err) {
      throw err;
    }
  }

  static async decryptPassword(password, hash) {
    try {
      const decrypt = await bcrypt.compare(password, hash);
      return decrypt;
    } catch (err) {
      throw err;
    }
  }

  static async sendNotification(fcm_token, data) {
    try {
      const fcm = new FCM(NOTIFICATION_KEY);
      const message = {
        to: fcm_token,
        data: data,
        notification: {
          type: data.type,
          title: data.title,
          body: data.message,
          sound: "default",
          badge: 0,
          priority: "high",
          content_available: true,
          foreground: true,
          show_in_foreground: true,
        },
      };
      fcm.send(message, (err, result) => {
        if (err) {
          //console.log("err...", err);
        } else {
          //console.log("Notification Sent Successfully", result);
        }
      });
    } catch (err) {
      throw err;
    }
  }

  static async sendNotificationsToAll(fcm_tokens, data) {
    try {
      const fcm = new FCM(NOTIFICATION_KEY);
      const message = {
        registration_ids: fcm_tokens,
        data: data,
        notification: {
          type: data.type,
          title: data.title,
          body: data.message,
          sound: "default",
          badge: 0,
          priority: "high",
          content_available: true,
          foreground: true,
          show_in_foreground: true,
        },
      };
      fcm.send(message, (err, result) => {
        if (err) {
          //console.log("err...", err);
        } else {
          //console.log("Notifications Bulk Sent Successfully", result);
        }
      });
    } catch (err) {
      throw err;
    }
  }

  static async sendEmail(to, subject, body) {
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: body,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("GLOB Error occurred:", error.message);
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (err) {
      //console.log(" global errr global ", err);
      throw err;
    }
  }

  static async setOptions(pagination, limit) {
    try {
      let options = {
        lean: true,
        sort: { _id: -1 },
      };

      if (pagination === undefined && limit === undefined) {
        options = {
          lean: true,
          sort: { _id: -1 },
          limit: 100,
          pagination: 0,
          skip: 0,
        };
      } else if (pagination === undefined && typeof limit !== undefined) {
        options = {
          lean: true,
          sort: { _id: -1 },
          limit: Number(limit),
          skip: 0,
        };
      } else if (typeof pagination !== undefined && limit === undefined) {
        options = {
          lean: true,
          sort: { _id: -1 },
          skip: Number(pagination) * Number(DEFAULT_LIMIT),
          limit: Number(DEFAULT_LIMIT),
        };
      } else if (typeof pagination !== undefined && typeof limit !== undefined) {
        options = {
          lean: true,
          sort: { _id: -1 },
          limit: Number(limit),
          skip: Number(pagination) * Number(limit),
        };
      }
      return options;
    } catch (err) {
      throw err;
    }
  }

  static async generateOtp() {
    try {
      const otp = `1234`;
      return otp;
    } catch (err) {
      throw err;
    }
  }

  static async generateUniqueCode() {
    try {
      const otp = randomstring.generate({
        length: 12,
        charset: "alphanumeric",
      });
      return otp;
    } catch (err) {
      throw err;
    }
  }


  static async sortData() {
    try {
      return {
        $sort: { _id: -1 },
      };
    } catch (err) {
      throw err;
    }
  }

  static async skipData(payload_data) {
    try {
      const { pagination, limit } = payload_data;
      let set_pagination = pagination ? parseInt(pagination) : 0;
      let set_limit = limit ? parseInt(limit) : 0;
      return {
        $skip: set_pagination * set_limit,
      };
    } catch (err) {
      throw err;
    }
  }

  static async limitData(payload_data) {
    try {
      const { limit } = payload_data;
      let set_limit = limit ? parseInt(limit) : 10;
      return {
        $limit: set_limit,
      };
    } catch (err) {
      throw err;
    }
  }

  static async smsService(to, phone_otp) {
    try {
      return;
      // const send_sms = await client.messages.create({
      //   body: `Your Sehemu account phone verification OTP is ${phone_otp}. Don't share this OTP with anyone for account safety.`,
      //   from: phone_no,
      //   to: to,
      // });
      // return send_sms;
    } catch (err) {
      return;
    }
  }
}

module.exports = GlobalHelper;
