/** Jimmy Haglund, 2020-01-29
 * Run this script with node to generate a TestRunner.html and JHM-Test.js.
 * TestRunner.html can be opened in a browser in order to run tests.
 * Files included will be any in subfolders of the Tests folder and in
 * the JHM-Framework folder.
 * 
 * Each test file is expected to start with a function which is used to 
 * execute the test, declared with the syntax "function exampleTest()".
 */

const fileSystem = require('fs');
const pathSystem = require('path');
const testPath = './Tests/';
const corePath = '../JHM-Framework/javascript/';
const testFunctionNames = [];
const testFiles = [];
const coreFiles = [];
processCoreFiles();
processTestFiles();
writeJHMTest();
writeTestRunner();

function processCoreFiles(){
    forEachFileInFolder(corePath, path => {
        if (pathSystem.extname(path) != ".js") return;
        coreFiles.push(path);
    });
}

function processTestFiles() {
    // Read test files
    forEachFileInFolder(testPath, path => {
        if (pathSystem.extname(path) != ".js") return;
        testFunctionNames.push(
            extractFunction(
                fileSystem.readFileSync(path, "utf8")));
        testFiles.push(path);
    });
}

function forEachFileInFolder(folderPath, operation){
    let files = fileSystem.readdirSync(folderPath);
    files.forEach(path => {
        if (fileSystem.statSync(folderPath + path).isDirectory()){
            forEachFileInFolder(folderPath + path + "/", operation);
        } else {
            operation(folderPath + path);
        }
    });

}
function writeTestRunner(){
    fileSystem.writeFile('./TestRunner.html', generateTestRunner(), 
    () => console.log("Test runner generated."));
}
function writeJHMTest(){
    fileSystem.writeFile('./JHM-Test.js', generateTester(), 
    () => console.log("Test file generated."));
}

function generateTester(){
    let contents = "function jhm_test(){\n";
    testFunctionNames.forEach(element => {
        contents += "   " + element + "();\n";
    });
    contents += "    setTimeout (() => {\n";
    contents += "    console.log('Tests executed: ', testsRun);\n";
    contents += "    console.log('Tests succeeded: ', testsPassed);\n";
    contents += "    console.log('Tests failed: ', testsFailed);\n";
    contents += "    resetTestData();\n";
    contents += "}, 1000);\n"
    contents += "}";
    return contents;
}

function generateTestRunner(){
    let contents = "<!DOCTYPE html>\n";
    contents += "<html>\n";
    contents += "  <head>\n";
    contents += "  <style>\n";
    contents += "    srcImg { display: none; }\n";
    contents += "  </style>\n";
    contents += "    <title>Tests</title>\n";
    contents += "  </head>\n";
    contents += "  <body onload='jhm_test()'>\n";
    
    contents += "    <srcImg>\n";
    // TODO: Auto add each image in Images folder
    contents += "      <img src = './Images/Face.png' id='face' display='none'>\n";
    contents += "    </srcImg>\n";
    coreFiles.forEach(path => 
    contents += `    <script src = "` + path + `"></script>\n`);
    contents += "    <div id = 'tests'>\n";
    contents += "      <script src = './Assert.js'></script>\n"
    contents += "      <script src = './JHM-Test.js'></script>\n"
    testFiles.forEach(path => 
    contents += `      <script src = "` + path + `"></script>\n`);
    contents += "    </div>\n";
    contents += "    <div id = 'Display'>\n";
    contents += "      <button onClick = 'jhm_test()'>Run Test</button>\n";
    contents += "    </div>\n"
    contents += "  </body>\n";
    contents += "</html>\n";
    return contents;
}
/**
 * Locates the first left paranthesis and returns the preceeding text
 * @param {string data to read} fileData 
 */
function extractFunction(fileData){
    let maxIndex = fileData.indexOf("(");
    // Ignore blank spaces
    for (let i = maxIndex; i >= 0; i--){
        if (fileData[i] != ' ') {
            maxIndex = i;
            break;
        }
    }
    return findPreceedingWord(maxIndex);

    function findPreceedingWord(lastLetterIndex){
        // ignore anonymous functions
        for (let n = lastLetterIndex; n >= 0; n--){
            if (fileData[n] == ' ') {
                let functionName = fileData.substring(n, lastLetterIndex);
                if (functionName == "function"){
                    functionName = findPreceedingWord(n);
                }
                return functionName;
            }
        }
        return "";
    }
}