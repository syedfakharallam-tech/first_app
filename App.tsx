import React, { useState } from 'react';
import { View } from './types';
import { StudioView } from './StudioView';
import { PythonView } from './PythonView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.STUDIO);

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] overflow-hidden">
      <aside className="w-20 lg:w-64 border-r border-white/10 flex flex-col bg-[#050505]">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-clapperboard text-white"></i>
          </div>
          <span className="font-bold text-xl hidden lg:block tracking-tight">Cine<span className="text-indigo-500">AI</span></span>
        </div>
        <nav className="flex-1 mt-8 px-4 space-y-2">
          <button onClick={() => setActiveView(View.STUDIO)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === View.STUDIO ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <i className="fas fa-wand-magic-sparkles"></i>
            <span className="font-medium hidden lg:block">AI Studio</span>
          </button>
          <button onClick={() => setActiveView(View.PYTHON_SCRIPT)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === View.PYTHON_SCRIPT ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <i className="fas fa-code"></i>
            <span className="font-medium hidden lg:block">Python Code</span>
          </button>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#050505]/50">
          <h1 className="text-lg font-semibold">{activeView === View.STUDIO ? 'Creation Studio' : 'Local Code Generator'}</h1>
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AI</div>
        </header>
        <div className="flex-1 overflow-hidden">
          {activeView === View.STUDIO ? <StudioView /> : <PythonView />}
        </div>
      </main>
    </div>
  );
};

export default App;