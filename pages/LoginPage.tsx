import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for email in URL query params to pre-fill the form
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [location.search]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or user not found. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-light dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary">Nampdtech Portal</h1>
                <p className="text-dark/70 dark:text-gray-400 mt-2">National Association of Mobile Phone Technicians</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-dark dark:text-gray-100 mb-6">Member Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-secondary focus:border-secondary transition"
                            placeholder="e.g., member@test.com"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ease-in-out flex items-center justify-center"
                    >
                        {loading ? <Spinner size="sm" /> : 'Sign In'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Not a member?{' '}
                        <Link to="/register" className="font-medium text-primary hover:text-secondary">
                            Register here
                        </Link>
                    </p>
                </div>
                 <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <Link to="/" className="font-medium text-primary hover:text-secondary">
                            &larr; Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;