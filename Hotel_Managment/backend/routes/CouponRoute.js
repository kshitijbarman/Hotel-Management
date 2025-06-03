const express = require("express");
const router = express.Router();
const couponController = require("../controller/couponController");

router.get("/", couponController.getCoupons);
router.get("/available", couponController.getAvailableCoupons);
router.post("/", couponController.addCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);
router.patch("/:id/deactivate", couponController.softDeleteCoupon);
router.patch("/:id/activate", couponController.activateCoupon);

module.exports = router;