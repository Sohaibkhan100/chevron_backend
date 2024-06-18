
import express from 'express';
import mongoose from 'mongoose';
import checkAuth from '../middlewares/check-auth.js';
import {order} from '../models/order.models.js';
import nodemailer from 'nodemailer';
import dotenv from "dotenv"


dotenv.config({
    path: `.env`
})



const router = express.Router();


router.post('/order', checkAuth, async (req, res, next) => {
    try {


        let cities = ["karachi","lahore","islamabad","multan","quetta"];
        let Total;

        console.log(req.body.subtotal);

        for (var i=0;i<cities.length ;i++){
            if (req.body.city == "karachi") {
                console.log("karachi");
                Total = req.body.subtotal + 300;
                console.log(Total)
                break;
                
            } else if(req.body.city == "lahore") {
                console.log("lahore");
                Total = req.body.subtotal + 400;
                console.log(Total)
                break;

                
            }else if(req.body.city == "islamabad") {
                console.log("islamabad");
                Total = req.body.subtotal + 500;
                console.log(Total)
                break;

                
            }else if(req.body.city == "multan") {
                console.log("multan");
                Total = req.body.subtotal + 400;
                console.log(Total)
                break;

                
            } else if(req.body.city == "quetta") {
                Total = req.body.subtotal + 300;
                console.log(Total)
                console.log("quetta");
                break;

                
            } 
        }
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
            total:Total
        });
  

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order created",
            order: savedOrder
        });
        if (res.statusCode === 201) {
            await mailer(req.body.customer_email,req.body.customer_name,"Sohaib");
            console.log("Email sent to:", req.body.customer_email);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_POST,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });


  async function mailer(receiverEmail, customerName,yourName) {
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_MAIL,
        to: receiverEmail,
        subject: "🌀 Thanks for Your Order! Dive into Pure Energy with Chevron ",
        text:`npm install opencv4nodejs

        
        Dear ${customerName},
        
        Thank you for choosing Chevron! 🌟
        
        We're thrilled to confirm that your recent order has been successfully processed. Your support means the world to us, and we can't wait for you to experience the high-quality products we pride ourselves on.
        
        If you have any questions or need further assistance, feel free to reach out to our customer service team. We're here to ensure your satisfaction every step of the way.
        
        Thank you once again for choosing Chevron. We look forward to serving you again in the future!
        
        Warm regards,
        
        ${yourName}
        Customer Service Team
        Chevron
        `
        
        
        
        
        

      });
  
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error occurred while sending email:", error);

    }
  }
  
export default router;
