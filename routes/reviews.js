const express = require('express');
const router = express.Router();
const {
  createReview,
  getBusinessReviews,
  getReview,
  updateReviewStatus,
  respondToReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', createReview);
router.get('/business/:businessId', getBusinessReviews);
router.get('/:id', protect, getReview);
router.put('/:id/status', protect, updateReviewStatus);
router.post('/:id/respond', protect, respondToReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
