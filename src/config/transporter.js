import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config({
    path: `.env`
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error with email transporter:', error);
    } else {
        console.log('Email transporter is ready');
    }
});

export default transporter;
