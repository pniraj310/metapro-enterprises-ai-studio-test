import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { MetaProLogo } from '../../components/MetaProLogo';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { apiUrl } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, login, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials. Please check your username and password.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      const res = await fetch(apiUrl('/api/users/sync'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.adminToken) {
        loginWithToken(result.user.email || 'Owner', data.adminToken);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Could not verify business owner session.');
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-In could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/" className="inline-block">
            <MetaProLogo
              variant="stacked"
              theme="light"
              size="md"
              showCornerFrame
              className="px-10 py-6"
            />
          </Link>
          <h1 className="text-lg font-semibold text-stone-900 mt-4">
            Business Owner & Admin Login
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Sign in to manage products, categories, and website settings
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter owner email or username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#08142C] hover:bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Login to Admin Panel'}</span>
              <ArrowRight className="w-4 h-4 text-[#EAB01E]" />
            </button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-stone-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg border border-stone-300 hover:border-stone-900 bg-white text-stone-800 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Sign in with Google</span>
          </button>

          <div className="pt-2 text-center border-t border-stone-100">
            <Link
              to="/"
              className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
            >
              ← Return to Public Customer Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
