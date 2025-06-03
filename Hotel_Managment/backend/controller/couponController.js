const Coupon = require("../model/CouponModel");

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

exports.getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch available coupons" });
  }
};

exports.addCoupon = async (req, res) => {
  try {
    const { code, discount, startDate, endDate } = req.body;

    if (!code || !discount || !startDate || !endDate) {
      return res.status(400).json({ message: "Code, discount, start date, and end date are required" });
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code,
      discount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Failed to add coupon" });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, startDate, endDate } = req.body;

    if (!code || !discount || !startDate || !endDate) {
      return res.status(400).json({ message: "Code, discount, start date, and end date are required" });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const existingCoupon = await Coupon.findOne({ code, _id: { $ne: id } });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    coupon.code = code;
    coupon.discount = discount;
    coupon.startDate = new Date(startDate);
    coupon.endDate = new Date(endDate);

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Failed to update coupon" });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete coupon" });
  }
};

exports.softDeleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    coupon.isActive = false;
    await coupon.save();
    res.json({ message: "Coupon deactivated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to soft-delete coupon" });
  }
};

exports.activateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    coupon.isActive = true;
    await coupon.save();
    res.json({ message: "Coupon activated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to activate coupon" });
  }
};

exports.validateCoupon = async (code, checkInDate) => {
  try {
    if (code === "FIRSTBOOKING50") {
      return { valid: true, discount: 50 };
    }
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }
    // const now = checkInDate ? new Date(checkInDate) : new Date();
    // if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
    //   return { valid: false, message: "Coupon is not valid for the selected dates" };
    // }
    return { valid: true, discount: coupon.discount };
  } catch (err) {
    return { valid: false, message: "Failed to validate coupon" };
  }
};