#!/data/data/com.termux/files/usr/bin/bash

echo "📥 Updating Termux packages..."
pkg update -y && pkg upgrade -y

echo "📦 Installing Python & FFmpeg..."
pkg install python ffmpeg -y

echo "📦 Installing Required Python Packages..."
pip install -U yt-dlp

echo "✅ All packages installed!"

echo "📝 Creating Python Downloader Script..."

cat > videodownloader.py << 'EOF'
import os
import shutil
from yt_dlp import YoutubeDL

def clean_filename(name):
    name = name.replace(' ', '_')
    for ch in ['#', '?', '*', ':', '"', '<', '>', '|', '/', '\\', '!', '.', ',']:
        name = name.replace(ch, '')
    return name

def scan_media(file_path):
    os.system(f'am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file://{file_path}')

def move_file(src, dst_folder, dst_name):
    dst_path = os.path.join(dst_folder, dst_name)
    try:
        shutil.copy2(src, dst_path)
        os.remove(src)
        print(f"✅ Move complete: {dst_path}")
        scan_media(dst_path)
        print("✅ Gallery refreshed!")
    except Exception as e:
        print(f"❗ Error moving file: {e}")

def download_and_move(url):
    ydl_opts = {
        'format': 'best',
        'outtmpl': '%(title)s.%(ext)s',
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        raw_name = f"{info['title']}.mp4"
        clean_name = clean_filename(info['title']) + '.mp4'

    destination_dir = '/storage/emulated/0/downme'
    os.makedirs(destination_dir, exist_ok=True)

    move_file(raw_name, destination_dir, clean_name)

while True:
    link = input(" q / link >>> ")
    if link.lower() == 'q':
        break
    download_and_move(link)

print("✅ All videos downloaded and moved successfully!")
EOF

echo "✅ Python downloader script created: videodownloader.py"
echo "📥 You can run it with: python videodownloader.py"