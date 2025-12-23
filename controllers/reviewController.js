const Review = require('../models/Review');
const Business = require('../models/Business');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
  try {
    const { businessId, customerName, customerEmail, rating, title, comment } = req.body;

    // Check if business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Set status based on business settings
    const status = business.settings.requireApproval ? 'pending' : 'approved';

    const review = await Review.create({
      businessId,
      customerName,
      customerEmail,
      rating,
      title,
      comment,
      status,
      isPublic: business.settings.allowPublicReviews,
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        source: 'web'
      }
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a business
// @route   GET /api/reviews/business/:businessId
// @access  Public (only approved and public reviews) / Private (all reviews for owner)
exports.getBusinessReviews = async (req, res) => {
  try {
    const { businessId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { businessId };

    // If not authenticated or not business owner, only show approved public reviews
    if (!req.user || (req.user.businessId && req.user.businessId.toString() !== businessId)) {
      query.status = 'approved';
      query.isPublic = true;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Private
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('businessId', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update review status
// @route   PUT /api/reviews/:id/status
// @access  Private (Business owner)
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the business this review belongs to
    if (!req.user.businessId || (req.user.businessId.toString() !== review.businessId.toString() && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.status = status;
    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Respond to a review
// @route   POST /api/reviews/:id/respond
// @access  Private (Business owner)
exports.respondToReview = async (req, res) => {
  try {
    const { text } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the business this review belongs to
    if (!req.user.businessId || (req.user.businessId.toString() !== review.businessId.toString() && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.response = {
      text,
      respondedBy: req.user._id,
      respondedAt: Date.now()
    };

    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Business owner/Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the business this review belongs to or is admin
    if (req.user.businessId && req.user.businessId.toString() !== review.businessId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
