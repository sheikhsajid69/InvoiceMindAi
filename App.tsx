import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2, FileText, Bot, Sparkles, Zap, Play, Settings, Key } from 'lucide-react';
import { analyzeDocuments } from './services/geminiService';
import { AnalysisResult, UploadedFile } from './types';
import { AnalysisView } from './components/AnalysisView';
import { DEMO_SCENARIOS } from './services/demoData';

export default function App() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem("GEMINI_API_KEY") || "" : "";
  });
  const [hasApiKey, setHasApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem("GEMINI_API_KEY") || !!process.env.API_KEY;
    }
    return !!process.env.API_KEY;
  });
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      } as UploadedFile));
      
      setFiles(prev => [...prev, ...newFiles]);
      setError(null);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      } as UploadedFile));
      setFiles(prev => [...prev, ...newFiles]);
      setError(null);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const runAnalysis = async () => {
    if (files.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeDocuments(files.map(f => f.file));
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze documents. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadDemoFiles = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    const newFiles = scenario.files.map(f => {
      const fileObj = new File([`Simulated content for ${f.name}`], f.name, {
        type: f.type === 'pdf' ? 'application/pdf' : f.type === 'image' ? 'image/png' : 'text/plain'
      });
      return {
        id: Math.random().toString(36).substr(2, 9),
        file: fileObj,
        type: f.type,
        preview: f.type === 'image' ? 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80' : ''
      } as UploadedFile;
    });

    setFiles(newFiles);
    setAnalysisResult(null);
    setError(null);
  };

  const loadInstantDemo = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    const newFiles = scenario.files.map(f => {
      const fileObj = new File([`Simulated content for ${f.name}`], f.name, {
        type: f.type === 'pdf' ? 'application/pdf' : f.type === 'image' ? 'image/png' : 'text/plain'
      });
      return {
        id: Math.random().toString(36).substr(2, 9),
        file: fileObj,
        type: f.type,
        preview: f.type === 'image' ? 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80' : ''
      } as UploadedFile;
    });

    setFiles(newFiles);
    setAnalysisResult(scenario.result);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <img src="/logo.png" alt="InvoiceMind AI Logo" className="w-8 h-8 object-contain rounded-lg shadow-sm" />
             <span className="text-xl font-bold tracking-tight text-gray-900">InvoiceMind AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               <span>System Operational</span>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition flex items-center space-x-1.5 text-sm font-medium"
              title="API Key Settings"
            >
              <Settings size={20} className="hover:rotate-45 transition-transform duration-300" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-600">
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {analysisResult ? (
          <AnalysisView 
            data={analysisResult} 
            files={files} 
            onReset={() => {
              setAnalysisResult(null);
              setFiles([]);
            }} 
          />
        ) : (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-2">
               <h1 className="text-3xl font-bold text-gray-900">Turn confusion into cash clarity.</h1>
               <p className="text-gray-500">Upload invoices, chat screenshots, and bank records. InvoiceMind AI will connect the dots.</p>
            </div>

            {/* Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-10 transition-all text-center ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                multiple 
                onChange={handleFileSelect} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Upload className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Drag and drop files here</p>
                  <p className="text-sm text-gray-500 mt-1">or <span className="text-blue-600 font-medium">browse</span> from your computer</p>
                </div>
                <p className="text-xs text-gray-400">Supports PDF, PNG, JPG</p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Uploaded Files ({files.length})</span>
                  <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:text-red-700">Clear All</button>
                </div>
                <ul className="divide-y divide-gray-100">
                  {files.map(file => (
                    <li key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        {file.type === 'image' ? (
                           <img src={file.preview} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                        ) : (
                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                             <FileText size={20} />
                           </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.file.name}</p>
                          <p className="text-xs text-gray-500">{(file.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(file.id)} className="text-gray-400 hover:text-red-500 p-1">
                        <X size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="animate-spin mr-2" /> Analyzing...
                      </>
                    ) : (
                      'Analyze Financial Data'
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm text-center">
                {error}
              </div>
            )}
            
            {/* Demo Hint */}
            {!files.length && !hasApiKey && (
               <div className="text-center text-xs text-yellow-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex flex-col items-center space-y-2">
                 <span>Note: To analyze your own custom documents, you need to set your Gemini API Key. Click the Settings button in the header to configure it.</span>
                 <button 
                   onClick={() => setIsSettingsOpen(true)}
                   className="inline-flex items-center space-x-1 text-blue-600 font-semibold hover:underline"
                 >
                   <Key size={12} />
                   <span>Configure API Key Now</span>
                 </button>
               </div>
            )}

            {/* Interactive Demo Cases Dashboard */}
            {!files.length && (
              <div className="pt-8 border-t border-gray-200 mt-8 space-y-4">
                <div className="flex items-center space-x-2 text-gray-800">
                  <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                  <h2 className="text-lg font-bold tracking-tight">Explore Pre-loaded Scenarios</h2>
                </div>
                <p className="text-sm text-gray-500">
                  Select an interactive case to immediately explore the financial reasoning engine and communication assistant.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {DEMO_SCENARIOS.map((scenario) => {
                    const isHigh = scenario.result.riskProfile.level === 'HIGH';
                    const isMed = scenario.result.riskProfile.level === 'MEDIUM';
                    return (
                      <div key={scenario.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-sm text-gray-900 leading-snug">{scenario.title}</h3>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isHigh ? 'bg-red-50 text-red-700 border border-red-100' :
                              isMed ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                              'bg-green-50 text-green-700 border border-green-100'
                            }`}>
                              {scenario.result.riskProfile.level} Risk
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{scenario.description}</p>
                          <div className="pt-2">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Simulated Documents</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {scenario.files.map((f, fi) => (
                                <span key={fi} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={f.name}>
                                  📄 {f.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                          <button 
                            onClick={() => loadDemoFiles(scenario.id)}
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-[11px] py-1.5 px-2 rounded-lg font-medium transition text-center flex items-center justify-center space-x-1"
                          >
                            <Play size={10} />
                            <span>Load Files</span>
                          </button>
                          <button 
                            onClick={() => loadInstantDemo(scenario.id)}
                            className="bg-blue-600 text-white hover:bg-blue-700 text-[11px] py-1.5 px-2 rounded-lg font-medium transition text-center flex items-center justify-center space-x-1 shadow-sm"
                          >
                            <Zap size={10} />
                            <span>Instant Demo</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="InvoiceMind AI" className="w-8 h-8 object-contain rounded-lg" />
                <span className="text-lg font-bold tracking-tight text-gray-900">InvoiceMind AI</span>
              </div>
              <p className="text-sm text-gray-500 max-w-sm">
                An autonomous financial reasoning assistant that transforms invoices, chat messages, and bank records into clear, actionable financial insights.
              </p>
            </div>
            
            {/* Quick Links Column */}
            <div>
              <h4 className="text-xs font-bold text-gray-450 uppercase tracking-wider">Resources</h4>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a 
                    href="https://github.com/sheikhsajid69/InvoiceMindAi" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-gray-600 hover:text-blue-600 transition"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => setIsTermsOpen(true)} 
                    className="text-sm text-gray-600 hover:text-blue-600 transition text-left"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsPrivacyOpen(true)} 
                    className="text-sm text-gray-600 hover:text-blue-600 transition text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Social Profile Column */}
            <div>
              <h4 className="text-xs font-bold text-gray-450 uppercase tracking-wider">Connect</h4>
              <div className="mt-4 flex space-x-4 text-gray-500">
                <a 
                  href="https://linkedin.com/in/sheikhsajid69" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-600 transition" 
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://github.com/sheikhsajid69" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-900 transition" 
                  title="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://leetcode.com/sheikhsajid69" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-yellow-600 transition" 
                  title="LeetCode"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13.483 0a1.39 1.39 0 0 0-.961.411l-9.62 9.633a1.39 1.39 0 0 0 0 1.964l1.8 1.8a1.39 1.39 0 0 0 1.964 0L15.22 5.257l1.8 1.8a1.39 1.39 0 0 0 1.964 0l1.8-1.8a1.39 1.39 0 0 0 0-1.964L14.444.411A1.39 1.39 0 0 0 13.483 0zm-8.62 12.632l-1.8-1.8a1.39 1.39 0 0 0-1.964 0L.411 11.494a1.39 1.39 0 0 0 0 1.964l9.62 9.632a1.39 1.39 0 0 0 1.964 0l1.8-1.8a1.39 1.39 0 0 0 0-1.964l-9.62-9.632z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/sheikhsajid69" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-900 transition" 
                  title="X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} InvoiceMind AI. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Designed with ❤️ by <a href="https://github.com/sheikhsajid69" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition font-medium">Sheikh Sajid</a></p>
          </div>
        </div>
      </footer>

      {/* API Key Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsSettingsOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200">
              <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-650 sm:mx-0 sm:h-10 sm:w-10">
                    <Key className="h-6 w-6" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                      Gemini API Key Settings
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-505">
                        To analyze your own files, please enter your personal Gemini API key. The key is stored locally in your browser's secure local storage (`localStorage`) and is only used to connect directly to the Google Gemini API.
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <label htmlFor="api-key" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Gemini API Key
                        </label>
                        <a 
                          href="https://aistudio.google.com/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-0.5"
                        >
                          <span>Get API Key from Google AI Studio</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      </div>
                      <input
                        type="password"
                        id="api-key"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      {process.env.API_KEY && (
                        <p className="text-xs text-green-605 flex items-center mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                          A build-time default API key is configured.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
                <button
                  type="button"
                  onClick={() => {
                    if (apiKeyInput.trim()) {
                      localStorage.setItem("GEMINI_API_KEY", apiKeyInput.trim());
                    } else {
                      localStorage.removeItem("GEMINI_API_KEY");
                    }
                    setIsSettingsOpen(false);
                    window.location.reload();
                  }}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("GEMINI_API_KEY");
                    setApiKeyInput("");
                    setIsSettingsOpen(false);
                    window.location.reload();
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-705 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Clear Key
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsTermsOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200">
              <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-3" id="modal-title">
                      Terms & Conditions
                    </h3>
                    <div className="mt-4 text-sm text-gray-600 space-y-4 max-h-96 overflow-y-auto pr-2">
                      <p className="font-semibold text-gray-800">Welcome to InvoiceMind AI!</p>
                      <p>These terms and conditions outline the rules and regulations for the use of InvoiceMind AI's Website and Application, hosted at `imai.sheikhsajid69.qzz.io`.</p>
                      
                      <h4 className="font-bold text-gray-800">1. Acceptance of Terms</h4>
                      <p>By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use InvoiceMind AI if you do not agree to all of the terms and conditions stated on this page.</p>
                      
                      <h4 className="font-bold text-gray-800">2. Description of Service</h4>
                      <p>InvoiceMind AI is an AI-powered financial reasoning assistant designed to cross-reference invoices, bank transactions, and chat correspondence to extract insights. The application is run client-side. The API requests are sent directly to Google's Gemini API endpoints using your provided API key or fallback mechanisms.</p>
                      
                      <h4 className="font-bold text-gray-800">3. API Key & Security</h4>
                      <p>You are responsible for obtaining your own API key for the Google Gemini API to use custom document analysis. Your API key is stored locally in your browser's secure `localStorage` and is never sent to any third-party servers, nor is it stored by us. You retain full responsibility for the usage and billing associated with your API key.</p>
                      
                      <h4 className="font-bold text-gray-800">4. Limitation of Liability</h4>
                      <p>The calculations, assessments, risk scores, and email drafts generated by InvoiceMind AI are for informational purposes only. They do not constitute formal accounting, legal, or financial advice. We shall not be held liable for any financial decisions, errors, or losses resulting from the use of this application.</p>
                      
                      <h4 className="font-bold text-gray-800">5. Open Source License</h4>
                      <p>InvoiceMind AI is licensed under the MIT License. You may modify, distribute, and use the software in accordance with the terms of the MIT License.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(false)}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsPrivacyOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200">
              <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-3" id="modal-title">
                      Privacy Policy
                    </h3>
                    <div className="mt-4 text-sm text-gray-650 space-y-4 max-h-96 overflow-y-auto pr-2">
                      <p>Your privacy is of critical importance to us. This Privacy Policy document describes how your data is handled by InvoiceMind AI.</p>
                      
                      <h4 className="font-bold text-gray-800">1. Client-Side Only Processing</h4>
                      <p>InvoiceMind AI is built as a static client-side web application. All document processing, text parsing, and file conversions occur directly inside your browser. No files, documents, or data you upload are ever transmitted to or stored on our servers.</p>
                      
                      <h4 className="font-bold text-gray-800">2. Google Gemini API Interaction</h4>
                      <p>When you select and analyze financial documents, the data is sent directly from your browser to Google Gemini API endpoints. Google's processing of your data is governed by the Google APIs Terms of Service and their AI developer privacy policies.</p>
                      
                      <h4 className="font-bold text-gray-800">3. API Key Storage</h4>
                      <p>If you enter your own Gemini API key, it is stored in your browser's local storage (`localStorage`). This is local to your device and browser, and is never shared, sent, or uploaded to any other server except Google's secure API endpoints.</p>
                      
                      <h4 className="font-bold text-gray-800">4. Local Data Retention</h4>
                      <p>All analysis results and interactive chat messages are kept in active React state memory and are discarded once you close or reload the browser page, or click "Clear All".</p>
                      
                      <h4 className="font-bold text-gray-800">5. Contact Information</h4>
                      <p>If you have any questions about this Privacy Policy, feel free to contact us via our GitHub repository issues page.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(false)}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}