// Name: Eric Schmitt
// Course: CSC 415
// Semester: Spring 2015
// Instructor: Dr. Pulimood
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing certain sites denoted by a customizable blacklist, not by preventing site access entirely, but by redirecting to productive alternative sites for the user to explore.
// Filename: whitelist.js
// Description: Prototype WhiteList script. Basic functionality that randomly selects one of two URLs in an array to redirect the current webpage.
// Last modified on: 04/14/15

var random = Math.floor(Math.random()*2)
var whiteList = ["http://www.gutenberg.org/ebooks/search/?sort_order=downloads", "https://en.wikipedia.org/wiki/Special:Random"]

window.location.replace(whiteList[random]);
