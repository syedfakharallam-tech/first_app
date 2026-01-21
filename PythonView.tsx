import React, { useState } from 'react';
import { PYTHON_SCRIPT_CONTENT, REQUIREMENTS_TXT, INSTRUCTIONS } from './constants';

export const PythonView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'script' | 'reqs' | 'guide'>('script');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const content = activeTab === 'script' ? PYTHON_SCRIPT_CONTENT : activeTab === 'reqs' ? REQUIREMENTS_TXT : INSTRUCTIONS;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505]">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('script')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${activeTab === 'script' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>video_generator.py</button>
          <button onClick={() => setActiveTab('reqs')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${activeTab === 'reqs' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>requirements.txt</button>
          <button onClick={() => setActiveTab('guide')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${activeTab === 'guide' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>Setup Guide</button>
        </div>
        <button onClick={handleCopy} className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
          <i className={`fas ${copied ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6 mono text-sm">
        {activeTab !== 'guide' ? (
          <pre className="text-gray-300">{activeTab === 'script' ? PYTHON_SCRIPT_CONTENT : REQUIREMENTS_TXT}</pre>
        ) : (
          <div className="prose prose-invert max-w-none text-gray-400" dangerouslySetInnerHTML={{ __html: INSTRUCTIONS.replace(/\n/g, '<br/>') }} />
        )}
      </div>
    </div>
  );
};