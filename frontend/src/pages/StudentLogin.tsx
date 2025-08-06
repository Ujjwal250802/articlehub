import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, BookOpen, User, MessageCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChatWidget } from '../components/ChatWidget';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (token) {
      navigate('/student-login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:8080/student/login', {
          email,
          password,
        });
        localStorage.setItem('studentToken', response.data.token);
        localStorage.setItem('studentInfo', JSON.stringify(response.data.student));
        setStudentName(response.data.student.name || email);
        toast.success('Login successful!');
        navigate('/student-articles');
      } else {
        await axios.post('http://localhost:8080/student/signup', {
          email,
          password,
          branch,
        });
        toast.success('Account created successfully! You can now login.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setBranch('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || (isLogin ? 'Login failed' : 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setBranch('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <User className="h-4 w-4" />
            <span>Admin Login</span>
          </button>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              {isLogin ? (
                <User className="w-10 h-10 text-blue-600" />
              ) : (
                <BookOpen className="w-10 h-10 text-blue-600" />
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? 'Student Login' : 'Student Registration'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="College Email"
              required
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 border rounded-lg"
            />
            {!isLogin && (
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Branch"
                required
                className="w-full p-3 border rounded-lg"
              />
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={toggleMode} className="text-blue-600 hover:underline">
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>

      {/* Add the ChatWidget here */}
      <ChatWidget isAdmin={false} />
    </div>
  );
};

export default StudentLogin;
