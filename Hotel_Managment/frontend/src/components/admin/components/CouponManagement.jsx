import React, { useState } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import { FaEdit, FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";

const CouponManagement = ({
  coupons,
  inactiveCoupons,
  fetchCoupons,
  loading,
  setLoading,
  setError,
  baseURL,
}) => {
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [editCouponId, setEditCouponId] = useState(null);
  const [couponTab, setCouponTab] = useState("active");

  const headers = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { code, discount, startDate, endDate } = couponForm;
    const payload = {
      code: code.trim().toUpperCase(),
      discount: parseFloat(discount),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };

    if (!payload.code || !payload.discount || !startDate || !endDate) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (payload.discount < 0 || payload.discount > 100) {
      setError("Discount must be between 0 and 100.");
      setLoading(false);
      return;
    }

    if (new Date(payload.endDate) <= new Date(payload.startDate)) {
      setError("End date must be after start date.");
      setLoading(false);
      return;
    }

    try {
      const url = `${baseURL}/api/coupons${
        editCouponId ? `/${editCouponId}` : ""
      }`;
      const method = editCouponId ? axios.put : axios.post;
      await method(url, payload, headers);
      setCouponForm({ code: "", discount: "", startDate: "", endDate: "" });
      setEditCouponId(null);
      setCouponTab("active");
      await fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save coupon.");
    } finally {
      setLoading(false);
    }
  };

  const handleCouponEdit = (coupon) => {
    setCouponForm({
      code: coupon.code,
      discount: coupon.discount.toString(),
      startDate: new Date(coupon.startDate).toISOString().slice(0, 16),
      endDate: new Date(coupon.endDate).toISOString().slice(0, 16),
    });
    setEditCouponId(coupon._id);
    setCouponTab("active");
  };

  const handleAction = async (url, successTab) => {
    setLoading(true);
    setError("");
    try {
      await axios.patch(url, {}, headers);
      await fetchCoupons();
      setCouponTab(successTab);
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const currentCoupons = couponTab === "active" ? coupons : inactiveCoupons;

  return (
    <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">🎟️ Manage Coupons</h2>

      <form
        onSubmit={handleCouponSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
      >
        <FormInput
          label="Coupon Code"
          id="coupon-code"
          value={couponForm.code}
          onChange={(e) =>
            setCouponForm({ ...couponForm, code: e.target.value })
          }
          required
        />
        <FormInput
          label="Discount (%)"
          id="coupon-discount"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={couponForm.discount}
          onChange={(e) =>
            setCouponForm({ ...couponForm, discount: e.target.value })
          }
          required
        />
        <FormInput
          label="Start Date"
          id="coupon-start"
          type="datetime-local"
          value={couponForm.startDate}
          onChange={(e) =>
            setCouponForm({ ...couponForm, startDate: e.target.value })
          }
          required
        />
        <FormInput
          label="End Date"
          id="coupon-end"
          type="datetime-local"
          value={couponForm.endDate}
          onChange={(e) =>
            setCouponForm({ ...couponForm, endDate: e.target.value })
          }
          required
        />
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {loading
              ? "Saving..."
              : editCouponId
              ? "Update Coupon"
              : "Add Coupon"}
          </button>
        </div>
      </form>

      <div className="flex justify-center gap-4 mb-6">
        {["active", "inactive"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCouponTab(tab)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              couponTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {tab === "active" ? "Active Coupons" : "Inactive Coupons"}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        {currentCoupons.map((coupon) => (
          <li
            key={coupon._id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
          >
            <div>
              <div className="font-semibold">{coupon.code}</div>
              <div className="text-sm text-gray-700">
                {coupon.discount}% off |{" "}
                {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                {new Date(coupon.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-4">
              {couponTab === "active" ? (
                <>
                  <button onClick={() => handleCouponEdit(coupon)} title="Edit">
                    <FaEdit
                      className="text-yellow-500 hover:text-yellow-600"
                      size={20}
                    />
                  </button>
                  <button
                    onClick={() =>
                      handleAction(
                        `${baseURL}/api/coupons/${coupon._id}`,
                        couponTab
                      )
                    }
                    title="Delete"
                  >
                    <FaTrash
                      className="text-red-500 hover:text-red-600"
                      size={20}
                    />
                  </button>
                  <button
                    onClick={() =>
                      handleAction(
                        `${baseURL}/api/coupons/${coupon._id}/deactivate`,
                        "inactive"
                      )
                    }
                    title="Deactivate"
                  >
                    <FaBan
                      className="text-gray-500 hover:text-gray-600"
                      size={20}
                    />
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    handleAction(
                      `${baseURL}/api/coupons/${coupon._id}/activate`,
                      "active"
                    )
                  }
                  title="Activate"
                >
                  <FaCheckCircle
                    className="text-green-500 hover:text-green-600"
                    size={20}
                  />
                </button>
              )}
            </div>
          </li>
        ))}
        {currentCoupons.length === 0 && (
          <li className="text-center text-gray-400 py-6">
            No {couponTab} coupons found.
          </li>
        )}
      </ul>
    </div>
  );
};

export default CouponManagement;
