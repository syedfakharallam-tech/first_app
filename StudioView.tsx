import React, { useState, useEffect } from 'react';
import { GeminiService } from './gemini';
import { VideoProject } from './types';

export const StudioView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [hasKey, setHasKey] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyKey = async () => {
      const ok = await GeminiService.checkApiKey();
      setHasKey(ok);
    };
    verifyKey();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const url = await GeminiService.generateVideo(prompt);
      setCurrentProject({
        id: Date.now().toString(),
        prompt,
        videoUrl: url,
        status: 'completed',
        timestamp: Date.now(),
      });
    } catch (err: any) {
      const msg = err.message || 'Generation failed.';
      setError(msg);
      if (msg.includes("entity was not found")) {
        setHasKey(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full p-6 gap-8 overflow-hidden bg-[#0a0a0a]">
      <div className="w-1/2 flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-magic text-indigo-400"></i>
            Video Generator
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Enter a prompt for Gemini Veo. Optimized for vertical 9:16 content.
          </p>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic drone shot of a misty neon forest..."
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
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                Generate AI Video
              </>
            )}
          </button>
          
          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">{error}</div>}
        </div>
      </div>

      <div className="w-1/2 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        {isGenerating ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-white font-medium">Gemini is Thinking...</h3>
            <p className="text-gray-500 text-sm">Synthesizing frames and audio</p>
          </div>
        ) : currentProject?.videoUrl ? (
          <video src={currentProject.videoUrl} controls autoPlay loop className="max-h-full max-w-full rounded-xl shadow-2xl" />
        ) : (
          <div className="text-center text-gray-600">
            <i className="fas fa-video text-5xl mb-4 opacity-20"></i>
            <p>Preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};