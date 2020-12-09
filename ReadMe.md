# Jimmy Haglund Malm Static Web Game Framework, JHMEngine

JHMEngine made by me, Jimmy, in order to have a lightweight and simple way to make game applications that can run in a browser window. The engine has been developed as a way to both learn more about Javascript, web, and game development. The engine is entirely front-end, meaning the whole game is loaded as a single web page. This makes is suitable for small projects, but anything larger will require a backend component to dynamically load and unload assets.

The engine was originally written in Javascript and has later been rewritten in Typescript, making development quicker.

# Quick Start
The quickest way to start is by copying a project folder (marked with an underscore) and taking a look at the .index folder.

# Commands
tsc: Transpile typescript files and output the result into the javascript root folder.

# Folder structure
- typescript folder contains core scripts
- javascript folder contains transpiled scripts
- project-specific root folders start with an underscore, ex "_Caprica" for the project named Caprica.
- Each project contains one index html file which decides the exact resources and .js scripts to include.

Project-specific .ts scripts need to be contained in a typescript folder determined by the .tsconfig file. The config file can be changed to alter both in and out directories if you want to contain project-specific files in their root folders. More information can be found here: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html