import express from 'express';
import checkAuth from '../middlewares/check-auth.js';
import {
    createProduct,
    getProducts,
    getProductById,
    searchProducts,
    addToFavorites,
    removeFromFavorites
} from '../controllers/product.controller.js';

const router = express.Router();

router.post('/products', checkAuth, createProduct);
router.get('/products', checkAuth, getProducts);
router.get('/:id', checkAuth, getProductById);
router.get('/search', checkAuth, searchProducts);
router.post('/products/addToFavorites', checkAuth, addToFavorites);
router.delete('/products/removeFromFavorites', checkAuth, removeFromFavorites);

export default router;
