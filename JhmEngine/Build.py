import os
from os import walk
from pydoc import classname
from queue import Empty

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

def copy_declarations(source, target):
    contents = walk(source)
    copy_declarations_in_folder(source, target)
    for root, dirs, files in contents:
        for dir in dirs:
            sourcepath = os.path.join(root, dir)
            targetpath = os.path.join(root, dir)[5:]
            targetpath = os.path.join(target, targetpath)
            print("Checking declarations in " + sourcepath)
            copy_declarations_in_folder(sourcepath, targetpath)

def copy_declarations_in_folder(sourcepath, targetpath):
    for filename in os.listdir(sourcepath):
        if filename[-5:] != ".d.ts":
            continue
        inpath = os.path.join(sourcepath, filename)
        contents = read_file(inpath)
        outpath = os.path.join(targetpath, filename)
        print("copying declaration: " + filename + " to " + outpath)
        with open(outpath, "w+") as out:
            out.write(contents)

def build_dependency_class(rootDir):
    contents = walk(rootDir)
    for root, dirs, files in contents:
        for file in files:
            dependencies = get_class_dependencies(os.path.join(root, file))
            if dependencies is None:
                continue
            print(dependencies)
        # print(root)
        # print(dirs)
        # print(files)

def get_class_dependencies(path):
    # dependencies = dict()
    # 1) for each file, read the class & dependencies
    implementsKey = 'implements'
    classKey = 'class'
    spaces = ' '

    parents = []
    contents = read_file(path)
    classNameStartIndex = contents.find(classKey) + len(classKey)
    if classNameStartIndex < len(classKey):
        # print(path)
        return
    implementsIndex = contents.find(implementsKey)
    startClassIndex = contents.find('{', implementsIndex + 1)

    classNameEndIndex = implementsIndex
    if implementsIndex < 0:
        classNameEndIndex = startClassIndex
        # print("No dependencies")
    className = contents[classNameStartIndex : classNameEndIndex].strip(spaces)
    
    if implementsIndex < 0:
        return (className, [])

    implementsIndex = implementsIndex + len(implementsKey)
    implementedClassesText = contents[implementsIndex : startClassIndex].strip(spaces)
    startIndex = 0 
    endIndex = implementedClassesText.find(',')
    if endIndex < 0:
        endIndex = len(implementedClassesText)
    # print('Resolving dependencies for ' + className)
    while endIndex > 0 and startIndex - 1 != endIndex:
        dependency = implementedClassesText[startIndex : endIndex].strip(spaces)
        startIndex = endIndex + 1
        endIndex = implementedClassesText.find(',', startIndex)
        if endIndex < 0:
            endIndex = len(implementedClassesText)
        parents.append(dependency)
    # print(parents)
    # dependencies[className] = parents
    # print(dependencies)
    return (className, parents)
    
    # print(implementedClassesText)
    # dependencies['Transform'] = ['ITransform', 'Loop']
    # print(dependencies)
    # print(dependencies['Transform'])
    # 2) Set up dependencies in TS class
    return

if __name__ == '__main__':
    # os.system('cmd /c tsc')
    # bundle('./Js', './Out/JhmEngine.js')
    # copy_declarations('./Ts', './Out/JhmEngine')
    # create_type_class('./Ts/Entity.ts')
    build_dependency_class('./Ts')