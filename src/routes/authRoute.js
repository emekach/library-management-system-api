const express = require('express');
const authController = require('./../controllers/authController');
const authMiddleware = require('./../middlewares/auth');

const router = express.Router();

router.route('/auth/register').post(authController.createUser);
router.route('/auth/login').post(authMiddleware.protect, authController.login);

router.route('/logout').post(authController.logout);

module.exports = router;
