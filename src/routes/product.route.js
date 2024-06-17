import express from 'express';
import mongoose from 'mongoose';
import checkAuth from '../middlewares/check-auth.js';
import {product} from '../models/product.models.js';



const router = express.Router();


router.post('/products', checkAuth, async (req, res, next) => {
    try {
        const Product = new product({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            price: req.body.price,
            size: req.body.size,
            color: req.body.color ,
            category: req.body.category,
            product_details: req.body.product_details,
            product_image: req.body.product_image,
            rating: req.body.rating,
        });

        let products = await Product.save();

        res.status(200).json({
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});
export default router;
