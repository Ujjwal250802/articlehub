import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranch, setNewBranch] = useState('');
  const [editingBranch, setEditingBranch] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    const filtered = branches.filter(branch =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBranches(filtered);
  }, [searchTerm, branches]);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branch/getAllBranch`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBranches(response.data);
      setFilteredBranches(response.data);
    } catch (error) {
      toast.error('Failed to fetch branches');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingBranch) {
        await axios.post(`${API_BASE_URL}/branch/updateBranch`, {
          id: editingBranch._id,
          name: newBranch
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Branch updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/branch/addNewBranch`, {
          name: newBranch
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Branch added successfully');
      }
      setShowAddModal(false);
      setNewBranch('');
      setEditingBranch(null);
      fetchBranches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save branch');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.get(`${API_BASE_URL}/branch/deleteBranch/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Branch deleted successfully');
      fetchBranches();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete branch');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Branch</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Branch
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter branches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBranches.map((branch) => (
            <tr key={branch.id} className="border-b">
              <td className="p-3">{branch.name}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => {
                    setEditingBranch(branch);
                    setNewBranch(branch.name);
                    setShowAddModal(true);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(branch._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingBranch ? 'Edit' : 'Add'} Branch
            </h2>
            <input
              type="text"
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
              placeholder="Branch Name"
              className="w-full p-2 border rounded-lg mb-4"
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewBranch('');
                  setEditingBranch(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingBranch ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branch;