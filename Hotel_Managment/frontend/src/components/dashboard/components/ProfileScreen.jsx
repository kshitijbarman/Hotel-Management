import React from 'react';

const ProfileScreen = ({ profileLoading, profileError, profileUsers }) => (
 
<section className="space-y-6 max-w-5xl mx-auto px-4">
  <h2 className="text-3xl font-bold text-black mb-6 tracking-tight text-center">
    All Users
  </h2>

  {profileLoading ? (
    <div className="text-center text-black text-lg">Loading...</div>
  ) : profileError ? (
    <div className="text-center text-red-600 text-lg">{profileError}</div>
  ) : (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-black/10 text-sm">
        <thead className="bg-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-black uppercase tracking-wide">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-black uppercase tracking-wide">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-black uppercase tracking-wide">
              Role
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-black uppercase tracking-wide">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-black/10">
          {profileUsers.length > 0 ? (
            profileUsers.map(user => (
              <tr
                key={user._id}
                className="hover:bg-black/5 transition-colors duration-200"
              >
                <td className="px-4 py-2 whitespace-nowrap text-black">
                  {user.firstname} {user.lastname}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-black">
                  {user.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-black">
                  {user.role}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-black">
                  {user.isDisabled ? "Disabled" : "Active"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-4 py-3 text-center text-black text-base"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</section>


);

export default ProfileScreen;