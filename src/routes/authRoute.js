const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/auth/register').post(authController.createUser);
router.route('/auth/login').post(authController.login);

router.route('/logout').post(authController.logout);

module.exports = router;
