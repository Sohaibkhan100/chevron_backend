import multer from 'multer';
import mongoose from 'mongoose';
import { product } from '../models/product.models.js';
import { user } from '../models/user.models.js';


const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Adding timestamp to filename to avoid conflicts
    },
});

const upload = multer({
    storage: Storage,
}).array('product_images', 10);  // Use 'product_images' as the field name

export const createProduct = async (req, res, next) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err); 
                return res.status(500).json({ error: err.message });
            } else {
                const imagePaths = await req.files.map(file => file.path);  // Get paths of uploaded images
                const Product = new product({
                    _id: new mongoose.Types.ObjectId(),
                    title: req.body.title,
                    price: req.body.price,
                    size: req.body.size,  
                    color: req.body.color,
                    category: req.body.category,
                    product_details: req.body.product_details,
                    product_image: imagePaths,  // Store array of image paths
                    rating: req.body.rating,
                });
        
                let savedProduct = await Product.save();
        
                res.status(200).json({
                    product: savedProduct
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};

// Get all products or filter by category
export const getProducts = async (req, res, next) => {
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
};

// Get a single product by ID
export const getProductById = async (req, res, next) => {
    try {
        const productId = req.params.id;

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
};

// Search products by product_details
export const searchProducts = async (req, res, next) => {
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
};
export const addToFavorites = (req, res) => {
    const { userId, itemId } = req.body;
  
    user
      .findById(userId)
      .exec()
      .then((existingUser) => {
        if (!existingUser) {
          return res.status(404).json({
            message: "User not found",
          });
        } else {
            product
            .findById(itemId)
            .exec()
            .then((existingproduct) => {
              if (!existingproduct) {
                return res.status(404).json({
                  message: "Item not found",
                });
              } else {
                existingUser.favorites.push(itemId);
                existingUser
                  .save()
                  .then((result) => {
                    res.status(200).json({
                      message: "Item added to favorites",
                      user: result,
                    });
                  })
                  .catch((err) => {
                    res.status(500).json({
                      error: err,
                    });
                  });
              }
            })
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  };

  export const removeFromFavorites = (req, res) => {
    const { userId, itemId } = req.body;
  
    user
      .findById(userId)
      .exec()
      .then((existingUser) => {
        if (!existingUser) {
          return res.status(404).json({
            message: "User not found",
          });
        } else {
            existingUser.favorites.pop(itemId);
            existingUser
              .save()
              .then((result) => {
                res.status(200).json({
                  message: "Item removed from favorites",
                  user: result,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  };