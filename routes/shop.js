const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isNotLoggedIn = require('../middleware/isNotLoggedIn');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isNotLoggedIn, shopController.getCart);

router.post('/cart', isNotLoggedIn, shopController.postCart);

router.post('/cart-delete-item', isNotLoggedIn, shopController.postDeleteCartItem);

router.get('/orders', isNotLoggedIn, shopController.getOrders);

router.post('/create-order', isNotLoggedIn, shopController.postOrder);

router.get('/orders/:orderId', isNotLoggedIn, shopController.getInvoice);

router.get('/profile/:username', isNotLoggedIn, shopController.getProfile);

module.exports = router;
