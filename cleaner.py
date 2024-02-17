import os
import shutil

def clean_folder(folder, delete=False, ignore_gitkeep=True):
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        if os.path.isfile(file_path):
            if ignore_gitkeep and filename == '.gitkeep':
                continue
            if delete:
                os.remove(file_path)
            else:
                shutil.move(file_path, os.path.join('static', filename))
        else:
            if delete:
                shutil.rmtree(file_path)
            else:
                shutil.move(file_path, os.path.join('static', filename))
    return True