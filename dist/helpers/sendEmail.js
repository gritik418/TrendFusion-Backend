import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});
const sendEmail = async (mailOptions) => {
    try {
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(info);
                }
            });
        });
    }
    catch (error) {
        return false;
    }
};
export default sendEmail;
