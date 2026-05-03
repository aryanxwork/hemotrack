const express = require('express');
const donorController = require('../controllers/donorController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');
const { registerDonorSchema, updateDonorSchema } = require('../validators/donorValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', donorController.getAllDonors);
router.get('/:id', donorController.getDonorById);
router.post('/', validate(registerDonorSchema), donorController.registerDonor);
router.put('/:id', validate(updateDonorSchema), donorController.updateDonor);
router.delete('/:id', adminOnly, donorController.deleteDonor);

module.exports = router;
