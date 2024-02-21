from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import os
from cleaner import clean_folder
import asyncio
import schedule
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
            
            return render_template('index.html', filename=filename)

if __name__ == '__main__':
    schedule_cleaning()
    app.run(debug=True, port=5000)
