const Business = require('../models/Business');
const Subscription = require('../models/Subscription');
const Review = require('../models/Review');

// @desc    Get all businesses (admin only)
// @route   GET /api/businesses
// @access  Private/Admin
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate('ownerId', 'name email')
      .populate('subscriptionId');
    
    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single business
// @route   GET /api/businesses/:id
// @access  Private
exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('subscriptionId');

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Check if user owns this business or is admin
    if (business.ownerId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private
exports.updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Check if user owns this business or is admin
    if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get business dashboard stats
// @route   GET /api/businesses/:id/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Check if user owns this business or is admin
    if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get review statistics
    const totalReviews = await Review.countDocuments({ businessId: req.params.id });
    const approvedReviews = await Review.countDocuments({ businessId: req.params.id, status: 'approved' });
    const pendingReviews = await Review.countDocuments({ businessId: req.params.id, status: 'pending' });
    
    const reviewStats = await Review.aggregate([
      { $match: { businessId: business._id } },
      { $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }}
    ]);

    const recentReviews = await Review.find({ businessId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        business,
        stats: {
          totalReviews,
          approvedReviews,
          pendingReviews,
          averageRating: reviewStats.length > 0 ? reviewStats[0].averageRating.toFixed(1) : 0
        },
        recentReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
