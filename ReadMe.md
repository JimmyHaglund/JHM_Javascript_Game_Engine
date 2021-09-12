# JhmEngine, a simple static browser-based game engine

JhmEngine was made by me, Jimmy Haglund Malm, in order to have a lightweight and simple way to make game applications that can run in a browser window. The engine has been developed as a way to both learn more about Javascript, web, and game development. The engine is designed to function by running a html page directly by a browser, meaning that no web server is required for running applications made by it. This puts a limit to project scope, which is intended as the purpose of the engine is to allow creating tiny game applications that load near-instantly.

## Core Features

- Completely static. Embed into any html page, takes as long to load as the content of the actual page.
- Click to run. Runs in any html file without a need for a server. Since the engine uses simple javascript files without any modules or dynamically loaded assets, games made using it should be able to be run directly even in a local html file.
- Stupid simple. No extra requierements. As long as you have the JhmEngine js file, it should work.
- Unopinionated. This is a library, designed around using HTML canvas. Beyond that, how you want to set up your projects is up to you.

## Quick Instructions

The fastest way to get a project up and running is by simply copying the template project, located in Projects/Template. This folder contains an html file which has been set up to run a blank screen, and has a readme with information about how I've set up my projects using Typescript and the Build.py file.
Each folder generally has its own readme file with some form of project description.

The JhmEngine folder contains the actual core engine. Check the readme in there for more detailed information on how the project is set up.  

## Naming conventions

The JhmEngine follows the following naming conventions.
- Private members: _privateMember (underscore + camelCase)
- Public members: publicMember (camelCase)
- Private & public methods: AnyMethod (PascalCase)
- Files: FileName (PascalCase)
- public scope variables: variableName (camelCase)
- public scope functions: FunctionName (PascalCase)

## Links

- Typescript: https://www.typescriptlang.org/
- Javascript W3: https://www.w3schools.com/js/default.asp
- Javascript pluralsight: https://www.javascript.com/
- HTML W3: https://www.w3schools.com/html/default.asp 
