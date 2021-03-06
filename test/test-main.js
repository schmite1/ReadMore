// Name: Eric Schmitt
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing
//    certain sites denoted by a customizable blacklist, not by preventing
//    site access entirely, but by redirecting to productive alternative
//    sites for the user to explore.
// Filename: test-main.js
// File description: Script for unit testing main.js. Skeleton of the script
// 		is generated by the SDK, then was modified for custom unit testing.
//
// Last modified on: 07/05/15

//Try-catch for importing main.js and blacklist.js scripts for testing
try{
	var main = require("./main");
	var blacklist = require("./blacklist.js");
}
catch(FileNotFoundException) {
  console.log("ERROR: Files " + FileNotFoundException.description
    + ". Files main.js and blacklist.js must be present in ReadMore/lib folder"
    + " for tests to run.");
}

//--------------------------------------------------------------------------
//
//  Function: exports["test main"]
//
//    Parameters:
//        function(assert); assert.pass takes two parameters: a variable and
//						a value for comparison, and a message to log to the console
//						during testing. The variable is set to the value returned by
//						each respective function.
//    
//    Pre-condition: All functions to test must be defined in main.js.
//				Each function must return an element whose value can be determined
//				to be null or not.
//    Post-condition: The element returned by each function is determined to
//				be null or not. If the functions execute successfully, none of
//				the values should be null.
//--------------------------------------------------------------------------
exports["test main"] = function(assert) {
	var modificationTest = main.modifyPage();
	assert.pass(modificationTest != null, "Testing initialization of PageMod.");
	
	var blackListValidityTesting = main.ensureValidBlackList();
	assert.pass(blackListValidityTesting != null, "Testing if BlackList contains"
		+ "elements.");

	var updateModTesting = main.updatePageModInclude();
	assert.pass(updateModTesting != null, "Testing if PageMod has included"
		+ "new elements.");

	var memoryTest = main.storePreferencesInMemory;
	assert.pass(memoryTest != null, "Testing whether any preferences are stored"
		+ " in memory.");
}

//--------------------------------------------------------------------------
//
//  Function: exports["test blacklist"]
//
//    Parameters:
//        function(assert); assert.pass takes two parameters: a variable and
//						a value for comparison, and a message to log to the console
//						during testing. The variable is set to the value returned by
//						the getBlackList function.
//    
//    Pre-condition: All functions to test must be defined in blacklist.js.
//				The function must return an element whose value can be determined
//				to be null or not.
//    Post-condition: The element returned by getBlackList is determined
//				to be null or not. If blacklist.js executes correctly, the
//				blacklist will not be null.
//--------------------------------------------------------------------------
exports["test blacklist"] = function(assert) {
	var testDefaultBlackList = blacklist.getBlackList();
	assert.pass(testDefaultBlackList != null, "Testing the default BlackList in"
		+ "blacklist.js to ensure it has been populated with elements.")
};

//Testing is run with the terminal command cfx test
require("sdk/test").run(exports);
