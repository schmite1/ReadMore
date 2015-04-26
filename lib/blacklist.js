// Name: Eric Schmitt
// Course: CSC 415
// Semester: Spring 2015
// Instructor: Dr. Pulimood
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing
// 		certain sites denoted by a customizable blacklist, not by preventing
//		site access entirely, but by redirecting to productive alternative
//		sites for the user to explore.
// Filename: blacklist.js
// Description: Default blacklist to be created if a blacklist has not yet been
//		defined by the user, or to replace an invalid user-defined blacklist.
//
// Last modified on: 04/26/15

//String of URLs separated by commas and/or spaces
var blackList = "*.facebook.com *.youtube.com, *.twitter.com";

//Regular expression splits blackList string on commas and spaces, then
//		enters the separate strings into an array blackListArray.
var blackListArray = blackList.split(/[\s,]+/);

//Sorts the array alphabetically and assigns a new array to it
var blackListSortedArray = blackListArray.sort();

//--------------------------------------------------------------------------
//
//  Function: getBlackList()
//
//    Parameters: empty
//    
//    Pre-condition: blackListSortedArray must be populated with URL strings
//    Post-condition: String array blackListSortedArray is returned
//--------------------------------------------------------------------------
function getBlackList() {
	return blackListSortedArray;
}

//Exports getBlackList() for main.js and test-main.js to access
exports.getBlackList = getBlackList
