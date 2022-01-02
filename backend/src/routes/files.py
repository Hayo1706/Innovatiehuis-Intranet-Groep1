import os
import json

import connexion
from flask import Flask, render_template, request, send_file
from werkzeug.utils import secure_filename

from ..routes.folders import *

root = '../../../filestorage/root/'

def file_exists(path):
    if path_exists(path):
        return True
    else:
        return False

def getFullFilePath(path):
    return root + path

def secureFileName(filename):
    index_split_name = filename.rfind('.');
    file_type = filename[index_split_name::]
    file_name = filename[0: index_split_name]
    secure_name = secure_filename(file_name)

    #file_type in allowed_extentions, option
    if(len(secure_name) == 0):
        return "New File" + file_type
    return secure_name + file_type

def uploadFiles(id):
    files = connexion.request.files
    current_path = root + getProjectPath(id) + "/" + connexion.request.values.get('path')

    for k, v in files.items():
        upload_file(v, current_path)

    return make_response('file(s) uploaded successfully', 200)


def isFilePathValid(requested_path):
    if path_exists(requested_path) and not os.path.isdir(requested_path):
        return True
    return False

def getUniqueFileName(file_name_type, current_path, count):
    index_split_name = file_name_type.rfind('.');
    file_name = file_name_type[0: index_split_name]
    file_type = file_name_type[index_split_name::]
    if count == 0:
        if file_exists(current_path + "/" + file_name + file_type):
            return getUniqueFileName(file_name_type, current_path, count + 1)
        return file_name + file_type
    else:
        if file_exists(current_path + "/" + file_name  + " (" + str(count) + ")" + file_type):
            return getUniqueFileName(file_name_type, current_path, count + 1)
        return file_name + " (" + str(count) + ")" + file_type

def upload_file(file, path):
    if len(file.filename) > 0:
        file_name = secureFileName(file.filename)
        new_file_name = getUniqueFileName(file_name, path, 0)
        if not dir_exists(path):
            return make_response("File upload failed, directory doesn't exist", 400)
        else:
            file.save(os.path.join(path, new_file_name))  # this will save the file
            return make_response('file uploaded successfully', 200)  # Display message after uploading
    return make_response('file upload failed, no file was selected', 400)

def getFilesInPath(id):
    folder_path = connexion.request.values.get('path')
    requested_path = root + getProjectPath(id) + folder_path
    list_of_files = []
    if path_exists(requested_path):
        paths_in_requested_path = os.listdir(requested_path)
        for path in paths_in_requested_path:
            if not os.path.isdir(requested_path + "/" + path):
                list_of_files.append(path)

    return list_of_files

def moveFile(id):
    source_path = connexion.request.json['from']
    target_path = connexion.request.json['to']

    source_path = root + getProjectPath(id) + "/" + source_path
    target_path = root + getProjectPath(id) + "/" + target_path

    if isFilePathValid(getProjectPath(id) + "/" + source_path) and dir_exists(target_path):
        try:
            shutil.move(source_path, target_path)
        except:
            return make_response("Failed to move file", 400)

        return make_response("Succesfully moved file to target folder", 200)

    return make_response("Failed to move file", 400)


def downloadFile(id):
    requested_path = root + getProjectPath(id) + connexion.request.values.get('path')
    if isFilePathValid(requested_path):
        return send_file(requested_path, as_attachment=True)

def deleteFile(id):
    requested_path = root + getProjectPath(id) + connexion.request.values.get('path')
    if isFilePathValid(requested_path):
        os.remove(requested_path)
        return make_response("Succesfully deleted file", 200)

    return make_response("Failed to delete file", 400)

def editFile(id):
    requested_path = root + getProjectPath(id) + connexion.request.values.get('path')
    if isFilePathValid(requested_path):
        return make_response("This doesn't work yet", 200)



