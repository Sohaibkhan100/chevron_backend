import mongoose from 'mongoose';
import { order } from '../models/order.models.js';
import transporter from '../config/transporter.js';
import { getOrderConfirmationEmail } from '../template/emailTemplates.js';

const cities = ["karachi", "lahore", "islamabad", "multan", "quetta"];

const calculateTotal = (subtotal, city) => {
    let Total;
    if (city === "karachi") {
        Total = subtotal + 300;
    } else if (city === "lahore" || city === "multan") {
        Total = subtotal + 400;
    } else if (city === "islamabad") {
        Total = subtotal + 500;
    } else if (city === "quetta") {
        Total = subtotal + 300;
    }
    return Total;
};

export const createOrder = async (req, res) => {
    try {
        const Total = calculateTotal(req.body.subtotal, req.body.city);

        const newOrder = new order({
            _id: new mongoose.Types.ObjectId(),
            customer_id: req.body.customer_id,
            customer_name: req.body.customer_name,
            product_cart: req.body.product_cart,
            subtotal: req.body.subtotal,
            customer_email: req.body.customer_email,
            address: req.body.address,
            city: req.body.city,
            postal_code: req.body.postal_code,
            phone: req.body.phone,
            card_no: req.body.card_no,
            expiry: req.body.expiry,
            cvc: req.body.cvc,
            total: Total
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order created",
            order: savedOrder
        });

        if (res.statusCode === 201) {
            const emailTemplate = getOrderConfirmationEmail(req.body.customer_name);
            await sendEmail(req.body.customer_email, emailTemplate);
            console.log("Email sent to:", req.body.customer_email);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};

const sendEmail = async (receiverEmail, emailTemplate) => {
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: receiverEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error occurred while sending email:", error);
    }
};
