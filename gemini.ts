import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static getAi() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing from process.env.API_KEY");
    }
    return new GoogleGenAI({ apiKey });
  }

  static async generateVideo(prompt: string) {
    const ai = this.getAi();
    
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '9:16'
        }
      });

      // Poll for operation completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("No video URI returned from the operation.");

      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) throw new Error("Failed to download generated video.");
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Gemini Video Gen Error:", error);
      throw error;
    }
  }

  static async checkApiKey() {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      return await window.aistudio.hasSelectedApiKey();
    }
    return !!process.env.API_KEY;
  }

  static async openKeySelector() {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
  }
}