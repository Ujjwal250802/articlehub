import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      try {
        const response = await axios.post(`${API_BASE_URL}/appuser/signup`, {
          name,
          email,
          password
        });
        toast.success(response.data.message);
        
        // Show modal for admin approval notification
        toast((t) => (
          <div className="p-4">
            <h3 className="font-bold mb-2">Account Created Successfully</h3>
            <p className="mb-4">Your account requires admin approval before you can login.</p>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
              onClick={() => toast.dismiss(t.id)}
            >
              Got it
            </button>
          </div>
        ), { duration: 6000 });
        
        // Reset form and switch to login
        setName('');
        setEmail('');
        setPassword('');
        setIsLogin(true);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Signup failed');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          {isLogin ? (
            <Lock className="w-12 h-12 text-blue-600" />
          ) : (
            <User className="w-12 h-12 text-blue-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Article Hub {isLogin ? 'Login' : 'Signup'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 p-2 border rounded-lg"
                required
              />
            </div>
          )}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 p-2 border rounded-lg"
              required
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <KeyRound className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 p-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline transition-colors"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full text-blue-600 text-center mt-4 hover:underline"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Login;