# Quick-start
Build the project by running Source/Build.py. This will run tsc to generate a javacript library, and then bundle all the javascript files into a single script and place it in the Scripts folder for easy reference by the html file.

## Folder structure
You can change the folder structure at your leisure. If you make changes the Source folder, be sure to change Build.py so it looks at the correct folders, and tsconfig.json so it uses the correct source and output.
- Source: Contains source script files. Run Source/Build.py to build the project and place the final js file into the Scripts folder.
- Source/Ts: Contains project typescript files
- Source/Js: Contains javscript files corresponding to the typescript project.
- Images: Contains images for use in the application
- Sound: Contain sound files for use in the application.