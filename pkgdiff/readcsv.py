import os
import csv
import subprocess

cmd_prefix = "/Users/mac/components"
cwd = os.getcwd()


def compare_tar(tar1, tar2, device_uuid, timestamp):
  report_folder = "templates/"+device_uuid+"-"+timestamp
  report_html = "changes_report.html"
  report_path = report_folder+"/"+report_html
  subprocess.call(["rm", "-rf", report_folder])
  return subprocess.call(["pkgdiff", tar1, tar2, "-report-path", report_path])


def zip_folder(name, folder):
  subprocess.call(["zip", "-r", folder+"/"+name, folder])

def return_file(device_uuid, timestamp):
  report_html = "changes_report.html"
  zip_name = "pkgdiff_reports.zip"
  
  report_folder = "templates/"+device_uuid+"-"+timestamp
  report_path = report_folder+"/"+report_html
  zip_path = report_folder+"/"+zip_name

  # call zipping the folder
  zip_folder(zip_name, report_folder)

  # get the file size, metric,
  file_stats = os.stat(report_path)
  file_size = file_stats.st_size
  size_metric = "bytes"

  zip_stats = os.stat(zip_path)
  zip_size = zip_stats.st_size

  result = {"file_name":report_html,
            "file_path":report_path,
            "file_size":file_size,
            "size_metric":size_metric,
            "zip_name":zip_name,
            "zip_path":zip_path,
            "zip_size":zip_size,
            }

  return result


def run(cmd):
  print("---------------subrocess cmd-------------")
  print(cmd)
  return subprocess.run(cmd, check=False, shell=True, capture_output=True, text=True).stdout.strip()


def execute(file1, file2):
  with open(file1, newline='') as locationfile:
      locationreader = csv.reader(locationfile, delimiter='\t', quotechar='\"')
      next(locationreader) #skip headers
      for lrow in locationreader:
        tag, prefix, schema = lrow
        #print("prefix: "+prefix)
        results = []
        with open(file2, newline='') as csvfile:
          reader = csv.reader(csvfile, delimiter='\t', quotechar='\'')
          next(reader) #skip headers
          for row in reader:
              component, dir1, dir2, dir3, dir4, dir5, folder, exclude = row
              dirs = {'dir1': dir1, 'dir2' : dir2, 'dir3' : dir3, 'dir4' : dir4, 'dir5': dir5}
              path1 = dirs[schema]
              testdir = f'{prefix}{path1}'.replace("\\","")
              #print("testdir: "+testdir)
              #print("path1: "+path1)
              if not os.path.exists(testdir):
                #print("test directory: "+testdir)
                results.append(f'{path1},NA\n')
              else:
                #continue
                fullpath = f'{prefix}/{path1}'
                run(f'rm /tmp/hashtemp')
                run(f'rm /tmp/hashtemp2')
                run(f'cp ./machash.sh "{fullpath}/../\"')
                run(f'cp ./machash2.sh "{fullpath}/../\"')
                hash = run(f'(cd \"{fullpath}\" && cd .. && bash machash.sh \"{folder}\" \"{exclude}\")')
                run(f'(cd \"{fullpath}\" && cd .. && bash machash2.sh \"{folder}\" \"{exclude}\")')
                run(f'cp /tmp/hashtemp out/{tag}/{component}_{hash}_hash.csv')
                run(f'cp /tmp/hashtemp2 out/{tag}/{component}_{hash}_files.csv')
                tar_filename = f'{component}_{hash}.tar'
                run(f'rm -f {tar_filename}')
                run(f'tar cf {tar_filename} -T /dev/null')
                listfilename = f'out/{tag}/{component}_{hash}_hash.csv'
                with open(listfilename, newline='') as listfile:
                  filereader = csv.reader(listfile, delimiter=' ', quotechar='\'')
                  for filerow in filereader:
                    if not filerow:
                      continue
                    _, _, *filepath = filerow
                    filepath = " ".join(filepath)
                    run(f'tar -C \"{fullpath}\" -uf {cwd}/{tar_filename} \"{filepath}\"')
                run(f'mv {tar_filename} out/{tag}/')
                #run(f'gzip -9 out/{tag}/{tar_filename}')
                run(f'rm -f "{fullpath}/../machash.sh\"')
                run(f'rm -f "{fullpath}/../machash2.sh\"')
                results.append(f'{path1} \'{hash}\'\n')
        
        results2 = " ".join(results)
        
        # create the directory 
        if not os.path.exists("out"):
          os.mkdir("out")
        
        if not os.path.exists(f"out/{tag}"):
          os.mkdir(f"out/{tag}")

        # get the file name and path
        file_name = "hashes.csv"
        file_path = "out/"+tag+"/"+file_name
        
        f = open(file_path, "w")
        f.write(results2)
        f.close()
        
        # get the file size
        file_stats = os.stat(file_path)
        file_size = file_stats.st_size
        file_size_metric = "bytes"
    
        result = {"file_name":file_name, 
                  "file_path":file_path, 
                  "file_size":file_size, 
                  "file_size_metric":file_size_metric
                  }

        return result

#result = execute("local_locations.txt", "sw_location.txt")
#compare_tar("./files/tar1.tar", "./files/tar2.tar")
#print(r)