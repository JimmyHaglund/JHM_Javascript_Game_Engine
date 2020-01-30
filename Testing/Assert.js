var testsRun = 0;
var testsPassed = 0;
var testsFailed = 0;
var testData = [];
var currentTestData;

function resetTestData(){
    testsRun = 0;
    testsPassed = 0;
    testsFailed = 0;
    testData = [];
    currentTestData = null;
}
function describe(functionName, actionDescriptionFunction) {
    let failCount = testsFailed;
    currentTestData = functionName + " ";
    let testSucceeded = actionDescriptionFunction();
    testData.push(currentTestData);

    // Print result info if test failed.
    // if (failCount != testsFailed){
        console.log(currentTestData);
    // }
    return testSucceeded;
}

function it(description, testFunction) {
    currentTestData += description + ". ";
    return testFunction();
};

is = {
    equal: function(varA, varB) {
        let successMessage = "Succeeded";
        let failMessage = "Failed: " + varA + " returned, " + varB + " expected.";
        return this.evaluate(varA, varB, successMessage, failMessage);
    },
    notEqual: function(varA, varB) {
        let successMessage = "Succeeded";
        let failMessage = "Failed: " + varA + " is same as, " + varB + ".";
        return this.evaluateNotEqual(varA, varB, successMessage, failMessage);
    },
    sameType: function(A, B) {
        let aType = typeof A;
        let bType = typeof B;
        let successMessage = "Succeeded";
        let failMessage = "Failed, was type " + aType + ", expected type " + bType + ".";
        return this.evaluate(aType, bType, successMessage, failMessage);
    },

    evaluate: function(valA, valB, successMessage, failMessage){
        let feedback = "";
        let testPassed = false;
        if (valA === valB){
            testsPassed++;
            feedback = successMessage;
            testPassed = true;
        } else {
            testsFailed++;
            feedback = failMessage;
        }
        ++testsRun;
        currentTestData += feedback;
        return testPassed;
    },
    evaluateNotEqual: function(valA, valB, successMessage, failMessage){
        let feedback = "";
        let testPassed = false;
        if (valA != valB){
            testsPassed++;
            feedback = successMessage;
            testPassed = true;
        } else {
            testsFailed++;
            feedback = failMessage;
        }
        ++testsRun;
        currentTestData += feedback;
        return testPassed;
    }
};