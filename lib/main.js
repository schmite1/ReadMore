// Name: Eric Schmitt
// Course: CSC 415
// Semester: Spring 2015
// Instructor: Dr. Pulimood
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing certain sites denoted by a customizable blacklist, not by preventing site access entirely, but by redirecting to productive alternative sites for the user to explore.
// Filename: main.js
// Description: Main script file. Page mod refers to whitelist.js whenever Facebook is accessed. This is a simple prototype of blacklisting. Note that the toolbar button icons are not included, but will be packaged with the final .xpi file.
// Last modified on: 04/14/15

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");

var button = buttons.ActionButton({
  id: "readmore-icon",
  label: "ReadMore",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("http://facebook.com");
}

pageMod.PageMod({
	include: "*.facebook.com",
	contentScriptFile: self.data.url("whitelist.js")
});
