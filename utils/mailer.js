const nodemailer = require('nodemailer');

exports.signupEmail = async (receiverMail) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
        port: 587, // Port for secure SMTP
        secure: false,
        service: 'gmail',
        auth: {
            user: process.env.OWN_MAIL,
            pass: process.env.OWN_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.OWN_MAIL,
        to: receiverMail,
        subject: "Successful!! Successful!! Successful!!",
        text: "Thank you for signing up.",
        html: "<b>Thank you for signing up.</b>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

exports.loginEmail = async (receiverMail) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
        port: 587, // Port for secure SMTP
        secure: false,
        service: 'gmail',
        auth: {
            user: process.env.OWN_MAIL,
            pass: process.env.OWN_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.OWN_MAIL,
        to: receiverMail,
        subject: "Successful!! Successful!! Successful!!",
        text: "Thank you for Login.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Message sent: %s', info.messageId);
    });
};