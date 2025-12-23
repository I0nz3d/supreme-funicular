const Subscription = require('../models/Subscription');
const Business = require('../models/Business');

// Subscription plans configuration
const PLANS = {
  basic: {
    monthly: { price: 29, maxReviews: 100, maxUsers: 1, analyticsAccess: false, apiAccess: false, prioritySupport: false },
    yearly: { price: 290, maxReviews: 100, maxUsers: 1, analyticsAccess: false, apiAccess: false, prioritySupport: false }
  },
  pro: {
    monthly: { price: 79, maxReviews: 1000, maxUsers: 5, analyticsAccess: true, apiAccess: true, prioritySupport: false },
    yearly: { price: 790, maxReviews: 1000, maxUsers: 5, analyticsAccess: true, apiAccess: true, prioritySupport: false }
  },
  enterprise: {
    monthly: { price: 199, maxReviews: -1, maxUsers: -1, analyticsAccess: true, apiAccess: true, prioritySupport: true },
    yearly: { price: 1990, maxReviews: -1, maxUsers: -1, analyticsAccess: true, apiAccess: true, prioritySupport: true }
  }
};

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
exports.getPlans = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: PLANS
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get subscription by business ID
// @route   GET /api/subscriptions/business/:businessId
// @access  Private
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ businessId: req.params.businessId });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    // Check authorization
    const business = await Business.findById(req.params.businessId);
    if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update subscription
// @route   POST /api/subscriptions
// @access  Private (Business owner)
exports.createOrUpdateSubscription = async (req, res) => {
  try {
    const { businessId, plan, billingCycle } = req.body;

    // Check authorization
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get plan details
    const planDetails = PLANS[plan][billingCycle];
    if (!planDetails) {
      return res.status(400).json({ success: false, message: 'Invalid plan or billing cycle' });
    }

    // Find existing subscription
    let subscription = await Subscription.findOne({ businessId });

    if (subscription) {
      // Update existing subscription
      subscription.plan = plan;
      subscription.billingCycle = billingCycle;
      subscription.price = planDetails.price;
      subscription.status = 'active';
      subscription.features = {
        maxReviews: planDetails.maxReviews,
        maxUsers: planDetails.maxUsers,
        analyticsAccess: planDetails.analyticsAccess,
        apiAccess: planDetails.apiAccess,
        prioritySupport: planDetails.prioritySupport
      };
      subscription.currentPeriodStart = Date.now();
      subscription.currentPeriodEnd = new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000);
      
      await subscription.save();
    } else {
      // Create new subscription
      subscription = await Subscription.create({
        businessId,
        plan,
        billingCycle,
        price: planDetails.price,
        status: 'active',
        features: {
          maxReviews: planDetails.maxReviews,
          maxUsers: planDetails.maxUsers,
          analyticsAccess: planDetails.analyticsAccess,
          apiAccess: planDetails.apiAccess,
          prioritySupport: planDetails.prioritySupport
        }
      });

      // Update business with subscription
      business.subscriptionId = subscription._id;
      await business.save();
    }

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private (Business owner)
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    // Check authorization
    const business = await Business.findById(subscription.businessId);
    if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    subscription.status = 'canceled';
    await subscription.save();

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
