const express = require('express');
const bloodBankController = require('../controllers/bloodBankController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.use(authMiddleware);

router.get('/', bloodBankController.getAllBloodBanks);
router.get('/:id', bloodBankController.getBloodBankById);
router.post('/', adminOnly, bloodBankController.createBloodBank);
router.put('/:id', adminOnly, bloodBankController.updateBloodBank);
router.delete('/:id', adminOnly, bloodBankController.deleteBloodBank);

module.exports = router;
