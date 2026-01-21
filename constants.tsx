
import React from 'react';

export const PYTHON_SCRIPT_CONTENT = `import os
import time
from gtts import gTTS
from moviepy.editor import (
    ImageClip, 
    AudioFileClip, 
    TextClip, 
    CompositeVideoClip, 
    concatenate_videoclips
)

# Configuration
INPUT_IMAGES_DIR = "images"
OUTPUT_DIR = "output"
OUTPUT_FILENAME = "output.mp4"
VIDEO_SIZE = (1080, 1920) # 9:16 vertical
FPS = 24

def create_folders():
    """Ensure required directories exist."""
    for folder in [INPUT_IMAGES_DIR, OUTPUT_DIR]:
        if not os.path.exists(folder):
            os.makedirs(folder)
            print(f"Created directory: {folder}")

def generate_video(script_text):
    print("--- Starting AI Video Generation Process ---")
    
    # 1. Generate Voiceover
    print("Generating AI voice using gTTS...")
    audio_path = os.path.join(OUTPUT_DIR, "voiceover.mp3")
    tts = gTTS(text=script_text, lang='en')
    tts.save(audio_path)
    
    # Load audio to get duration
    audio = AudioFileClip(audio_path)
    duration = audio.duration
    print(f"Audio duration: {duration:.2f} seconds")

    # 2. Prepare Images
    image_files = [f for f in os.listdir(INPUT_IMAGES_DIR) if f.endswith(('.jpg', '.jpeg', '.png'))]
    if not image_files:
        raise Exception(f"No images found in {INPUT_IMAGES_DIR}! Please add img1.jpg, img2.jpg, etc.")
    
    # Sort and take first 3 for simplicity as per requirement
    image_files.sort()
    image_files = image_files[:3]
    
    # Calculate duration per image
    duration_per_image = duration / len(image_files)
    
    clips = []
    for img_name in image_files:
        img_path = os.path.join(INPUT_IMAGES_DIR, img_name)
        # Create clip, resize to vertical, and set duration
        clip = ImageClip(img_path).set_duration(duration_per_image)
        clip = clip.resize(height=VIDEO_SIZE[1]) # Resize height
        # Center crop or pad to width 1080
        if clip.w > VIDEO_SIZE[0]:
            clip = clip.crop(x_center=clip.w/2, width=VIDEO_SIZE[0])
        else:
            clip = clip.margin(left=(VIDEO_SIZE[0]-clip.w)//2, right=(VIDEO_SIZE[0]-clip.w)//2, color=(0,0,0))
        
        clips.append(clip)

    # Combine images into slideshow
    video = concatenate_videoclips(clips, method="compose")
    video = video.set_audio(audio)

    # 3. Add Subtitles
    print("Overlaying subtitles...")
    # Simple logic: split text into 3 parts for the 3 images
    words = script_text.split()
    chunk_size = len(words) // len(image_files)
    
    text_clips = []
    for i in range(len(image_files)):
        start_time = i * duration_per_image
        # Get chunk of words
        end_idx = (i+1)*chunk_size if i < len(image_files)-1 else len(words)
        chunk_text = " ".join(words[i*chunk_size:end_idx])
        
        txt = TextClip(
            chunk_text, 
            fontsize=70, 
            color='white', 
            font='Arial-Bold',
            stroke_color='black',
            stroke_width=2,
            method='caption',
            size=(VIDEO_SIZE[0]*0.8, None)
        ).set_start(start_time).set_duration(duration_per_image).set_position(('center', 1400))
        
        text_clips.append(txt)

    # 4. Final Composite
    final_video = CompositeVideoClip([video] + text_clips)
    
    print(f"Exporting final video to {os.path.join(OUTPUT_DIR, OUTPUT_FILENAME)}...")
    final_video.write_videofile(
        os.path.join(OUTPUT_DIR, OUTPUT_FILENAME), 
        fps=FPS, 
        codec="libx264", 
        audio_codec="aac"
    )
    print("Done! Video successfully created.")

if __name__ == "__main__":
    create_folders()
    user_text = input("Enter the script text for your video: ")
    if not user_text.strip():
        user_text = "This is a sample AI generated video using Python and MoviePy. It converts text to speech and overlays subtitles automatically."
    
    try:
        generate_video(user_text)
    except Exception as e:
        print(f"ERROR: {e}")
        print("\\nTIP: Ensure you have 'ImageMagick' installed for TextClip to work.")
`;

export const REQUIREMENTS_TXT = `moviepy==1.0.3
gTTS==2.5.1
Pillow==10.2.0
numpy==1.26.4
`;

export const INSTRUCTIONS = `
### Local Setup Instructions

1. **Prerequisites**:
   - Install Python 3.8+
   - Install **FFmpeg**:
     - Mac: \`brew install ffmpeg\`
     - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
     - Linux: \`sudo apt install ffmpeg\`
   - Install **ImageMagick** (Required by MoviePy for subtitles):
     - Download from [imagemagick.org](https://imagemagick.org/script/download.php)

2. **Folder Structure**:
   Create a folder named \`ai-video-app\` and put the files inside:
   \`\`\`text
   ai-video-app/
   ├── video_generator.py
   ├── requirements.txt
   ├── images/
   │   ├── img1.jpg
   │   ├── img2.jpg
   │   └── img3.jpg
   └── output/
   \`\`\`

3. **Install Dependencies**:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Run the App**:
   \`\`\`bash
   python video_generator.py
   \`\`\`
`;
