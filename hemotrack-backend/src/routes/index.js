const express = require('express');

const authRoutes = require('./auth.routes');
const donorRoutes = require('./donor.routes');
const bloodBankRoutes = require('./bloodBank.routes');
const bloodUnitRoutes = require('./bloodUnit.routes');
const hospitalRoutes = require('./hospital.routes');
const requestRoutes = require('./request.routes');
const issueRoutes = require('./issue.routes');
const donationRoutes = require('./donation.routes');
const reportRoutes = require('./report.routes');
const auditRoutes = require('./audit.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/donors', donorRoutes);
router.use('/blood-banks', bloodBankRoutes);
router.use('/blood-units', bloodUnitRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/requests', requestRoutes);
router.use('/issue', issueRoutes);
router.use('/donations', donationRoutes);
router.use('/reports', reportRoutes);
router.use('/audit-log', auditRoutes);

module.exports = router;
