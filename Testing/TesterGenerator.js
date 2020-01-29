// Generates JHM-Test.js based on test files in Tests folder.

const fileSystem = require('fs');
const testPath = './Tests/';
fileSystem.readdir(testPath, processFiles);
var functionNames = [];
function processFiles(error, dirEnt) {
    if (error != null){
        console.log("error when reading test file directory!");
        return;
    }
    // Read each test file & extract test function names
    let fileCount = dirEnt.length;
    dirEnt.forEach(fileName => {
        fileSystem.readFile(testPath + fileName, "utf8", (err, data) => {
            // console.log(extractFunction(data));
            functionNames.push(extractFunction(data));
            if (functionNames.length >= fileCount) {
                // Write JHM-Test.js
                fileSystem.writeFile('./JHM-Test.js', GenerateTester(), () => console.log("Test file generated."));
                // Write TestRunner.html
                // TODO
            }
        });
    });
}

function GenerateTester(){
    let contents = "function jhm_test(){\n";
    functionNames.forEach(element => {
        contents += element + "();\n";
    });
    contents += "}";
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