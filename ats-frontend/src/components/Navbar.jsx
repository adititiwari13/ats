import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
 LayoutDashboard,
 Briefcase,
 FileText,
 Upload,
 LogOut,
 Menu,
 X,
 User,
 ChevronDown,
} from 'lucide-react';

const Navbar = () => {
 const { user, logout, isCandidate, isAdmin, isRecruiter } = useAuth();
 const navigate = useNavigate();
 const location = useLocation();
 const [mobileOpen, setMobileOpen] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);

 const handleLogout = () => {
 logout();
 navigate('/login');
 };

 const isActive = (path) => location.pathname === path;

 const navLinks = [
 {
 path: '/dashboard',
 label: 'Dashboard',
 icon: <LayoutDashboard size={18} />,
 show: true,
 },
 {
 path: '/jobs',
 label: 'Jobs',
 icon: <Briefcase size={18} />,
 show: true,
 },
 {
 path: '/applications',
 label: 'Applications',
 icon: <FileText size={18} />,
 show: true,
 },
 {
 path: '/resume',
 label: 'My Resume',
 icon: <Upload size={18} />,
 show: isCandidate(),
 },
 ];

 const getRoleBadgeColor = () => {
 switch (user?.role) {
 case 'ADMIN': return 'bg-red-500/20 text-red-400';
 case 'RECRUITER': return 'bg-blue-500/20 text-blue-400';
 case 'CANDIDATE': return 'bg-green-500/20 text-green-400';
 default: return 'bg-gray-500/20 text-gray-400';
 }
 };

 return (
 <nav className="premium-glass sticky top-0 z-50 border-b border-white/10 shadow-lg">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-16">
 {/* Logo */}
 <Link to="/dashboard" className="flex items-center gap-3 group">
 <div className="w-9 h-9 bg-app-primary rounded-lg flex items-center justify-center shadow-lg group-hover: transition-shadow">
 <Briefcase size={18} className="text-app-text" />
 </div>
 <span className="text-xl font-bold text-app-text hidden sm:block">ATS Pro</span>
 </Link>

 {/* Desktop Nav */}
 <div className="hidden md:flex items-center gap-1">
 {navLinks.filter(l => l.show).map((link) => (
 <Link
 key={link.path}
 to={link.path}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
 isActive(link.path)
 ? 'bg-app-primary/20 text-app-primary shadow-sm'
 : 'text-app-subtext hover:text-app-text hover:premium-glass'
 }`}
 >
 {link.icon}
 {link.label}
 </Link>
 ))}
 </div>

 {/* Profile */}
 <div className="hidden md:flex items-center gap-3">
 <div className="relative">
 <button
 onClick={() => setProfileOpen(!profileOpen)}
 className="flex items-center gap-2 px-3 py-2 rounded-lg hover:premium-glass transition-colors"
 >
 <div className="w-8 h-8 bg-app-primary rounded-full flex items-center justify-center">
 <User size={16} className="text-app-text" />
 </div>
 <div className="text-left">
 <p className="text-sm font-medium text-app-text">{user?.name}</p>
 <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
 {user?.role}
 </span>
 </div>
 <ChevronDown size={14} className="text-app-subtext" />
 </button>

 {profileOpen && (
 <div className="absolute right-0 mt-2 w-48 bg-app-card border border-app-border shadow-xl rounded-xl shadow-2xl py-2 border border-app-border">
 <div className="px-4 py-2 border-b border-app-border">
 <p className="text-xs text-app-subtext">{user?.email}</p>
 </div>
 <button
 onClick={handleLogout}
 className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
 >
 <LogOut size={16} />
 Sign Out
 </button>
 </div>
 )}
 </div>
 </div>

 {/* Mobile menu button */}
 <button
 onClick={() => setMobileOpen(!mobileOpen)}
 className="md:hidden p-2 rounded-lg hover:premium-glass text-app-subtext"
 >
 {mobileOpen ? <X size={24} /> : <Menu size={24} />}
 </button>
 </div>

 {/* Mobile Nav */}
 {mobileOpen && (
 <div className="md:hidden pb-4 fade-in">
 <div className="flex flex-col gap-1">
 {navLinks.filter(l => l.show).map((link) => (
 <Link
 key={link.path}
 to={link.path}
 onClick={() => setMobileOpen(false)}
 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
 isActive(link.path)
 ? 'bg-app-primary/20 text-app-primary'
 : 'text-app-subtext hover:text-app-text hover:premium-glass'
 }`}
 >
 {link.icon}
 {link.label}
 </Link>
 ))}
 <button
 onClick={handleLogout}
 className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10"
 >
 <LogOut size={18} />
 Sign Out
 </button>
 </div>
 </div>
 )}
 </div>
 </nav>
 );
};

export default Navbar;
