import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UsersList = () => {
    return (
        <div className="admin-users-table">
            {/* 
                DESCRIPTION: 
                Table showing:
                - Name, Email, Role.
                - Current Balance.
                - Account Status (Active/Blocked).
                - Action Buttons: 'Block' or 'Unblock' (calls /admin-api/users/:id/block).  
   */}
                 <div className="p-6"> 
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Balance</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border p-3">{user.name}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">{user.role}</td>

                <td className="border p-3">
                  ₹{user.balance || 0}
                </td>

                <td className="border p-3">
                  {user.isBlocked ? (
                    <span className="text-red-500 font-semibold">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Active
                    </span>
                  )}
                </td>

                <td className="border p-3">
                  <button
                    onClick={() => toggleBlockUser(user._id)}
                    className={`px-4 py-2 rounded text-white ${
                      user.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
         
           
        </div>
    );
};

export default UsersList;
