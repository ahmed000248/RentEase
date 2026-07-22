import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
input_video = os.path.abspath("public/videos/hero-scrub.mp4")

os.makedirs("public/videos", exist_ok=True)
os.makedirs("public/images", exist_ok=True)
os.makedirs("public/frames", exist_ok=True)

print(f"Input Video: {input_video}")

print("1. Extracting Poster image (first frame)...")
cmd_poster = [
    ffmpeg_exe, "-y", "-i", input_video,
    "-ss", "0", "-vframes", "1",
    "public/images/hero-poster.jpg"
]
subprocess.run(cmd_poster, check=True)

print("2. Extracting frame sequence for Canvas / Frame rendering...")
cmd_frames = [
    ffmpeg_exe, "-y", "-i", input_video,
    "-vf", "scale=1280:-2",
    "-q:v", "3",
    "public/frames/frame_%04d.jpg"
]
subprocess.run(cmd_frames, check=True)

print("3. Re-encoding Desktop scrub video (all-keyframes keyint=1)...")
cmd_desktop = [
    ffmpeg_exe, "-y", "-i", input_video,
    "-an", "-vf", "scale=1280:-2",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
    "-x264-params", "keyint=1:min-keyint=1:scenecut=0",
    "-movflags", "+faststart",
    "public/videos/hero-scrub-keyint.mp4"
]
subprocess.run(cmd_desktop, check=True)

# Replace hero-scrub.mp4 with keyint version
if os.path.exists("public/videos/hero-scrub-keyint.mp4"):
    os.replace("public/videos/hero-scrub-keyint.mp4", "public/videos/hero-scrub.mp4")

print("4. Encoding Mobile scrub video...")
cmd_mobile = [
    ffmpeg_exe, "-y", "-i", input_video,
    "-an", "-vf", "scale=720:-2",
    "-c:v", "libx264", "-preset", "medium", "-crf", "22",
    "-x264-params", "keyint=1:min-keyint=1:scenecut=0",
    "-movflags", "+faststart",
    "public/videos/hero-scrub-mobile.mp4"
]
subprocess.run(cmd_mobile, check=True)

frame_files = [f for f in os.listdir("public/frames") if f.startswith("frame_")]
print(f"SUCCESS! Extracted {len(frame_files)} frames into public/frames and encoded keyint=1 scrub videos into public/videos.")
