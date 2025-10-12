import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, message) => {
    console.log(email);
    const transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, // Use `true` for port 465, `false` for all other ports
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_KEY
        },
    });

    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    const info = await transporter.sendMail({
        to: email, // list of receivers
        subject: subject, // Subject line
        // text: "Hello world?", // plain text body
        html: message, // html body
    });


}

export default sendEmail