
import React, { useState, useEffect } from 'react';
import { GeminiService } from '../services/gemini';
import { VideoProject } from '../types';

export const StudioView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    const ok = await GeminiService.checkApiKey();
    setHasKey(ok);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const keyOk = await GeminiService.checkApiKey();
    if (!keyOk) {
      await GeminiService.openKeySelector();
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const url = await GeminiService.generateVideo(prompt);
      const newProject: VideoProject = {
        id: Date.now().toString(),
        prompt,
        videoUrl: url,
        status: 'completed',
        timestamp: Date.now(),
      };
      setCurrentProject(newProject);
    } catch (err: any) {
      setError(err.message || 'Failed to generate video. Please try again.');
      if (err.message?.includes("entity was not found")) {
        setHasKey(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full p-6 gap-8 overflow-hidden">
      {/* Left Column: Input */}
      <div className="w-1/2 flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-magic text-indigo-400"></i>
            Video Generator
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Enter a descriptive prompt. Gemini Veo will generate a high-quality vertical video (9:16) optimized for social media.
          </p>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A neon hologram of a futuristic city with flying cars in 9:16 aspect ratio..."
            className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />

          {!hasKey && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-yellow-200 text-sm flex items-center gap-2 mb-3">
                <i className="fas fa-exclamation-triangle"></i>
                API Key required for Veo models.
              </p>
              <button 
                onClick={() => GeminiService.openKeySelector()}
                className="w-full py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Select Paid API Key
              </button>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-center text-xs text-yellow-500/60 mt-2 underline">Billing Docs</a>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isGenerating || !prompt.trim() 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating Cinema Magic...
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                Generate AI Video
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
              {error}
            </div>
          )}
        </div>

        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 overflow-auto">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Tips for Best Results</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-2">
              <i className="fas fa-check text-green-500 mt-1"></i>
              Use vivid adjectives (neon, cinematic, photorealistic).
            </li>
            <li className="flex gap-2">
              <i className="fas fa-check text-green-500 mt-1"></i>
              Specify motion (zooming in, panning right, slow-mo).
            </li>
            <li className="flex gap-2">
              <i className="fas fa-check text-green-500 mt-1"></i>
              Keep aspect ratio in mind (9:16 is for mobile).
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="w-1/2 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
        {!currentProject && !isGenerating ? (
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <i className="fas fa-video text-3xl text-gray-600"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-400 mb-2">No Video Generated</h3>
            <p className="text-gray-600 max-w-xs mx-auto">
              Your cinematic masterpiece will appear here once generation is complete.
            </p>
          </div>
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-film text-indigo-400 text-2xl animate-pulse"></i>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Rendering Assets</h3>
              <p className="text-indigo-400 font-medium animate-pulse">Estimated time: 1-2 minutes</p>
              <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 animate-[loading_10s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-xs text-gray-500">Gemini is synthesizing frames...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-10">
               <a 
                 href={currentProject?.videoUrl || '#'} 
                 download="ai-video.mp4"
                 className="px-4 py-2 bg-white text-black font-bold rounded-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
               >
                 <i className="fas fa-download"></i>
                 Download
               </a>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 bg-[#050505]">
              <video 
                src={currentProject?.videoUrl || ''} 
                controls 
                autoPlay 
                loop
                className="max-h-full max-w-full rounded-xl shadow-2xl border border-white/10 shadow-indigo-500/10"
              />
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10">
               <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Current Script</p>
               <p className="text-sm text-gray-300 italic">"{currentProject?.prompt}"</p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 80%; }
            100% { width: 95%; }
          }
        `}</style>
      </div>
    </div>
  );
};
