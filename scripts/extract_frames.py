import cv2
import os

video_path = "hf_20260722_100258_a571b6bd-94d4-4cf8-bf27-4c0004da3a33.mp4"
output_dir = "public/frames"
os.makedirs(output_dir, exist_ok=True)
os.makedirs("public/images", exist_ok=True)

cap = cv2.VideoCapture(video_path)

frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret or frame is None:
        break
    
    # Resize to 1280w if larger
    h, w = frame.shape[:2]
    if w > 1280:
        new_h = int(h * (1280 / w))
        frame = cv2.resize(frame, (1280, new_h), interpolation=cv2.INTER_AREA)
        
    frame_filename = os.path.join(output_dir, f"frame_{frame_idx:04d}.jpg")
    cv2.imwrite(frame_filename, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 88])

    if frame_idx == 0:
        poster_path = os.path.join("public/images", "hero-poster.jpg")
        cv2.imwrite(poster_path, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        print(f"Saved poster image to {poster_path}")

    frame_idx += 1

cap.release()
print(f"Successfully extracted {frame_idx} frames to {output_dir}")
