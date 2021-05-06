import os
from os import walk

def bundle(root, outfile):
    contents = walk(root)
    open(outfile, 'w+').close()
    add_files_in_directory(root, outfile)
    for root, dirs, files in contents:
        for dir in dirs:
            print("\n" + dir)
            path = os.path.join(root, dir)
            add_files_in_directory(path, outfile)

def add_files_in_directory(dirpath, outpath):
    dependents = []
    readfiles = []
    with open(outpath, "a") as outfile:
        for filename in os.listdir(dirpath):
            if filename[-2:] != "js":
                continue
            path = os.path.join(dirpath, filename)
            if (has_unresolved_dependency(path, readfiles)):
                print("Unresolved dependency for file " + filename)
                dependents.append(path)
                continue
                    
            contents = read_file(path)
            print("Reading " + filename)
            outfile.write(contents + "\n")
            readfiles.append(filename[:-3])
    add_dependents(dependents, readfiles, outpath)

def add_dependents(dependents, readfiles, outpath):
    if (dependents.count == 0):
        return
    with open(outpath, "a") as outfile:
        for dependentpath in dependents:
            filename = os.path.basename(dependentpath)
            if (has_unresolved_dependency(dependentpath, readfiles)):
                print("Still unresolved dependency for " + filename)
                continue
                    
            contents = read_file(dependentpath)
            print("Reading " + filename)
            outfile.write(contents + "\n")
            readfiles.append(filename[-3:])
            dependents.remove(dependentpath)

def has_unresolved_dependency(path, readfiles):
    with open (path, "r") as file:
        dependencydeclaration = file.readline()
        dependencies = get_dependencies(dependencydeclaration)
        return dependency_unresolved(dependencies, readfiles)

def dependency_unresolved(dependencies, readfiles):
    for dependency in dependencies:
        if dependency not in readfiles:
            return 1
    return 0

def read_file(file_path):
    with open(file_path, 'r') as target:
        return target.read()

def get_dependencies(dependencystring):
    items = dependencystring.split()
    if not "Dependencies:" in items:
        return []
    items.remove("//")
    items.remove("Dependencies:")
    return items

if __name__ == '__main__':
    os.system('cmd /c tsc')
    bundle('./Js', '../Scripts/Caprica.js')
