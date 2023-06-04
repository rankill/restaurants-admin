const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const restaurantRoutes = require('./restaurant.route');
const reviewRoutes = require('./review.route');

const router = express.Router();

router.use('/', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);

module.exports = router;
