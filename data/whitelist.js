// Name: Eric Schmitt
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing
// 		certain sites denoted by a customizable blacklist, not by preventing
//		site access entirely, but by redirecting to productive alternative
//		sites for the user to explore.
// Filename: whitelist.js
// File description: Script that creates a whitelist of sites for redirection
//		when a blacklisted site (defined in blacklist.js and main.js) is
//		navigated to. The blacklisted site is replaced with a randomly
//		selected whitelisted website.
//
//		This script functions as a proof of concept for a whitelist,
//    parsing strings, separated by commas and/or spaces, and then
//    populating an array with the strings, simulating user input.
//		See main.js line 384 for further details.
//
// Last modified on: 07/05/15

//String of URLs separated by commas and/or spaces.
var whiteList = "https://en.wikipedia.org/wiki/Special:Random, "
	+ "http://en.wikisource.org/wiki/Portal:Portals, "
	+ "https://www.gutenberg.org/ebooks/search/?sort_order=random";

//Regular expression splits whiteList string on commas and spaces, then
//		enters the separate strings into an array whiteListArray.
var whiteListArray = whiteList.split(/[\s,]+/);

//Generates a random number from 0 to the length of the whiteListArray -1.
var random = Math.floor(Math.random()*(whiteListArray.length));

//The current browser URL is replaced by a random URL from whiteListArray.
window.location.replace(whiteListArray[random]);
