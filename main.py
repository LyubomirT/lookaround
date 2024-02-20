from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import os
from cleaner import clean_folder

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/clean')
def clean():
    clean_folder(app.config['UPLOAD_FOLDER'], delete=False, ignore_gitkeep=True)
    return 'Folder cleaned'

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['image']
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            return render_template('index.html', filename=filename)

if __name__ == '__main__':
    clean_folder(app.config['UPLOAD_FOLDER'], delete=False, ignore_gitkeep=True)
    app.run(debug=True, port=5000)
