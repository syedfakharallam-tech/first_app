
import React, { useState } from 'react';
import { View } from './types';
import { StudioView } from './components/StudioView';
import { PythonView } from './components/PythonView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.STUDIO);

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/10 flex flex-col bg-[#050505] transition-all">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <i className="fas fa-clapperboard text-white text-xl"></i>
          </div>
          <span className="font-bold text-xl hidden lg:block tracking-tight">Cine<span className="text-indigo-500">AI</span></span>
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-2">
          <button 
            onClick={() => setActiveView(View.STUDIO)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === View.STUDIO ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <i className="fas fa-wand-magic-sparkles"></i>
            <span className="font-medium hidden lg:block">AI Studio</span>
          </button>
          
          <button 
            onClick={() => setActiveView(View.PYTHON_SCRIPT)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === View.PYTHON_SCRIPT ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <i className="fas fa-code"></i>
            <span className="font-medium hidden lg:block">Local Python MVP</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 hidden lg:block">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Gemini Pro 3 Ready</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#050505]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
             <h1 className="text-lg font-semibold">
               {activeView === View.STUDIO ? 'Creation Studio' : 'Local Code Generator'}
             </h1>
             <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase rounded border border-indigo-500/20 tracking-widest">MVP v1.0</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <i className="far fa-bell"></i>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border border-white/10 cursor-pointer">
              <span className="text-xs font-bold">JD</span>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden">
          {activeView === View.STUDIO && <StudioView />}
          {activeView === View.PYTHON_SCRIPT && <PythonView />}
        </div>

        {/* Floating Bottom Nav for Mobile/Small Screens (Optional implementation detail) */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex gap-8 z-50">
           <button onClick={() => setActiveView(View.STUDIO)} className={activeView === View.STUDIO ? 'text-indigo-400' : 'text-gray-500'}><i className="fas fa-wand-magic-sparkles text-xl"></i></button>
           <button onClick={() => setActiveView(View.PYTHON_SCRIPT)} className={activeView === View.PYTHON_SCRIPT ? 'text-indigo-400' : 'text-gray-500'}><i className="fas fa-code text-xl"></i></button>
        </div>
      </main>
    </div>
  );
};

export default App;
