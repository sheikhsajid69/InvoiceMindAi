import React, { useState } from 'react';
import { AnalysisResult, UploadedFile } from '../types';
import { FileText, AlertTriangle, CheckCircle, ArrowRight, MessageSquare, Copy, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisViewProps {
  data: AnalysisResult;
  files: UploadedFile[];
  onReset: () => void;
}

const COLORS = ['#10B981', '#EF4444']; // Green for Expected, Red for Overdue

export const AnalysisView: React.FC<AnalysisViewProps> = ({ data, files, onReset }) => {
  const [selectedAction, setSelectedAction] = useState<number | null>(null);

  const chartData = [
    { name: 'Expected', value: data.financialStats.expected },
    { name: 'Overdue', value: data.financialStats.overdue },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column: Source Context */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Source Files</h3>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="group relative border rounded-lg overflow-hidden">
                {file.type === 'image' ? (
                  <img src={file.preview} alt="Evidence" className="w-full h-32 object-cover opacity-90 group-hover:opacity-100 transition" />
                ) : (
                  <div className="h-32 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                    <FileText className="w-8 h-8 mb-2" />
                    <span className="text-xs">{file.file.name}</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {file.file.name.length > 15 ? file.file.name.substring(0, 15) + '...' : file.file.name}
                </div>
              </div>
            ))}
          </div>
          <button onClick={onReset} className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 underline">
            Clear & Upload New
          </button>
        </div>
      </div>

      {/* Middle Column: Reasoning Core */}
      <div className="lg:col-span-5 space-y-6">
        {/* Core Analysis Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
            <h2 className="text-lg font-bold text-gray-800">AI Reasoning</h2>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
            <h3 className="font-semibold text-slate-800 mb-1">
              Invoice {data.invoiceDetails.number}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {data.summary}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Findings</h4>
              <ul className="space-y-2">
                {data.findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Money Impact</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                 <span className="font-mono font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded">
                   {data.financialStats.currency} {data.financialStats.expected.toLocaleString()}
                 </span>
                 <span>expected.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Preview */}
        {selectedAction !== null && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setSelectedAction(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
            <h3 className="font-semibold text-gray-800 mb-1">Draft: {data.recommendedActions[selectedAction].title}</h3>
            <p className="text-xs text-gray-400 mb-4">Review before sending</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed border border-gray-200">
              {data.recommendedActions[selectedAction].draftContent}
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button 
                 onClick={() => navigator.clipboard.writeText(data.recommendedActions[selectedAction].draftContent)}
                 className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-800"
              >
                <Copy size={14} /> <span>Copy</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Open in Email
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Financial Summary & Actions */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Cash Flow Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Cash Flow Summary</h3>
          <div className="flex justify-between items-end mb-6">
             <div>
               <p className="text-xs text-gray-400 uppercase font-semibold">Overdue</p>
               <p className="text-2xl font-bold text-red-500">
                 {data.financialStats.currency}{data.financialStats.overdue.toLocaleString()}
               </p>
             </div>
             <div className="text-right">
               <p className="text-xs text-gray-400 uppercase font-semibold">Expected</p>
               <p className="text-xl font-semibold text-gray-800">
                 {data.financialStats.currency}{data.financialStats.expected.toLocaleString()}
               </p>
             </div>
          </div>
          
          <div className="h-40 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-semibold text-gray-400">Ratio</span>
            </div>
          </div>
        </div>

        {/* Risks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Risk Assessment</h3>
          <div className="mb-4">
             <div className="flex justify-between text-sm mb-1">
               <span className="font-medium text-gray-700">Client Risk Level</span>
               <span className={`font-bold ${
                 data.riskProfile.level === 'HIGH' ? 'text-red-600' : 
                 data.riskProfile.level === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
               }`}>{data.riskProfile.level}</span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-1000 ${
                    data.riskProfile.level === 'HIGH' ? 'bg-red-500' : 
                    data.riskProfile.level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${data.riskProfile.factor}%` }}
                ></div>
             </div>
          </div>
          <div className="flex items-start space-x-2 bg-red-50 p-3 rounded-lg border border-red-100">
             <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
             <p className="text-sm text-red-700 leading-snug">{data.riskProfile.description}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended Actions</h3>
           <div className="space-y-3">
             {data.recommendedActions.map((action, idx) => (
               <button 
                 key={idx}
                 onClick={() => setSelectedAction(idx)}
                 className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center group ${
                    selectedAction === idx ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                 }`}
               >
                 <div className="flex items-center space-x-3">
                   <div className={`p-2 rounded-full ${
                     action.type === 'ESCALATION' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                   }`}>
                     <MessageSquare size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                     <p className="text-xs text-gray-500 capitalize">{action.type.toLowerCase()}</p>
                   </div>
                 </div>
                 <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
               </button>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};
