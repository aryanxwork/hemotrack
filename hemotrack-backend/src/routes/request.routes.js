const express = require('express');
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');
const { createRequestSchema } = require('../validators/bloodRequestValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.post('/', validate(createRequestSchema), requestController.createRequest);
router.put('/:id/approve', adminOnly, requestController.approveRequest);
router.put('/:id/reject', adminOnly, requestController.rejectRequest);
router.delete('/:id', adminOnly, requestController.deleteRequest);

module.exports = router;
