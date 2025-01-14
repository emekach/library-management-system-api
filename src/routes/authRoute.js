const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/auth').post(authController.createUser);

module.exports = router;
