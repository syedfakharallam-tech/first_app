
export enum View {
  STUDIO = 'STUDIO',
  PYTHON_SCRIPT = 'PYTHON_SCRIPT',
  GALLERY = 'GALLERY'
}

export interface VideoProject {
  id: string;
  prompt: string;
  videoUrl: string | null;
  status: 'idle' | 'generating' | 'completed' | 'error';
  timestamp: number;
}

export interface PythonAsset {
  filename: string;
  content: string;
  language: string;
}
