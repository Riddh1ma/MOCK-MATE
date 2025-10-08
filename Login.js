import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, Sun, Moon, Code } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Theme toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          <div className="max-w-md mx-auto">
            {/* Logo and title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
                  <Code className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sign in to your Mock-Mate account
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Hero image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative h-full flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl font-bold mb-6">Mock-Mate</h1>
            <p className="text-xl mb-8 opacity-90">
              Master your technical interviews with AI-powered practice sessions
            </p>
            <div className="grid grid-cols-2 gap-6 text-left">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Coding Challenges</h3>
                <p className="text-sm opacity-80">Practice with real interview questions</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">AI Feedback</h3>
                <p className="text-sm opacity-80">Get instant, personalized feedback</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Peer Practice</h3>
                <p className="text-sm opacity-80">Practice with other students</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Progress Tracking</h3>
                <p className="text-sm opacity-80">Monitor your improvement</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
