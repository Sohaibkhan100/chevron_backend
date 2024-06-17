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



router.get('/products', checkAuth, async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const products = await product.find(filter).exec();
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

router.get('/products/:id', checkAuth, async (req, res, next) => {
    try {
        const productId = req.params.id; // Extract product ID from URL params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const foundProduct = await product.findById(productId).exec();

        if (!foundProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({
            product: foundProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/products/search', checkAuth, async (req, res, next) => {
    try {
        const searchText = req.query.search;

        if (!searchText) {
            return res.status(400).json({ error: "Search text is required" });
        }

        const filter = {
            product_details: { $regex: searchText, $options: 'i' } // 'i' for case-insensitive
        };

        const products = await product.find(filter).exec();
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
