
import express from 'express';
import mongoose from 'mongoose';
import checkAuth from '../middlewares/check-auth.js';
import {order} from '../models/order.models.js';



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
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});


export default router;
