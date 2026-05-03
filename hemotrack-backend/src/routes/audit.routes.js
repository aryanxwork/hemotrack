const express = require('express');
const auditController = require('../controllers/auditController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.use(authMiddleware);
router.use(adminOnly);

router.get('/', auditController.getAllLogs);
router.get('/:id', auditController.getLogById);

module.exports = router;
