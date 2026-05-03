const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/donors', reportController.donorReport);
router.get('/stock', reportController.stockReport);
router.get('/donations', reportController.donationReport);
router.get('/expired', reportController.expiredReport);

module.exports = router;
