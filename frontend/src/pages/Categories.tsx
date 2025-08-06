import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/category/getAllCategory');
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await axios.post('http://localhost:8080/category/updateCategory', {
          id: editingCategory.id,
          name: newCategory
        });
        toast.success('Category updated successfully');
      } else {
        await axios.post('http://localhost:8080/category/addNewCategory', {
          name: newCategory
        });
        toast.success('Category added successfully');
      }
      setShowAddModal(false);
      setNewCategory('');
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.get(`http://localhost:8080/category/deleteCategory/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Category</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter categories..."
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
          {filteredCategories.map((category) => (
            <tr key={category.id} className="border-b">
              <td className="p-3">{category.name}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setNewCategory(category.name);
                    setShowAddModal(true);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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
              {editingCategory ? 'Edit' : 'Add'} Category
            </h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category Name"
              className="w-full p-2 border rounded-lg mb-4"
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory('');
                  setEditingCategory(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingCategory ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;