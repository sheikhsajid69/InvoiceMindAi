import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2, FileText, Bot, Sparkles, Zap, Play } from 'lucide-react';
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
             <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Bot size={24} />
             </div>
             <span className="text-xl font-bold tracking-tight text-gray-900">InvoiceMind AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               <span>System Operational</span>
            </div>
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
            {!files.length && !process.env.API_KEY && (
               <div className="text-center text-xs text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                 Note: To analyze your own custom documents, ensure a valid Gemini API key is set in your environment. Otherwise, explore our instant cases below.
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
    </div>
  );
}