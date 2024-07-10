from flask import Flask, request, render_template, send_file
from werkzeug.utils import secure_filename
import os
from cleaner import clean_folder
import asyncio
import schedule
from pathlib import Path
from isValidImage import is_valid_image # Import the function to check if the file is a valid image

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'

def clean_folder_async():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(clean_folder(app.config['UPLOAD_FOLDER'], delete=False, ignore_gitkeep=True))

def schedule_cleaning():
    schedule.every(1).hours.do(clean_folder_async)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['image']
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            # Resolve the file path
            file_path = Path.cwd() / 'static' / 'uploads'
            retrieved_file = file_path / filename

            # Check if the file exists
            if not os.path.exists(file_path):
                return render_template('index.html', error_message="File not found")

            # Read the first 4 bytes of the file
            with open(retrieved_file, 'rb') as f:
                file_buffer = f.read(4)

            # Check if the file is an valid image
            if not is_valid_image(file_buffer):
                os.remove(retrieved_file)  # Delete the file if it's not a valid image
                return render_template('index.html', error_message="Invalid image file! Please select a JPEG, PNG, or GIF image.")
            
            return render_template('index.html', filename=filename)
    
@app.route('/favicon.ico')
def favicon():
    return send_file('branding/LookaroundFixed.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
    schedule_cleaning()
    app.run(debug=True, port=5000)
