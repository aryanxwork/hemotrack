const express = require('express');
const bloodUnitController = require('../controllers/bloodUnitController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');
const { createBloodUnitSchema } = require('../validators/bloodUnitValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', bloodUnitController.getAllBloodUnits);
router.get('/stock/:blood_group', bloodUnitController.getStock);
router.get('/:id', bloodUnitController.getBloodUnitById);
router.post('/', adminOnly, validate(createBloodUnitSchema), bloodUnitController.createBloodUnit);
router.put('/:id', adminOnly, bloodUnitController.updateBloodUnit);
router.delete('/:id', adminOnly, bloodUnitController.deleteBloodUnit);

module.exports = router;
