import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import reportService from '../services/reportService';
import ReportTypeSelector from '../components/reports/ReportTypeSelector';
import GlassCard from '../components/ui/GlassCard';
import { AlertCircle, CheckCircle, FileUp, ShieldAlert, X, Scan, Zap } from 'lucide-react';

const ReportFormPage = () => {
  const navigate = useNavigate();

  const [reportType, setReportType] = useState('text');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    textContent: '',
    url: ''
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [scanningStage, setScanningStage] = useState(''); // Scanning..., Analyzing patterns..., Evaluating risk...
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear preview URL on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Reset conditional fields when type changes
  const handleTypeSelect = (type) => {
    setReportType(type);
    setError('');
    setSuccess('');
    // Keep title/desc, reset conditionals
    setFormData((prev) => ({
      ...prev,
      textContent: '',
      url: ''
    }));
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleTextChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');

    if (!selectedFile) return;

    // Check size limit: 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum allowed size is 5MB.');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Only JPEG, JPG, PNG, and WEBP images are allowed.');
      return;
    }

    setFile(selectedFile);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const simulateAIAnalysis = async () => {
    const stages = ['Scanning content...', 'Analyzing threat patterns...', 'Evaluating risk score...', 'Encrypting payload...'];
    for (let stage of stages) {
      setScanningStage(stage);
      await new Promise(r => setTimeout(r, 600)); // wait 600ms per stage
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { title, description, textContent, url } = formData;

    // Validate fields
    if (!title.trim() || !description.trim()) {
      setError('Title and Description are required.');
      return;
    }

    if (reportType === 'text' && !textContent.trim()) {
      setError('Text message content is required for text reports.');
      return;
    }

    if (reportType === 'url') {
      if (!url.trim()) {
        setError('Suspicious URL is required for URL reports.');
        return;
      }
      try {
        new URL(url);
      } catch (err) {
        setError('Please enter a valid URL containing http:// or https://');
        return;
      }
    }

    if ((reportType === 'screenshot' || reportType === 'qr') && !file) {
      setError('Please upload an image file as evidence.');
      return;
    }

    // Prepare Multipart Form Data
    const uploadData = new FormData();
    uploadData.append('title', title);
    uploadData.append('description', description);
    uploadData.append('reportType', reportType);

    if (reportType === 'text') {
      uploadData.append('textContent', textContent);
    } else if (reportType === 'url') {
      uploadData.append('url', url);
    } else if (reportType === 'screenshot' || reportType === 'qr') {
      uploadData.append('evidence', file);
    }

    setSubmitting(true);
    
    // Simulate AI scanning visuals before real API call
    await simulateAIAnalysis();

    try {
      const res = await reportService.createReport(uploadData);
      if (res.success) {
        setSuccess('Threat analyzed & reported successfully! Redirecting...');
        setFormData({ title: '', description: '', textContent: '', url: '' });
        setFile(null);
        setFilePreview(null);
        setTimeout(() => {
          navigate('/my-reports');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please check server connection.');
    } finally {
      setSubmitting(false);
      setScanningStage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow relative w-full">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-cyber-accent/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10">
        {/* Title Header */}
        <div className="mb-8 border-b border-cyber-border pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <ShieldAlert className="h-8 w-8 text-cyber-accent" />
              <span>Analyze Suspicious Content</span>
            </h1>
            <p className="text-cyber-muted text-sm mt-2 max-w-2xl">
              Submit suspicious messages, URLs, or evidence to our AI-powered threat detection engine. We will extract indicators and calculate a risk score.
            </p>
          </div>
        </div>

        {/* Selector Component */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-4 flex items-center">
            <span className="bg-cyber-card border border-cyber-border rounded px-2 py-0.5 mr-2 text-cyber-accent">01</span> 
            Choose Threat Format
          </h2>
          <ReportTypeSelector selectedType={reportType} onSelect={handleTypeSelect} />
        </div>

        {/* Submission Feedback */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-cyber-red/10 border border-cyber-red/30 text-cyber-red px-4 py-3 rounded-xl flex items-start space-x-2 text-sm mb-6 shadow-lg shadow-cyber-red/5 overflow-hidden"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-cyber-green/10 border border-cyber-green/30 text-cyber-green px-4 py-3 rounded-xl flex items-start space-x-2 text-sm mb-6 shadow-lg shadow-cyber-green/5 overflow-hidden"
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submission Form inside GlassCard */}
        <GlassCard hover={false} className="p-6 md:p-10 relative overflow-hidden">
          
          {/* Scanning Animation Overlay */}
          <AnimatePresence>
            {submitting && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-cyber-dark/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl border border-cyber-accent/30"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-accent/10 to-transparent w-full h-[200%] -top-1/2 animate-scan pointer-events-none"></div>
                <Scan className="w-16 h-16 text-cyber-accent animate-pulse mb-6" />
                <h3 className="text-xl font-bold text-white mb-2 tracking-wider">AI THREAT ANALYSIS IN PROGRESS</h3>
                <p className="text-cyber-accent font-mono text-sm tracking-widest uppercase">{scanningStage}</p>
                <div className="w-64 h-1 bg-cyber-card rounded-full mt-6 overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 2.4, ease: "linear" }}
                     className="h-full bg-cyber-accent"
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest border-b border-cyber-border pb-4 mb-8 flex items-center">
             <span className="bg-cyber-card border border-cyber-border rounded px-2 py-0.5 mr-2 text-cyber-accent">02</span> 
             Provide Scam Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-xs font-semibold text-cyber-muted uppercase tracking-wider mb-2">
                  Threat Subject (Title)
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTextChange}
                  disabled={submitting}
                  className="block w-full px-4 py-3 border border-cyber-border rounded-xl bg-cyber-dark/50 text-white placeholder-cyber-muted focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent text-sm transition duration-200"
                  placeholder="e.g., Fake BISP Grant SMS"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-xs font-semibold text-cyber-muted uppercase tracking-wider mb-2">
                  Context & Details
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows="3"
                  value={formData.description}
                  onChange={handleTextChange}
                  disabled={submitting}
                  className="block w-full px-4 py-3 border border-cyber-border rounded-xl bg-cyber-dark/50 text-white placeholder-cyber-muted focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent text-sm transition duration-200 resize-none"
                  placeholder="How did you receive this? What did the attacker request?"
                ></textarea>
                <div className="text-right mt-1 text-xs text-cyber-muted">{formData.description.length}/500 chars</div>
              </div>
            </div>

            {/* Dynamic Evidence Section */}
            <div className="border-t border-cyber-border/50 pt-8 mt-2">
              <h2 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-6 flex items-center">
                <span className="bg-cyber-card border border-cyber-border rounded px-2 py-0.5 mr-2 text-cyber-accent">03</span> 
                Submit Evidence
              </h2>

              {reportType === 'text' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <textarea
                    id="textContent"
                    name="textContent"
                    required
                    rows="5"
                    value={formData.textContent}
                    onChange={handleTextChange}
                    disabled={submitting}
                    className="block w-full px-4 py-4 border border-cyber-border rounded-xl bg-[#090C15] text-cyber-accent placeholder-cyber-border focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent text-sm transition duration-200 font-mono shadow-inner"
                    placeholder="> Paste the raw suspicious SMS, email, or chat message here..."
                  ></textarea>
                </motion.div>
              )}

              {reportType === 'url' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    required
                    value={formData.url}
                    onChange={handleTextChange}
                    disabled={submitting}
                    className="block w-full px-4 py-4 border border-cyber-border rounded-xl bg-[#090C15] text-cyber-accent placeholder-cyber-border focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent text-sm transition duration-200 font-mono shadow-inner"
                    placeholder="> https://suspect-domain.pk/verify"
                  />
                </motion.div>
              )}

              {(reportType === 'screenshot' || reportType === 'qr') && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {!filePreview ? (
                    <div className="flex justify-center px-6 pt-10 pb-12 border-2 border-cyber-border border-dashed rounded-xl bg-cyber-dark/30 hover:bg-cyber-card/50 hover:border-cyber-accent transition-all duration-300 group">
                      <div className="space-y-2 text-center">
                        <FileUp className="mx-auto h-12 w-12 text-cyber-muted group-hover:text-cyber-accent transition-colors" />
                        <div className="flex text-sm text-cyber-text">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-semibold text-cyber-accent hover:text-white transition-colors focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="evidence"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              disabled={submitting}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-cyber-muted">PNG, JPG, WEBP (Max 5MB)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative mt-1 border border-cyber-border rounded-xl bg-cyber-dark/80 p-4 w-full flex flex-col items-center justify-center">
                      <img
                        src={filePreview}
                        alt="Upload Preview"
                        className="rounded-lg max-h-72 object-contain border border-cyber-border shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={submitting}
                        className="absolute top-6 right-6 bg-cyber-dark/80 backdrop-blur-md border border-cyber-red/50 hover:bg-cyber-red text-white p-2 rounded-full hover:scale-110 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="mt-4 text-center text-xs font-mono text-cyber-accent truncate px-2 bg-cyber-dark px-3 py-1 rounded-md border border-cyber-border">
                        {file?.name} • {(file?.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </div>

            {/* Form Actions */}
            <div className="pt-8 border-t border-cyber-border/50 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-cyber-dark hover:bg-cyber-accent hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Zap className="h-4 w-4" />
                <span>Analyze with AI</span>
              </motion.button>
            </div>

          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default ReportFormPage;
