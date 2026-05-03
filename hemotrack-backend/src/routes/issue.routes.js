const express = require('express');
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');
const { issueBloodSchema } = require('../validators/issueValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', issueController.getAllIssues);
router.post('/', adminOnly, validate(issueBloodSchema), issueController.issueBlood);

module.exports = router;
