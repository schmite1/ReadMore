// Name: Eric Schmitt
// Course: CSC 415
// Semester: Spring 2015
// Instructor: Dr. Pulimood
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing certain sites denoted by a customizable blacklist, not by preventing site access entirely, but by redirecting to productive alternative sites for the user to explore.
// Filename: main.js
// Description: Main script file that accesses blacklist.js, which indicates which sites for whitelist.js to act on. Page mod refers to whitelist.js whenever a blacklisted site is accessed. Note that the toolbar button icons are not included, but will be packaged with the final .xpi file.
// Last modified on: 04/21/15

var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var preferences = require("sdk/simple-prefs").prefs;
var { ToggleButton } = require("sdk/ui/button/toggle");
var settings = require("sdk/simple-prefs");
var importBlackList = require("./blacklist.js");
var blackListed = importBlackList.getBlackList();

var button = ToggleButton({
  id: "readmore-icon",
  label: "ReadMore",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: clicked
});

function clicked(state) {
  if(state.checked) {
    pageMod.PageMod({
      include: blackListed,
      contentScriptFile: self.data.url("whitelist.js")
    });
    console.log(state.label + " checked state: " + state.checked);
    console.log(blackListed);
  }
}


settings.on("blackList", function() {
  console.log("BlackList Options (to be implemented)");
});

settings.on("whiteList", function() {
  console.log("WhiteList Options (to be implemented)");
});
