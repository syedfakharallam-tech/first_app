
import React, { useState } from 'react';
import { PYTHON_SCRIPT_CONTENT, REQUIREMENTS_TXT, INSTRUCTIONS } from '../constants';

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'script' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            video_generator.py
          </button>
          <button 
            onClick={() => setActiveTab('reqs')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'reqs' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            requirements.txt
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'guide' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Setup Guide
          </button>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
        >
          <i className={`fas ${copied ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-[#050505] p-6 mono text-sm leading-relaxed">
        {activeTab === 'script' && (
          <pre className="text-gray-300">
            {PYTHON_SCRIPT_CONTENT}
          </pre>
        )}
        {activeTab === 'reqs' && (
          <pre className="text-gray-300">
            {REQUIREMENTS_TXT}
          </pre>
        )}
        {activeTab === 'guide' && (
          <div className="prose prose-invert max-w-none text-gray-400">
             <div dangerouslySetInnerHTML={{ __html: INSTRUCTIONS.replace(/\n/g, '<br/>').replace(/### (.*)/g, '<h3 class="text-xl font-bold text-white mt-4 mb-2">$1</h3>').replace(/(\d\.)/g, '<span class="text-indigo-400 font-bold">$1</span>').replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 rounded">$1</code>') }} />
          </div>
        )}
      </div>
    </div>
  );
};
