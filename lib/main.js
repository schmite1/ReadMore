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
