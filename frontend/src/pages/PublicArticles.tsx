import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Palette, ArrowLeft, Github } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
import './PublicArticles.css';
import { API_BASE_URL } from '../config/api';

const PublicArticles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [studentBranch, setStudentBranch] = useState('');

  useEffect(() => {
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
    if (!studentInfo) {
      navigate('/student-login');
      return;
    }
    setStudentBranch(studentInfo.branch);
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      if (!token) {
        navigate('/student-login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/article/getAllPublishedArticle`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setArticles(response.data);
      setFilteredArticles(response.data);
    } catch (error) {
      toast.error('Failed to fetch articles');
      if (error.response?.status === 401) {
        navigate('/student-login');
      }
    }
  };

  // Rest of the component remains the same...
  const downloadPDF = (article) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
        <h2 style="text-align: center; margin-bottom: 20px;">${article.title}</h2>
        <p style="text-align: center; font-style: italic;">Category: ${article.categoryName}</p>
        <div style="margin-top: 20px;">
          ${article.content}
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
      img {
        display: block;
        max-width: 100%;
        margin: 20px auto;
      }
      h2 {
        text-align: center;
      }
      .ql-content {
        text-align: justify;
        margin-top: 20px;
      }
    `;
    element.appendChild(style);

    const convertImagesToBase64 = async () => {
      const images = element.querySelectorAll('img');
      for (const img of images) {
        if (img.src.startsWith('http')) {
          try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = function () {
              img.src = reader.result;
            };
            reader.readAsDataURL(blob);
          } catch (error) {
            console.error('Error converting image to base64:', error);
          }
        }
      }
    };

    convertImagesToBase64().then(() => {
      const options = {
        margin: 10,
        filename: `${article.title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 4, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      html2pdf().from(element).set(options).save();
    });
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-100 theme-${theme}`}>
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Article Hub</h1>
            <span className="text-gray-600">({studentBranch} Branch)</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Palette className="w-6 h-6" />
              </button>
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 hidden group-hover:block">
                <div className="flex space-x-2">
                  <button onClick={() => setTheme('blue')} className="w-8 h-8 rounded-full bg-blue-600" />
                  <button onClick={() => setTheme('pink')} className="w-8 h-8 rounded-full bg-pink-500" />
                  <button onClick={() => setTheme('red')} className="w-8 h-8 rounded-full bg-red-500" />
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('studentToken');
                localStorage.removeItem('studentInfo');
                navigate('/student-login');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-2">{article.title}</h2>
              <div className="flex items-center text-sm text-gray-600">
                <span>Category: {article.categoryName}</span>
                <span className="mx-2">•</span>
                <span>Published on {new Date(article.publication_date).toLocaleDateString()}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadPDF(article);
                }}
                className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
              >
                Download as PDF
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                View Article [Published on{' '}
                {new Date(selectedArticle.publication_date).toLocaleDateString()}]
              </h2>
              <button onClick={() => setSelectedArticle(null)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Title:</h3>
                <p>{selectedArticle.title}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Content:</h3>
                <div className="ql-content" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>For any Queries</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="https://www.instagram.com/ujjw_alkaushik/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/ujjwal-kaushik-846022285/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="https://github.com/Ujjwal250802" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
            <Github className="w-6 h-6" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PublicArticles;