import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, applicationAPI, jobAPI } from '../services/api';
import {
 Briefcase,
 Users,
 FileText,
 TrendingUp,
 CheckCircle,
 XCircle,
 Clock,
 Star,
 BarChart3,
} from 'lucide-react';
import {
 BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
 PieChart, Pie, Cell, Legend,
} from 'recharts';

const Dashboard = () => {
 const { user, isCandidate, isAdmin, isRecruiter } = useAuth();
 const [stats, setStats] = useState(null);
 const [myApps, setMyApps] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetchData();
 }, []);

 const fetchData = async () => {
 try {
 if (isAdmin() || isRecruiter()) {
 const res = await dashboardAPI.getStats();
 setStats(res.data.data);
 }
 if (isCandidate()) {
 const res = await applicationAPI.getMyApplications();
 setMyApps(res.data.data || []);
 }
 } catch (err) {
 console.error('Dashboard error:', err);
 } finally {
 setLoading(false);
 }
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <div className="w-12 h-12 border-4 border-app-primary border-t-transparent rounded-full animate-spin"></div>
 </div>
 );
 }

 const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

 // Admin/Recruiter Dashboard
 if (isAdmin() || isRecruiter()) {
 const statusData = [
 { name: 'Pending', value: stats?.pendingApplications || 0, color: '#f59e0b' },
 { name: 'Shortlisted', value: stats?.shortlistedApplications || 0, color: '#0ea5e9' },
 { name: 'Accepted', value: stats?.acceptedApplications || 0, color: '#10b981' },
 { name: 'Rejected', value: stats?.rejectedApplications || 0, color: '#ef4444' },
 ];

 const barData = [
 { name: 'Total Jobs', value: stats?.totalJobs || 0 },
 { name: 'Active Jobs', value: stats?.activeJobs || 0 },
 { name: 'Applications', value: stats?.totalApplications || 0 },
 { name: 'Candidates', value: stats?.totalCandidates || 0 },
 ];

 const statCards = [
 { label: 'Total Jobs', value: stats?.totalJobs, icon: <Briefcase size={24} />, color: ' ' },
 { label: 'Active Jobs', value: stats?.activeJobs, icon: <CheckCircle size={24} />, color: ' ' },
 { label: 'Applications', value: stats?.totalApplications, icon: <FileText size={24} />, color: ' ' },
 { label: 'Candidates', value: stats?.totalCandidates, icon: <Users size={24} />, color: ' ' },
 { label: 'Shortlisted', value: stats?.shortlistedApplications, icon: <Star size={24} />, color: ' ' },
 { label: 'Avg. Score', value: `${stats?.averageResumeScore || 0}%`, icon: <TrendingUp size={24} />, color: ' ' },
 ];

 return (
 <div className="space-y-8">
 {/* Header */}
 <div className="fade-in">
 <h1 className="text-3xl font-bold text-app-text">Dashboard</h1>
 <p className="text-app-subtext mt-1">Welcome back, {user?.name}!</p>
 </div>

 {/* Stats Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {statCards.map((card, i) => (
 <div
 key={card.label}
 className="premium-card rounded-2xl p-6 hover:bg-app-border/40 transition-all duration-300 group slide-up"
 style={{ animationDelay: `${i * 0.1}s` }}
 >
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-app-subtext">{card.label}</p>
 <p className="text-3xl font-bold text-app-text mt-1">{card.value}</p>
 </div>
 <div className={`w-12 h-12 bg-app-primary ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
 {card.icon}
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Charts */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Bar Chart */}
 <div className="premium-card rounded-2xl p-6">
 <h3 className="text-lg font-semibold text-app-text mb-4 flex items-center gap-2">
 <BarChart3 size={20} className="text-app-primary" />
 Overview
 </h3>
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={barData}>
 <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
 <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
 <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
 <Tooltip
 contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
 labelStyle={{ color: '#f1f5f9' }}
 />
 <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
 <defs>
 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#818cf8" />
 <stop offset="100%" stopColor="#6366f1" />
 </linearGradient>
 </defs>
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Pie Chart */}
 <div className="premium-card rounded-2xl p-6">
 <h3 className="text-lg font-semibold text-app-text mb-4 flex items-center gap-2">
 <TrendingUp size={20} className="text-cyan-400" />
 Application Status
 </h3>
 <ResponsiveContainer width="100%" height={300}>
 <PieChart>
 <Pie
 data={statusData}
 cx="50%"
 cy="50%"
 innerRadius={70}
 outerRadius={110}
 paddingAngle={5}
 dataKey="value"
 >
 {statusData.map((entry, index) => (
 <Cell key={index} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip
 contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
 labelStyle={{ color: '#f1f5f9' }}
 />
 <Legend
 wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }}
 />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 );
 }

 // Candidate Dashboard
 const statusCounts = myApps.reduce((acc, app) => {
 acc[app.status] = (acc[app.status] || 0) + 1;
 return acc;
 }, {});

 return (
 <div className="space-y-8">
 <div className="fade-in">
 <h1 className="text-3xl font-bold text-app-text">My Dashboard</h1>
 <p className="text-app-subtext mt-1">Track your job applications</p>
 </div>

 {/* Quick Stats */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 <div className="premium-card rounded-2xl p-6 text-center slide-up">
 <FileText size={28} className="mx-auto text-app-primary mb-2" />
 <p className="text-2xl font-bold text-app-text">{myApps.length}</p>
 <p className="text-sm text-app-subtext">Total Applied</p>
 </div>
 <div className="premium-card rounded-2xl p-6 text-center slide-up" style={{ animationDelay: '0.1s' }}>
 <Clock size={28} className="mx-auto text-amber-400 mb-2" />
 <p className="text-2xl font-bold text-app-text">{statusCounts.PENDING || 0}</p>
 <p className="text-sm text-app-subtext">Pending</p>
 </div>
 <div className="premium-card rounded-2xl p-6 text-center slide-up" style={{ animationDelay: '0.2s' }}>
 <CheckCircle size={28} className="mx-auto text-green-400 mb-2" />
 <p className="text-2xl font-bold text-app-text">{(statusCounts.SHORTLISTED || 0) + (statusCounts.ACCEPTED || 0)}</p>
 <p className="text-sm text-app-subtext">Shortlisted</p>
 </div>
 <div className="premium-card rounded-2xl p-6 text-center slide-up" style={{ animationDelay: '0.3s' }}>
 <XCircle size={28} className="mx-auto text-red-400 mb-2" />
 <p className="text-2xl font-bold text-app-text">{statusCounts.REJECTED || 0}</p>
 <p className="text-sm text-app-subtext">Rejected</p>
 </div>
 </div>

 {/* Recent Applications */}
 <div className="premium-card rounded-2xl p-6">
 <h3 className="text-lg font-semibold text-app-text mb-4">Recent Applications</h3>
 {myApps.length === 0 ? (
 <div className="text-center py-12 text-app-subtext">
 <FileText size={48} className="mx-auto mb-4 opacity-50" />
 <p>No applications yet. Start applying for jobs!</p>
 </div>
 ) : (
 <div className="space-y-3">
 {myApps.slice(0, 5).map((app) => (
 <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-app-border/20 hover:bg-app-border/40 transition-colors">
 <div>
 <p className="font-medium text-app-text">{app.jobTitle}</p>
 <p className="text-sm text-app-subtext">{app.company}</p>
 </div>
 <div className="flex items-center gap-3">
 {app.resumeScore != null && (
 <span className="text-sm text-app-primary font-medium">{app.resumeScore}% match</span>
 )}
 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
 app.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
 app.status === 'SHORTLISTED' ? 'bg-blue-500/20 text-blue-400' :
 app.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
 app.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
 'bg-gray-500/20 text-gray-400'
 }`}>
 {app.status}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
};

export default Dashboard;
