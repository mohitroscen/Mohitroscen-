import os
from PIL import Image, ImageDraw

def make_circle_favicon(filepath):
    try:
        img = Image.open(filepath).convert("RGBA")
        
        # Create a mask
        mask = Image.new("L", img.size, 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, img.size[0], img.size[1]), fill=255)
        
        # Apply the mask
        result = img.copy()
        result.putalpha(mask)
        
        # Save back
        result.save(filepath)
        print(f"Made circular: {filepath}")
        return result
    except Exception as e:
        print(f"Failed {filepath}: {e}")
        return None

favicon_dir = "assets/favicon"
if os.path.exists(favicon_dir):
    files = os.listdir(favicon_dir)
    img_32 = None
    for f in files:
        if f.endswith(".png"):
            res = make_circle_favicon(os.path.join(favicon_dir, f))
            if f == "favicon-32x32.png":
                img_32 = res
                
    # Also update favicon.ico
    if img_32:
        img_32.save(os.path.join(favicon_dir, "favicon.ico"), format="ICO", sizes=[(32, 32)])
        print("Updated favicon.ico")
