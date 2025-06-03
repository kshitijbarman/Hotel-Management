import React from "react";

const CouponsScreen = ({
  couponsLoading,
  couponsError,
  allCoupons,
  availableCoupons,
}) => (
  <section className="space-y-8 bg-white text-black">
    <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Coupons</h2>

    {couponsLoading ? (
      <div className="text-center">Loading...</div>
    ) : couponsError ? (
      <div className="text-center text-red-600">{couponsError}</div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Coupons */}
        <div className="bg-white rounded-md shadow-md p-6 border border-black">
          <h3 className="text-lg font-semibold mb-4">All Coupons</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-black">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black">
                {allCoupons.length > 0 ? (
                  allCoupons.map((coupon) => (
                    <tr
                      key={coupon._id}
                      className="hover:bg-black/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coupon.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coupon.discount}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            coupon.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Coupons */}
        <div className="bg-white rounded-md shadow-md p-6 border border-black">
          <h3 className="text-lg font-semibold mb-4">Available Coupons</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-black">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Discount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black">
                {availableCoupons.length > 0 ? (
                  availableCoupons.map((coupon) => (
                    <tr
                      key={coupon._id}
                      className="hover:bg-black/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coupon.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coupon.discount}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center">
                      No available coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </section>
);

export default CouponsScreen;
