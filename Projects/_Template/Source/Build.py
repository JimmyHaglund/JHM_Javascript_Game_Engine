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

def read_file(file_path):
    contents = ""
    with open(file_path, 'r') as target:
        contents = target.read()
    return contents

if __name__ == '__main__':
    os.system('cmd /c tsc')
    merge_files('./Js', '../Scripts/Template.js')
