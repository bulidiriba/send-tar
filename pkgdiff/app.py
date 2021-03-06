from flask import Flask, request, jsonify, flash, send_file, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename

import json
import os

from readcsv import *

UPLOAD_FOLDER = 'uploads'
# create empty upload foler if not exist
if not os.path.exists(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'txt', 'csv', 'tar'}

app = Flask(__name__)
CORS(app) # enabling CORS

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload_files', methods=['GET','POST'])
def upload_files():
    print("-------upload files upload files-----------")
    device_uuid = request.args.get("device_uuid")
    timestamp = request.args.get("timestamp")
    if request.method == 'POST':
        # check if the post has request has the file
        if 'file1' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file1 = request.files['file1']
        file2 = request.files['file2']
        if file1 and file2:
            filename1 = secure_filename(file1.filename)
            filename2 = secure_filename(file2.filename)
            file1.save(os.path.join(UPLOAD_FOLDER, filename1))
            file2.save(os.path.join(UPLOAD_FOLDER, filename2))
            #result = execute(os.path.join(UPLOAD_FOLDER, filename1), os.path.join(UPLOAD_FOLDER, filename2))
            result = compare_tar(os.path.join(UPLOAD_FOLDER, filename1), os.path.join(UPLOAD_FOLDER, filename2), device_uuid, timestamp)
            file_result = return_file(device_uuid, timestamp)
            
            return jsonify(file_result)

    #return None

@app.route('/download_file', methods=['GET'])
def download_file():
    file_path = request.args.get("file_path")
    print("----------file path file path------", file_path)
    return send_file(
            file_path,
            as_attachment = True
        )

@app.route('/<device_uuid>/changes_report.html')
def changes_report(device_uuid=None):
    return render_template(device_uuid+'/changes_report.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
