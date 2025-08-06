import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Wand2 } from 'lucide-react';
import AIGenerator from './AIGenerator';

const ArticleEditor = ({ article, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [branchID, setBranchID] = useState('');
  const [status, setStatus] = useState('draft');
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setCategoryID(article.categoryID);
      setBranchID(article.branchID);
      setStatus(article.status);
    }
    fetchCategories();
    fetchBranches();
  }, [article]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/category/getAllCategory');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:8080/branch/getAllBranch');
      setBranches(response.data);
    } catch (error) {
      toast.error('Failed to fetch branches');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!title || !content || !categoryID || !branchID) {
        toast.error('Please fill in all required fields');
        return;
      }

      const data = {
        title,
        content,
        categoryID: parseInt(categoryID),
        branchID: parseInt(branchID),
        status
      };

      if (article) {
        await axios.post('http://localhost:8080/article/updateArticle', {
          ...data,
          id: article.id
        });
        toast.success('Article updated successfully');
      } else {
        await axios.post('http://localhost:8080/article/addNewArticle', data);
        toast.success('Article added successfully');
      }
      onSave();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save article');
    }
  };

  const handleInsertAIText = (text) => {
    setContent(content ? `${content}\n\n${text}` : text);
  };

  // Configure Quill modules
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  // Image upload handler
  async function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);

          const response = await axios.post(
            'http://localhost:8080/article/upload/editor-image',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          const url = response.data.url;
          const quill = document.querySelector('.ql-editor');
          const range = document.getSelection().getRangeAt(0);
          const img = document.createElement('img');
          img.src = url;
          img.style.maxWidth = '100%';
          range.insertNode(img);
        } catch (error) {
          toast.error('Failed to upload image');
        }
      }
    };
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[95%] max-w-6xl h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4">{article ? 'Edit' : 'Add'} Article</h2>
        <div className="flex-1 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={categoryID}
                onChange={(e) => setCategoryID(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <select
                value={branchID}
                onChange={(e) => setBranchID(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <button
                onClick={() => setShowAIGenerator(true)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <Wand2 className="w-4 h-4" />
                Use AI
              </button>
            </div>
            <div className="h-[calc(100vh-400px)]">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-full"
                theme="snow"
                preserveWhitespace={true}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {article ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {showAIGenerator && (
        <AIGenerator
          onClose={() => setShowAIGenerator(false)}
          onInsertText={handleInsertAIText}
        />
      )}
    </div>
  );
};

export default ArticleEditor;