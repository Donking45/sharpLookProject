const Vendor = require('../models/vendorModel');
const Product = require('../models/productModel');
const Offer = require('../models/offerModel');

const getClientHomepage = async (req, res) => {
  try {
    // 1. Static list of service categories (you can also fetch from DB if dynamic)
    const services = [
      { name: 'Makeup', key: 'makeup' },
      { name: 'Nail', key: 'nail' },
      { name: 'Barbering', key: 'barbering' },
      { name: 'Hair', key: 'hair' },
      { name: 'Others', key: 'others' },
    ];

    // 2. Top Verified Vendors (sorted by rating)
    const topVendors = await Vendor.find({ isVerified: true })
      .sort({ rating: -1 })
      .limit(5)
      .select('businessName profileImage rating serviceType');

    // 3. Recommended Products
    const recommendedProducts = await Product.find({ isRecommended: true })
      .limit(10)
      .select('name image price description category');

    // 4. Best Offers (not expired)
    const bestOffers = await Offer.find({ expiresAt: { $gt: Date.now() } })
      .sort({ discount: -1 })
      .limit(5)
      .select('title description discount serviceType expiresAt');

    res.status(200).json({
      message: "Client homepage content loaded",
      data: {
        services,
        topVendors,
        recommendedProducts,
        bestOffers,
      }
    });
  } catch (error) {
    console.error("Homepage Load Error:", error);
    res.status(500).json({ message: "Failed to load homepage", error: error.message });
  }
};

module.exports = { getClientHomepage };
