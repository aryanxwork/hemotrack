const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginSchema, registerSchema } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

// Temporary seeding route for Render free plan
router.get('/seed-database', async (req, res) => {
  try {
    const seedLogic = require('../seeders/seed-logic');
    await seedLogic();
    res.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
