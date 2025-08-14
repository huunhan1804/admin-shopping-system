import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, User, Lock, AlertCircle, Leaf } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    loginId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, error, clearAuthError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearAuthError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.loginId || !formData.password) {
      return;
    }

    try {
      const result = await login(formData);
      if (result.type === 'auth/loginUser/fulfilled') {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Branding header */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-white shadow-md flex items-center justify-center border border-green-100">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            CTU Shopping System · <span className="font-medium text-green-700">Wellness Admin</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-green-50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md -space-y-px">
              {/* Username */}
              <div className="relative">
                <label htmlFor="loginId" className="sr-only">
                  Username
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  required
                  className="appearance-none rounded-t-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={formData.loginId}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-b-xl relative block w-full px-3 py-3 pl-10 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center space-x-2 text-red-700 bg-red-50/90 border border-red-100 p-3 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !formData.loginId || !formData.password}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
              <p className="mt-3 text-center text-xs text-gray-500">
                Bảo mật bởi CTUShop · GMP • Organic • Non-GMO
              </p>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CTUShop Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
