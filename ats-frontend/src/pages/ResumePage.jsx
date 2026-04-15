import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import {
 Upload,
 FileText,
 CheckCircle,
 AlertCircle,
 X,
 File,
 Sparkles,
} from 'lucide-react';

const ResumePage = () => {
 const [file, setFile] = useState(null);
 const [resume, setResume] = useState(null);
 const [uploading, setUploading] = useState(false);
 const [loading, setLoading] = useState(true);
 const [message, setMessage] = useState({ text: '', type: '' });
 const [dragOver, setDragOver] = useState(false);

 useEffect(() => {
 fetchResume();
 }, []);

 const fetchResume = async () => {
 try {
 const res = await resumeAPI.getMyResume();
 if (res.data.data) {
 setResume(res.data.data);
 }
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleUpload = async () => {
 if (!file) return;
 setUploading(true);
 setMessage({ text: '', type: '' });
 try {
 const res = await resumeAPI.upload(file);
 setResume(res.data.data);
 setFile(null);
 setMessage({ text: 'Resume uploaded and parsed successfully!', type: 'success' });
 } catch (err) {
 setMessage({ text: err.response?.data?.message || 'Upload failed', type: 'error' });
 } finally {
 setUploading(false);
 }
 };

 const handleDrop = (e) => {
 e.preventDefault();
 setDragOver(false);
 const droppedFile = e.dataTransfer.files[0];
 if (droppedFile) setFile(droppedFile);
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <div className="w-12 h-12 border-4 border-app-primary border-t-transparent rounded-full animate-spin"></div>
 </div>
 );
 }

 return (
 <div className="max-w-2xl mx-auto space-y-6">
 {/* Header */}
 <div className="fade-in">
 <h1 className="text-3xl font-bold text-app-text">My Resume</h1>
 <p className="text-app-subtext mt-1">Upload your resume for skill extraction and job matching</p>
 </div>

 {/* Message */}
 {message.text && (
 <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
 message.type === 'success'
 ? 'bg-green-500/10 border border-green-500/20 text-green-400'
 : 'bg-red-500/10 border border-red-500/20 text-red-400'
 }`}>
 {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
 {message.text}
 </div>
 )}

 {/* Upload Area */}
 <div className="premium-card rounded-2xl p-8 slide-up">
 <div
 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
 onDragLeave={() => setDragOver(false)}
 onDrop={handleDrop}
 className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
 dragOver
 ? 'border-app-primary bg-app-primary/10'
 : file
 ? 'border-green-500/30 bg-green-500/5'
 : 'border-app-border hover:border-white/20'
 }`}
 >
 {file ? (
 <div className="space-y-3">
 <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
 <File size={32} className="text-green-400" />
 </div>
 <p className="text-app-text font-medium">{file.name}</p>
 <p className="text-sm text-app-subtext">{(file.size / 1024).toFixed(1)} KB</p>
 <div className="flex items-center justify-center gap-3">
 <button
 onClick={() => setFile(null)}
 className="px-4 py-2 premium-glass text-app-subtext rounded-xl hover:bg-white/10 transition-colors text-sm flex items-center gap-1"
 >
 <X size={16} /> Remove
 </button>
 <button
 onClick={handleUpload}
 disabled={uploading}
 className="px-6 py-2 premium-button rounded-xl  transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50 shadow-lg"
 >
 {uploading ? (
 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
 ) : (
 <>
 <Upload size={16} /> Upload & Parse
 </>
 )}
 </button>
 </div>
 </div>
 ) : (
 <div className="space-y-4">
 <div className="w-16 h-16 bg-app-primary/20 rounded-2xl flex items-center justify-center mx-auto">
 <Upload size={32} className="text-app-primary" />
 </div>
 <div>
 <p className="text-app-text font-medium">Drop your resume here</p>
 <p className="text-sm text-app-subtext mt-1">or click to browse</p>
 </div>
 <input
 id="resume-upload"
 type="file"
 accept=".pdf,.docx,.txt"
 onChange={(e) => setFile(e.target.files[0])}
 className="hidden"
 />
 <button
 onClick={() => document.getElementById('resume-upload').click()}
 className="px-6 py-2.5 premium-glass border border-app-border text-app-text rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
 >
 Browse Files
 </button>
 <p className="text-xs text-app-subtext">Supported: PDF, DOCX, TXT (Max 10MB)</p>
 </div>
 )}
 </div>
 </div>

 {/* Current Resume Info */}
 {resume && (
 <div className="premium-card rounded-2xl p-8 slide-up" style={{ animationDelay: '0.1s' }}>
 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 bg-app-primary rounded-xl flex items-center justify-center">
 <FileText size={20} className="text-app-text" />
 </div>
 <div>
 <h3 className="text-xl font-semibold text-app-text">Current Resume</h3>
 <p className="text-sm text-app-subtext">{resume.fileName}</p>
 </div>
 </div>

 <div className="space-y-4">
 <div className="p-4 bg-app-border/20 rounded-xl">
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm text-app-subtext">File Type</span>
 <span className="text-sm text-app-text font-medium">{resume.fileType}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-app-subtext">Uploaded</span>
 <span className="text-sm text-app-text font-medium">
 {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
 year: 'numeric', month: 'long', day: 'numeric'
 })}
 </span>
 </div>
 </div>

 {resume.extractedSkills && (
 <div>
 <div className="flex items-center gap-2 mb-3">
 <Sparkles size={16} className="text-amber-400" />
 <h4 className="text-sm font-medium text-app-text">Extracted Skills</h4>
 </div>
 <div className="flex flex-wrap gap-2">
 {resume.extractedSkills.split(',').map((skill, idx) => (
 <span
 key={idx}
 className="px-3 py-1.5 bg-app-primary/10 text-app-primary text-sm rounded-lg font-medium"
 >
 {skill.trim()}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
};

export default ResumePage;
