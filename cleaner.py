import os
import shutil

def clean_folder(folder, delete=False, ignore_gitkeep=True):
    # The delete parameter is used to delete the folder instead of deleting all its contents
    # The ignore_gitkeep parameter is used to ignore the .gitkeep file
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path) and not (ignore_gitkeep and filename == '.gitkeep'):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')