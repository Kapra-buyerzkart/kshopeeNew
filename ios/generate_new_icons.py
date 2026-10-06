import json
import os
import subprocess
import shutil

appiconset_path = "/Users/kaprawebai/kshopeeNew/ios/KapraDaily/Images.xcassets/AppIcon.appiconset"
contents_path = os.path.join(appiconset_path, "Contents.json")

# The user's new logo
source_img = "/Users/kaprawebai/kshopeeNew/src/logofor app.png"
base_img = os.path.join(appiconset_path, "base_1024.png")

print(f"Using source image: {source_img}")

# Strip transparency by converting to BMP then to PNG, and ensure it's 1024x1024
temp_bmp = "/tmp/temp_new_icon.bmp"
subprocess.run(["sips", "-z", "1024", "1024", "-s", "format", "bmp", source_img, "--out", temp_bmp], check=True)
subprocess.run(["sips", "-s", "format", "png", temp_bmp, "--out", base_img], check=True)
print("Stripped alpha and resized base image to 1024x1024")

# Read Contents.json
with open(contents_path, 'r') as f:
    contents = json.load(f)

generated_files = ["base_1024.png", "Contents.json"]

# Generate all sizes
for img in contents.get("images", []):
    size_str = img.get("size")
    scale_str = img.get("scale", "1x")
    filename = img.get("filename")
    
    if not size_str or not filename:
        continue
        
    width_pt, height_pt = map(float, size_str.split("x"))
    scale = float(scale_str.replace("x", ""))
    
    width_px = int(width_pt * scale)
    height_px = int(height_pt * scale)
    
    out_path = os.path.join(appiconset_path, filename)
    print(f"Generating {filename} ({width_px}x{height_px})...")
    # Resize base image
    subprocess.run(["sips", "-z", str(height_px), str(width_px), base_img, "--out", out_path], check=True)
    generated_files.append(filename)

# Clean up other PNGs
for f in os.listdir(appiconset_path):
    if f not in generated_files:
        print(f"Removing unused file: {f}")
        try:
            os.remove(os.path.join(appiconset_path, f))
        except:
            pass
        
os.remove(base_img)
os.remove(temp_bmp)
print("Done! All App Icons generated successfully.")
