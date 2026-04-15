import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobAPI, applicationAPI } from '../services/api';
import {
 Search,
 MapPin,
 Briefcase,
 IndianRupee,
 Clock,
 Plus,
 X,
 Filter,
 Send,
 Building,
 Users,
 ChevronDown,
 Eye,
} from 'lucide-react';

const Jobs = () => {
 const { user, isCandidate, isAdmin, isRecruiter } = useAuth();
 const [jobs, setJobs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [showFilters, setShowFilters] = useState(false);
 const [filters, setFilters] = useState({
 type: 'ALL',
 location: 'ALL',
 experience: 'ALL',
 });
 const [selectedJob, setSelectedJob] = useState(null);
 const [applying, setApplying] = useState(false);
 const [coverLetter, setCoverLetter] = useState('');
 const [message, setMessage] = useState('');

 useEffect(() => {
 fetchJobs();
 }, []);

 const fetchJobs = async () => {
 try {
 const res = await jobAPI.getAll();
 setJobs(res.data.data || []);
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleApply = async (e) => {
 e.preventDefault();
 if (!selectedJob) return;

 setApplying(true);
 try {
 await applicationAPI.apply(selectedJob.id, coverLetter);
 setMessage('Application submitted successfully!');
 setCoverLetter('');
 setTimeout(() => {
 setSelectedJob(null);
 setMessage('');
 }, 2000);
 } catch (err) {
 setMessage(err.response?.data?.message || 'Failed to submit application');
 } finally {
 setApplying(false);
 }
 };

 const filteredJobs = jobs.filter(job => {
 const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
 job.company.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesType = filters.type === 'ALL' || job.jobType === filters.type;
 const matchesLocation = filters.location === 'ALL' || job.location === filters.location;
 const matchesExp = filters.experience === 'ALL' || job.experienceLevel === filters.experience;
 return matchesSearch && matchesType && matchesLocation && matchesExp;
 });

 const locations = ['ALL', ...new Set(jobs.map(j => j.location))];
 const types = ['ALL', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'INTERNSHIP'];
 const experiences = ['ALL', 'ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'];

 const getJobTypeBadge = (type) => {
 const styles = {
 FULL_TIME: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
 PART_TIME: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
 CONTRACT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
 REMOTE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
 INTERNSHIP: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
 };
 return styles[type] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
 };

 const expLabels = {
 ENTRY: 'Entry Level',
 JUNIOR: 'Junior',
 MID: 'Mid Level',
 SENIOR: 'Senior',
 LEAD: 'Lead / Manager',
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
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 fade-in">
 <div>
 <h1 className="text-3xl font-bold text-app-text">Explore Jobs</h1>
 <p className="text-app-subtext mt-1">Find your next career move</p>
 </div>
 </div>

 {/* Search & Filters */}
 <div className="space-y-4 slide-up">
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="relative flex-grow">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
 <input
 type="text"
 placeholder="Search by job title or company..."
 className="w-full pl-12 pr-4 py-3 premium-glass border border-app-border rounded-2xl text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary transition-all"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 <button
 onClick={() => setShowFilters(!showFilters)}
 className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition-all ${
 showFilters ? 'bg-app-primary text-white' : 'premium-glass border border-app-border text-app-text hover:bg-white/10'
 }`}
 >
 <Filter size={20} />
 Filters
 </button>
 </div>

 {showFilters && (
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 premium-glass border border-app-border rounded-2xl fade-in">
 <div>
 <label className="block text-xs font-semibold text-app-subtext uppercase tracking-wider mb-2">Job Type</label>
 <select
 className="w-full p-2.5 bg-[#0f172a] border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary"
 value={filters.type}
 onChange={(e) => setFilters({ ...filters, type: e.target.value })}
 >
 {types.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-xs font-semibold text-app-subtext uppercase tracking-wider mb-2">Location</label>
 <select
 className="w-full p-2.5 bg-[#0f172a] border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary"
 value={filters.location}
 onChange={(e) => setFilters({ ...filters, location: e.target.value })}
 >
 {locations.map(l => <option key={l} value={l}>{l}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-xs font-semibold text-app-subtext uppercase tracking-wider mb-2">Experience</label>
 <select
 className="w-full p-2.5 bg-[#0f172a] border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary"
 value={filters.experience}
 onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
 >
 {experiences.map(e => <option key={e} value={e}>{expLabels[e] || e}</option>)}
 </select>
 </div>
 </div>
 )}
 </div>

 {/* Job Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 {filteredJobs.map((job, i) => (
 <div
 key={job.id}
 className="premium-card rounded-2xl p-6 hover:bg-black/40 transition-all duration-300 group slide-up border border-app-border/50 hover:border-app-primary/30"
 style={{ animationDelay: `${i * 0.05}s` }}
 >
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-app-primary/10 rounded-2xl flex items-center justify-center border border-app-primary/20 group-hover:scale-110 transition-transform">
 <Building className="text-app-primary" size={28} />
 </div>
 <div>
 <h3 className="text-xl font-bold text-app-text group-hover:text-app-primary transition-colors">{job.title}</h3>
 <p className="text-app-subtext font-medium">{job.company}</p>
 </div>
 </div>
 <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getJobTypeBadge(job.jobType)}`}>
 {job.jobType.replace('_', ' ')}
 </span>
 </div>

 <div className="flex flex-wrap gap-4 text-sm text-app-subtext mb-6">
 <span className="flex items-center gap-1">
 <MapPin size={14} /> {job.location}
 </span>
 {job.experienceLevel && (
 <span className="flex items-center gap-1">
 <Briefcase size={14} /> {expLabels[job.experienceLevel] || job.experienceLevel}
 </span>
 )}
 {(job.salaryMin || job.salaryMax) && (
 <span className="flex items-center gap-1">
 <IndianRupee size={14} />
 {job.salaryMin && job.salaryMax
 ? `₹${Number(job.salaryMin).toLocaleString()} - ₹${Number(job.salaryMax).toLocaleString()}`
 : job.salaryMin ? `From ₹${Number(job.salaryMin).toLocaleString()}`
 : `Up to ₹${Number(job.salaryMax).toLocaleString()}`}
 </span>
 )}
 </div>

 {job.requiredSkills && (
 <div className="flex flex-wrap gap-2 mt-3">
 {job.requiredSkills.split(',').slice(0, 5).map((skill, idx) => (
 <span key={idx} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-app-text border border-white/10">
 {skill.trim()}
 </span>
 ))}
 </div>
 )}

 <div className="mt-8 flex items-center justify-between">
 <div className="flex items-center gap-2 text-xs text-app-subtext">
 <Clock size={14} />
 Posted on {new Date(job.createdAt).toLocaleDateString()}
 </div>
 <button
 onClick={() => setSelectedJob(job)}
 className="px-6 py-2.5 bg-app-primary hover:bg-app-hover text-white rounded-xl font-bold transition-all shadow-premium hover:scale-105 active:scale-95"
 >
 View Details
 </button>
 </div>
 </div>
 ))}
 </div>

 {/* Job Details Modal */}
 {selectedJob && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
 <div className="premium-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 z-10 relative border border-app-border ring-1 ring-white/10 slide-up">
 <button
 onClick={() => setSelectedJob(null)}
 className="absolute right-6 top-6 p-2 text-slate-500 hover:text-white transition-colors"
 >
 <X size={24} />
 </button>

 <div className="flex items-center gap-4 mb-6">
 <div className="w-16 h-16 bg-app-primary/20 rounded-2xl flex items-center justify-center border border-app-primary/30">
 <Building className="text-app-primary" size={32} />
 </div>
 <div>
 <h2 className="text-3xl font-bold text-app-text">{selectedJob.title}</h2>
 <p className="text-xl text-app-subtext">{selectedJob.company} • {selectedJob.location}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
 <Briefcase className="mx-auto text-app-primary mb-2" size={20} />
 <p className="text-xs text-app-subtext uppercase">Type</p>
 <p className="font-bold text-app-text">{selectedJob.jobType.replace('_', ' ')}</p>
 </div>
 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
 <Clock className="mx-auto text-app-primary mb-2" size={20} />
 <p className="text-xs text-app-subtext uppercase">Experience</p>
 <p className="font-bold text-app-text">{expLabels[selectedJob.experienceLevel] || selectedJob.experienceLevel}</p>
 </div>
 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
 <IndianRupee className="mx-auto text-app-primary mb-2" size={20} />
 <p className="text-xs text-app-subtext uppercase">Salary</p>
 <p className="font-bold text-app-text text-sm">₹{Number(selectedJob.salaryMax).toLocaleString()}</p>
 </div>
 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
 <Users className="mx-auto text-app-primary mb-2" size={20} />
 <p className="text-xs text-app-subtext uppercase">Openings</p>
 <p className="font-bold text-app-text">{selectedJob.vacancies || 1}</p>
 </div>
 </div>

 <div className="space-y-6">
 <div>
 <h4 className="text-lg font-bold text-app-text mb-2">Job Description</h4>
 <p className="text-app-subtext leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
 </div>

 <div>
 <h4 className="text-lg font-bold text-app-text mb-2">Required Skills</h4>
 <div className="flex flex-wrap gap-2">
 {selectedJob.requiredSkills.split(',').map((skill, index) => (
 <span key={index} className="px-4 py-1.5 bg-app-primary/10 text-app-primary border border-app-primary/20 rounded-xl text-sm font-medium">
 {skill.trim()}
 </span>
 ))}
 </div>
 </div>

 {isCandidate() && (
 <div className="pt-6 mt-6 border-t border-white/10">
 <h4 className="text-lg font-bold text-app-text mb-4">Apply for this position</h4>
 {message && (
 <div className="mb-4 p-4 bg-app-primary/20 border border-app-primary/30 rounded-xl text-app-text text-sm animate-pulse">
 {message}
 </div>
 )}
 <form onSubmit={handleApply} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-app-subtext mb-2">Cover Letter / Why should we hire you?</label>
 <textarea
 rows={4}
 className="w-full p-4 bg-white/5 border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary"
 placeholder="Tell us about your experience..."
 value={coverLetter}
 onChange={(e) => setCoverLetter(e.target.value)}
 required
 ></textarea>
 </div>
 <button
 type="submit"
 disabled={applying}
 className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-premium disabled:opacity-50 flex items-center justify-center gap-2"
 >
 {applying ? (
 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
 ) : (
 <><Send size={18} /> Submit Application</>
 )}
 </button>
 </form>
 </div>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default Jobs;
