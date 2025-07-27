import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface AuthForm {
  email: string;
  password: string;
  username?: string;
}

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthForm>({
    email: '',
    password: '',
    username: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isLogin) {
        // Login logic
        if (formData.email === 'demo@example.com' && formData.password === 'password') {
          // Store JWT token (in real app, this would come from API)
          localStorage.setItem('token', 'demo-jwt-token');
          localStorage.setItem('user', JSON.stringify({
            id: '1',
            username: 'DemoUser',
            email: formData.email
          }));
          
          toast.success('Welcome back, space explorer! 🚀');
          setTimeout(() => router.push('/game'), 1000);
        } else {
          toast.error('Invalid credentials. Try demo@example.com / password');
        }
      } else {
        // Register logic
        if (formData.username && formData.email && formData.password) {
          // Store user data (in real app, this would be sent to API)
          localStorage.setItem('token', 'demo-jwt-token');
          localStorage.setItem('user', JSON.stringify({
            id: '2',
            username: formData.username,
            email: formData.email
          }));
          
          toast.success('Account created successfully! Welcome to the cosmos! 🌟');
          setTimeout(() => router.push('/game'), 1000);
        } else {
          toast.error('Please fill in all fields');
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem('token', 'demo-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'demo',
        username: 'DemoPlayer',
        email: 'demo@shootingstar.com'
      }));
      
      toast.success('Welcome to Shooting the Star! 🚀');
      setTimeout(() => router.push('/game'), 1000);
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Register'} - Shooting the Star</title>
        <meta name="description" content="Join the cosmic adventure in Shooting the Star" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen starfield relative">
        <Toaster position="top-right" />
        
        {/* Background stars */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card max-w-md w-full"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                className="text-4xl font-bold text-gradient mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isLogin ? '🔐 Login' : '🌟 Register'}
              </motion.h1>
              <p className="text-space-300">
                {isLogin 
                  ? 'Welcome back to the cosmos!' 
                  : 'Join the cosmic adventure!'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-space-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-space-700 border border-space-600 rounded-lg text-white placeholder-space-400 focus:outline-none focus:border-space-400 transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-space-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-space-700 border border-space-600 rounded-lg text-white placeholder-space-400 focus:outline-none focus:border-space-400 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-space-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-space-700 border border-space-600 rounded-lg text-white placeholder-space-400 focus:outline-none focus:border-space-400 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="w-full btn-primary py-4"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? '🚀 Login' : '🌟 Create Account'
                )}
              </motion.button>
            </form>

            {/* Demo login */}
            <div className="mt-6">
              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full btn-secondary py-3"
              >
                🎮 Try Demo Mode
              </button>
            </div>

            {/* Toggle form */}
            <div className="mt-6 text-center">
              <p className="text-space-300">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: '', password: '', username: '' });
                  }}
                  className="text-space-400 hover:text-white transition-colors font-medium"
                >
                  {isLogin ? 'Register here' : 'Login here'}
                </button>
              </p>
            </div>

            {/* Back to home */}
            <div className="mt-6 text-center">
              <Link href="/">
                <button className="text-space-400 hover:text-white transition-colors">
                  ← Back to Home
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-star-gold rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
} 