import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const { login } = useAuth();
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 await login(email, password);
 navigate('/dashboard');
 } catch (err) {
 setError(err.response?.data?.message || err.response?.data?.data || 'Invalid credentials');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen premium-bg flex items-center justify-center px-4">
 <div className="w-full max-w-md">
 {/* Logo */}
 <div className="text-center mb-8 fade-in">
 <div className="inline-flex items-center justify-center w-16 h-16 bg-app-primary rounded-2xl shadow-2xl mb-4">
 <Briefcase size={28} className="text-app-text" />
 </div>
 <h1 className="text-3xl font-bold text-app-text">ATS Pro</h1>
 <p className="text-app-subtext mt-2">Sign in to your account</p>
 </div>

 {/* Form Card */}
 <div className="premium-card rounded-2xl p-8 shadow-2xl slide-up">
 {error && (
 <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-app-text mb-2">Email Address</label>
 <div className="relative">
 <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-subtext" />
 <input
 id="login-email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full pl-12 pr-4 py-3 premium-glass border border-app-border rounded-xl text-app-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-app-primary transition-all"
 placeholder="you@example.com"
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-app-text mb-2">Password</label>
 <div className="relative">
 <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-subtext" />
 <input
 id="login-password"
 type={showPassword ? 'text' : 'password'}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full pl-12 pr-12 py-3 premium-glass border border-app-border rounded-xl text-app-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-app-primary transition-all"
 placeholder="••••••••"
 required
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-app-subtext hover:text-app-text"
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 <button
 id="login-submit"
 type="submit"
 disabled={loading}
 className="w-full py-3 premium-button font-semibold rounded-xl  focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2 focus:ring-offset-[#1e293b] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:"
 >
 {loading ? (
 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
 ) : (
 <>
 Sign In
 <ArrowRight size={18} />
 </>
 )}
 </button>
 </form>

 <p className="mt-6 text-center text-sm text-app-subtext">
 Don't have an account?{' '}
 <Link to="/register" className="text-app-primary hover:text-purple-300 font-medium transition-colors">
 Create one
 </Link>
 </p>
 </div>
 </div>
 </div>
 );
};

export default Login;
