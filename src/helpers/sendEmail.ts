import nodemailer from "nodemailer";

export type MailOptionsType = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async (mailOptions: MailOptionsType) => {
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
  } catch (error) {
    return false;
  }
};

export default sendEmail;
