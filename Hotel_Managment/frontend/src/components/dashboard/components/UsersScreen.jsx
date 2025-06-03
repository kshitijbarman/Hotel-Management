import React from 'react';

const UsersScreen = ({ usersLoading, usersError, users }) => (
    
    <section className="space-y-8">
  <h2 className="text-4xl font-extrabold text-black mb-8 tracking-tight">Users</h2>
  {usersLoading ? (
    <div className="text-center text-black">Loading...</div>
  ) : usersError ? (
    <div className="text-center text-red-600">{usersError}</div>
  ) : (
    <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Role</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {user.firstname} {user.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black">{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-black">
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

export default UsersScreen;