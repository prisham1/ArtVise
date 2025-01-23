from flask import Flask, request, jsonify
from flask_cors import CORS
from colorthief import ColorThief
import webcolors
import os
import json

app = Flask(__name__)

# Define CORS options
corsOptions = {
    "origins": "http://localhost:5173",  # Allow only this origin
    "methods": ["GET", "POST"],  # Allow only these methods
    "allow_headers": ["Content-Type", "Authorization"]  # Allow only these headers
}

# Apply CORS to the app
CORS(app, resources={r"/*": corsOptions})

def closest_color(rgb):
    differences = {}
    for color_name in webcolors.names("css3"):
        color_hex = webcolors.name_to_hex(color_name)
        r, g, b = webcolors.hex_to_rgb(color_hex)
        differences[sum([(r - rgb[0]) ** 2, (g - rgb[1]) ** 2, (b - rgb[2]) ** 2])] = color_name
    return differences[min(differences.keys())]

def extract_colors(image_path, color_count=10):
    color_thief = ColorThief(image_path)
    palette = color_thief.get_palette(color_count=color_count)

    colors = []
    for color in palette:
        hex_color = "#{:02x}{:02x}{:02x}".format(color[0], color[1], color[2])
        color_name = closest_color(color)
        colors.append({'hex': hex_color, 'name': color_name})
    return colors

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Call the color_extractor script
    try:
        colors = extract_colors(file_path)
        return jsonify({'colors': colors})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def setup_upload_folder():
    upload_folder = 'C:/MERNStackApplication/artvise/server/uploads/'
    os.makedirs(upload_folder, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = upload_folder

if __name__ == '__main__':
    setup_upload_folder()
    print("Current Working Directory:", os.getcwd())
    app.run(debug=True, port=5000)
