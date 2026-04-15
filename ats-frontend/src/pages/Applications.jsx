import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, resumeAPI } from '../services/api';
import {
 FileText,
 Clock,
 CheckCircle,
 XCircle,
 Star,
 ChevronDown,
 TrendingUp,
 Building,
} from 'lucide-react';

const Applications = () => {
 const { user, isCandidate, isAdmin, isRecruiter } = useAuth();
 const [applications, setApplications] = useState([]);
 const [loading, setLoading] = useState(true);
 const [statusFilter, setStatusFilter] = useState('ALL');
 const [message, setMessage] = useState('');

 useEffect(() => {
 fetchApplications();
 }, []);

 const fetchApplications = async () => {
 try {
 let res;
 if (isCandidate()) {
 res = await applicationAPI.getMyApplications();
 } else {
 res = await applicationAPI.getAll();
 }
 setApplications(res.data.data || []);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleStatusUpdate = async (appId, newStatus) => {
 try {
 await applicationAPI.updateStatus(appId, newStatus);
 setMessage('Status updated successfully');
 fetchApplications();
 setTimeout(() => setMessage(''), 3000);
 } catch (err) {
 setMessage('Failed to update status');
 setTimeout(() => setMessage(''), 3000);
 }
 };

 const handleDownloadResume = async (candidateId, name) => {
 try {
 const response = await resumeAPI.download(candidateId);
 const url = window.URL.createObjectURL(new Blob([response.data]));
 const link = document.createElement('a');
 link.href = url;
 
 const contentDisposition = response.headers['content-disposition'];
 let fileName = `${name}_Resume.pdf`;
 if (contentDisposition) {
 const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
 if (fileNameMatch && fileNameMatch.length === 2)
 fileName = fileNameMatch[1];
 }
 
 link.setAttribute('download', fileName);
 document.body.appendChild(link);
 link.click();
 link.remove();
 } catch (err) {
 setMessage('Failed to download resume');
 setTimeout(() => setMessage(''), 3000);
 }
 };

 const filteredApps = statusFilter === 'ALL'
 ? applications
 : applications.filter(app => app.status === statusFilter);

 const getStatusBadge = (status) => {
 const styles = {
 PENDING: 'bg-amber-500/20 text-amber-400',
 REVIEWED: 'bg-blue-500/20 text-blue-400',
 SHORTLISTED: 'bg-cyan-500/20 text-cyan-400',
 ACCEPTED: 'bg-green-500/20 text-green-400',
 REJECTED: 'bg-red-500/20 text-red-400',
 };
 return styles[status] || 'bg-gray-500/20 text-gray-400';
 };

 const getStatusIcon = (status) => {
 switch (status) {
 case 'PENDING': return <Clock size={14} />;
 case 'REVIEWED': return <FileText size={14} />;
 case 'SHORTLISTED': return <Star size={14} />;
 case 'ACCEPTED': return <CheckCircle size={14} />;
 case 'REJECTED': return <XCircle size={14} />;
 default: return <FileText size={14} />;
 }
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <div className="w-12 h-12 border-4 border-app-primary border-t-transparent rounded-full animate-spin"></div>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="fade-in">
 <h1 className="text-3xl font-bold text-app-text">Applications</h1>
 <p className="text-app-subtext mt-1">
 {isCandidate() ? 'Track your job applications' : 'Manage candidate applications'}
 </p>
 </div>

 {message && (
 <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
 {message}
 </div>
 )}

 {/* Filters */}
 <div className="flex flex-wrap gap-2">
 {['ALL', 'PENDING', 'REVIEWED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((status) => (
 <button
 key={status}
 onClick={() => setStatusFilter(status)}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
 statusFilter === status
 ? 'bg-app-primary/20 text-app-primary border border-app-primary/30'
 : 'premium-glass text-app-subtext border border-app-border hover:bg-white/10'
 }`}
 >
 {status === 'ALL' ? `All (${applications.length})` : `${status} (${applications.filter(a => a.status === status).length})`}
 </button>
 ))}
 </div>

 {/* Applications List */}
 {filteredApps.length === 0 ? (
 <div className="premium-card rounded-2xl p-12 text-center">
 <FileText size={48} className="mx-auto mb-4 text-slate-600" />
 <p className="text-xl text-app-subtext">No applications found</p>
 <p className="text-sm text-app-subtext mt-1">
 {isCandidate() ? 'Start applying for jobs to see them here' : 'No applications match the current filter'}
 </p>
 </div>
 ) : (
 <div className="space-y-3">
 {filteredApps.map((app, i) => (
 <div
 key={app.id}
 className="premium-card rounded-2xl p-6 hover:bg-app-border/40 transition-all duration-300 slide-up"
 style={{ animationDelay: `${i * 0.05}s` }}
 >
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-app-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Building size={22} className="text-app-primary" />
 </div>
 <div>
 <h3 className="text-lg font-semibold text-app-text">{app.jobTitle}</h3>
 <p className="text-sm text-app-subtext">{app.company}</p>
 {(isAdmin() || isRecruiter()) && (
 <div className="mt-1">
 <p className="text-sm text-app-subtext">
 Applicant: <span className="text-app-text">{app.candidateName}</span>
 <span className="text-slate-600 ml-2">{app.candidateEmail}</span>
 </p>
 </div>
 )}
 <div className="flex items-center gap-4 mt-2 text-xs text-app-subtext">
 <span className="flex items-center gap-1">
 <Clock size={12} />
 {new Date(app.appliedAt).toLocaleDateString('en-US', {
 year: 'numeric', month: 'short', day: 'numeric'
 })}
 </span>
 {app.resumeScore != null && (
 <span className="flex items-center gap-1 text-app-primary">
 <TrendingUp size={12} />
 {app.resumeScore}% skill match
 </span>
 )}
 {app.hasResume && (
 (isAdmin() || isRecruiter()) ? (
 <button 
 onClick={() => handleDownloadResume(app.candidateId, app.candidateName)}
 className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-2 py-0.5 rounded cursor-pointer"
 >
 <FileText size={12} /> Download Resume
 </button>
 ) : (
 <span className="flex items-center gap-1 text-green-400">
 <FileText size={12} /> Resume uploaded
 </span>
 )
 )}
 </div>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
 {getStatusIcon(app.status)}
 {app.status}
 </span>

 {(isAdmin() || isRecruiter()) && (
 <div className="relative group">
 <select
 value={app.status}
 onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
 className="px-3 py-1.5 premium-glass border border-app-border rounded-xl text-sm text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary [&>option]:bg-[#1e293b] cursor-pointer"
 >
 <option value="PENDING">Pending</option>
 <option value="REVIEWED">Reviewed</option>
 <option value="SHORTLISTED">Shortlisted</option>
 <option value="ACCEPTED">Accepted</option>
 <option value="REJECTED">Rejected</option>
 </select>
 </div>
 )}
 </div>
 </div>
 
 {/* NEW: Skill Match Details for Recruiters */}
 {(isAdmin() || isRecruiter()) && (app.matchedSkills?.length > 0 || app.missingSkills?.length > 0) && (
    <div className="mt-4 pt-4 border-t border-app-border/50">
      <div className="flex flex-wrap gap-4">
        {app.matchedSkills?.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-green-400/70 font-bold mb-1.5">Matched Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {app.matchedSkills.map(skill => (
                <span key={skill} className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded-md text-[11px] border border-green-500/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {app.missingSkills?.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-red-400/70 font-bold mb-1.5">Missing Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {app.missingSkills.map(skill => (
                <span key={skill} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-md text-[11px] border border-red-500/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )}
 </div>
 ))}
 </div>
 )}
 </div>
 );
};

export default Applications;
