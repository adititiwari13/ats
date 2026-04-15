import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Briefcase, ArrowRight, Eye, EyeOff, Shield, UserCheck } from 'lucide-react';

const Register = () => {
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 password: '',
 role: 'CANDIDATE',
 phone: '',
 });
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const { register } = useAuth();
 const navigate = useNavigate();

 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 await register(formData);
 navigate('/dashboard');
 } catch (err) {
 const errData = err.response?.data;
 if (typeof errData === 'object' && errData.message) {
 setError(errData.message);
 } else if (typeof errData === 'object') {
 setError(Object.values(errData).join(', '));
 } else {
 setError('Registration failed');
 }
 } finally {
 setLoading(false);
 }
 };

 const roles = [
 { value: 'CANDIDATE', label: 'Candidate', icon: <User size={16} />, desc: 'Looking for jobs' },
 { value: 'RECRUITER', label: 'Recruiter', icon: <UserCheck size={16} />, desc: 'Posting jobs' },
 { value: 'ADMIN', label: 'Admin', icon: <Shield size={16} />, desc: 'System admin' },
 ];

 return (
 <div className="min-h-screen premium-bg flex items-center justify-center px-4 py-8">
 <div className="w-full max-w-md">
 {/* Logo */}
 <div className="text-center mb-8 fade-in">
 <div className="inline-flex items-center justify-center w-16 h-16 bg-app-primary rounded-2xl shadow-2xl mb-4">
 <Briefcase size={28} className="text-app-text" />
 </div>
 <h1 className="text-3xl font-bold text-app-text">Create Account</h1>
 <p className="text-app-subtext mt-2">Join ATS Pro today</p>
 </div>

 {/* Form Card */}
 <div className="premium-card rounded-2xl p-8 shadow-2xl slide-up">
 {error && (
 <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5">
 {/* Role Selection */}
 <div>
 <label className="block text-sm font-medium text-app-text mb-3">I am a</label>
 <div className="grid grid-cols-3 gap-2">
 {roles.map((r) => (
 <button
 key={r.value}
 type="button"
 onClick={() => setFormData({ ...formData, role: r.value })}
 className={`p-3 rounded-xl border text-center transition-all duration-200 ${
 formData.role === r.value
 ? 'bg-app-primary/20 border-app-primary text-app-primary'
 : 'premium-glass border-app-border text-app-subtext hover:border-white/20'
 }`}
 >
 <div className="flex justify-center mb-1">{r.icon}</div>
 <p className="text-xs font-medium">{r.label}</p>
 </button>
 ))}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-app-text mb-2">Full Name</label>
 <div className="relative">
 <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-subtext" />
 <input
 id="register-name"
 type="text"
 name="name"
 value={formData.name}
 onChange={handleChange}
 className="w-full pl-12 pr-4 py-3 premium-glass border border-app-border rounded-xl text-app-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-app-primary transition-all"
 placeholder="John Doe"
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-app-text mb-2">Email Address</label>
 <div className="relative">
 <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-subtext" />
 <input
 id="register-email"
 type="email"
 name="email"
 value={formData.email}
 onChange={handleChange}
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
 id="register-password"
 type={showPassword ? 'text' : 'password'}
 name="password"
 value={formData.password}
 onChange={handleChange}
 className="w-full pl-12 pr-12 py-3 premium-glass border border-app-border rounded-xl text-app-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-app-primary transition-all"
 placeholder="Min. 6 characters"
 minLength={6}
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

 <div>
 <label className="block text-sm font-medium text-app-text mb-2">Phone (Optional)</label>
 <div className="relative">
 <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-subtext" />
 <input
 id="register-phone"
 type="tel"
 name="phone"
 value={formData.phone}
 onChange={handleChange}
 className="w-full pl-12 pr-4 py-3 premium-glass border border-app-border rounded-xl text-app-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-app-primary transition-all"
 placeholder="+1 (555) 123-4567"
 />
 </div>
 </div>

 <button
 id="register-submit"
 type="submit"
 disabled={loading}
 className="w-full py-3 premium-button font-semibold rounded-xl  transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
 >
 {loading ? (
 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
 ) : (
 <>
 Create Account
 <ArrowRight size={18} />
 </>
 )}
 </button>
 </form>

 <p className="mt-6 text-center text-sm text-app-subtext">
 Already have an account?{' '}
 <Link to="/login" className="text-app-primary hover:text-purple-300 font-medium transition-colors">
 Sign in
 </Link>
 </p>
 </div>
 </div>
 </div>
 );
};

export default Register;
