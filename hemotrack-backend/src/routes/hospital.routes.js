const express = require('express');
const hospitalController = require('../controllers/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.use(authMiddleware);

router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.get('/:id/requests', hospitalController.getHospitalRequests);
router.post('/', adminOnly, hospitalController.createHospital);
router.put('/:id', adminOnly, hospitalController.updateHospital);
router.delete('/:id', adminOnly, hospitalController.deleteHospital);

module.exports = router;
