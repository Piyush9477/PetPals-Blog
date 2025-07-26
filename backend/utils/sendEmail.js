const nodemailer = require("nodemailer");
const {senderEmail, emailPassword} = require("../config/keys");

const sendEmail = async({emailTo, subject, code, content}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: senderEmail,
            pass: emailPassword
        }
    });

    const message = {
        to: emailTo,
        subject,
        html:`
            <div>
                <h3>Use below code to ${content}</h3>
                <p><strong>Code: </strong>${code}</p>
            </div>
        `
    }

    await transporter.sendMail(message);
}

module.exports = sendEmail;