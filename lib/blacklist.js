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
