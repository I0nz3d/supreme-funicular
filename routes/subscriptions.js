const express = require('express');
const router = express.Router();
const {
  getPlans,
  getSubscription,
  createOrUpdateSubscription,
  cancelSubscription
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/plans', getPlans);
router.get('/business/:businessId', protect, getSubscription);
router.post('/', protect, createOrUpdateSubscription);
router.put('/:id/cancel', protect, cancelSubscription);

module.exports = router;
