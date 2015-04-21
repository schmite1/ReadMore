// Name: Eric Schmitt
// Course: CSC 415
// Semester: Spring 2015
// Instructor: Dr. Pulimood
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing certain sites denoted by a customizable blacklist, not by preventing site access entirely, but by redirecting to productive alternative sites for the user to explore.
// Filename: whitelist.js
// Description: Prototype WhiteList script. Basic functionality that randomly selects one of two URLs in an array to redirect the current webpage.
// Last modified on: 04/14/15

//String of URLs separated by commas and/or spaces.
var whiteList = "http://www.gutenberg.org/ebooks/search/?sort_order=downloads, https://en.wikipedia.org/wiki/Special:Random http://en.wikisource.org/wiki/Portal:Portals";

//Splits whiteList string on commas and spaces, then enters the separate strings into an array.
var whiteListArray = whiteList.split(/[\s,]+/);

//Generates a random number from 0 to the length of the whiteListArray -1.
var random = Math.floor(Math.random()*(whiteListArray.length));

//The current URL is replaced by a random URL from the whiteListArray.
window.location.replace(whiteListArray[random]);
