// Name: Eric Schmitt
// Course: CSC 415
// Semester: Spring 2015
// Instructor: Dr. Pulimood
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing certain sites denoted by a customizable blacklist, not by preventing site access entirely, but by redirecting to productive alternative sites for the user to explore.
// Filename: blacklist.js
// Description: Main script file that accesses blacklist.js, which indicates which sites for whitelist.js to act on. Page mod refers to whitelist.js whenever a blacklisted site is accessed. Note that the toolbar button icons are not included, but will be packaged with the final .xpi file.
// Last modified on: 04/21/15

//String of URLs separated by commas and/or spaces.
var blackList = "*.facebook.com *.youtube.com, *.tumblr.com";

//Splits blackList string on commas and spaces, then enters the separate strings into an array.
var blackListArray = blackList.split(/[\s,]+/);

//Sorts the array alphabetically
var blackListSortedArray = blackListArray.sort();

//Return the sorted array
function getBlackList() {
	return blackListSortedArray;
}

//Make getBlackList() accessible to main.js
exports.getBlackList = getBlackList
