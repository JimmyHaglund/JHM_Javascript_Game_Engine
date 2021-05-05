import os
from os import walk

def merge_files(root, outpath):
    contents = walk(root)
    open(outpath, 'w').close()

    with open(outpath, "a+") as target:
        for path, dirs, files in contents:
            for file in files:
                if file[-2:] == 'js':
                    contents = read_file(os.path.join(path, file))
                    target.write(contents + "\n")

def print_folder(root):
    contents = walk(root)
    
    for (path, dirs, files) in contents:
        for dir in dirs:
            print (os.path.join(path, dir))
        for file in files:
            print(os.path.join(path, file))

def read_file(file_path):
    contents = ""
    with open(file_path, 'r') as target:
        contents = target.read()
    return contents

def append_to_file(file_path, data):
    with open(file_path, 'a+') as target:
        target.write(data + "\n")

if __name__ == '__main__':
    os.system('cmd /c tsc')
    merge_files('./Js', './Out/JhmEngine.js')
