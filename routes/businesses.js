const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getBusiness,
  updateBusiness,
  getDashboard
} = require('../controllers/businessController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getBusinesses);
router.get('/:id', protect, getBusiness);
router.put('/:id', protect, updateBusiness);
router.get('/:id/dashboard', protect, getDashboard);

module.exports = router;
