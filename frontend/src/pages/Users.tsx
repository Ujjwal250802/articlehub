import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.status === 'true' ? 'active' : 'inactive').includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/appuser/getAllAppuser');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await axios.post('http://localhost:8080/appuser/updateUser', {
          id: editingUser.id,
          ...newUser
        });
        toast.success('User updated successfully');
      } else {
        await axios.post('http://localhost:8080/appuser/addnewAppuser', newUser);
        toast.success('User added successfully');
      }
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '' });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      await axios.post('http://localhost:8080/appuser/updateUserStatus', {
        id,
        status: currentStatus === 'true' ? 'false' : 'true'
      });
      toast.success('Status updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/appuser/deleteUser/${id}`);
      toast.success('User deleted successfully');
      setConfirmDeleteId(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold">Manage User</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add User
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter by name, email or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'true' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-4 flex items-center">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setNewUser({
                          name: user.name,
                          email: user.email,
                          password: ''
                        });
                        setShowAddModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(user.id, user.status)}
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      style={{ backgroundColor: user.status === 'true' ? '#4F46E5' : '#E5E7EB' }}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          user.status === 'true' ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Edit' : 'Add'} User
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Name"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Password"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewUser({ name: '', email: '', password: '' });
                  setEditingUser(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {editingUser ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;