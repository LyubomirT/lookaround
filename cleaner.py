import os
import shutil

def clean_folder(folder, delete=False, ignore_gitkeep=True):
    """
    Clean the contents of a folder.

    Parameters:
        folder (str): The path to the folder.
        delete (bool): If True, delete the folder itself. If False, only delete its contents.
        ignore_gitkeep (bool): If True, ignore .gitkeep files.

    Returns:
        None
    """
    try:
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            if os.path.isfile(file_path) and (ignore_gitkeep and filename != '.gitkeep'):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                if ignore_gitkeep and filename == '.gitkeep':
                    continue
                shutil.rmtree(file_path)
    except FileNotFoundError:
        print(f"Folder {folder} not found.")
    except PermissionError:
        print(f"Permission denied to access folder {folder}.")
    except Exception as e:
        print(f"Failed to clean folder {folder}. Reason: {e}")

    if delete:
        try:
            os.rmdir(folder)
        except FileNotFoundError:
            print(f"Folder {folder} not found.")
        except OSError as e:
            print(f"Failed to delete folder {folder}. Reason: {e}")
