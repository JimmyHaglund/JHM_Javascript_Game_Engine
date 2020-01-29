var testsPassed = 0;
var testsFailed = 0;
var testsRun = 0;
var testData = [];
var currentTestData;
function describe(functionName, actionDescriptionFunction) {
    let failCount = testsFailed;
    currentTestData = functionName + " ";
    actionDescriptionFunction();
    testData.push(currentTestData);

    // Print result info if test failed.
    //if (failCount != testsFailed){
        console.log(currentTestData);
    //}
}

function it(description, testFunction) {
    currentTestData += description + ". ";
    testFunction();
};

is = {
    equal: function(varA, varB) {
        let returnVal = "";
        if (varA === varB){
            testsPassed++;
            returnVal = "Succeeded!";
        } else {
            testsFailed++;
            returnVal = "Failed: " + varA + " returned, " + varB + " expected.";
        }
        ++testsRun;
        currentTestData += returnVal;
    }
};