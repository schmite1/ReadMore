// Author: Eric Schmitt
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing
//    certain sites denoted by a customizable blacklist, not by preventing
//    site access entirely, but by redirecting to productive alternative
//    sites for the user to explore.
// Filename: main.js
// File description: Main script that initially creates a default blacklist
//    of websites by calling blacklist.js, after which users can customize
//    the blacklist in the add-on preferences menu. The redirect function is
//    in the content script whitelist.js, which main.js calls with a PageMod
//    function that applies the script to all blacklisted websites if and
//    when users attempt to access a blacklisted site.
//
//    See ReadMore/lib/blacklist.js and ReadMore/data/whitelist.js for
//    further details.
//
//    NOTE: Only main.js can access the Firefox SDK. In other words, content
//    scripts cannot import, or "require," modules from the SDK. As such,
//    the majority of the code is kept in main.js out of necessity.
//
// Last modified on: 07/05/15

//Try-catch for importing necessary modules from Firefox SDK.
try {
  var memory = require("sdk/simple-storage");
  var pageMod = require("sdk/page-mod");
  var panels = require("sdk/panel");
  var self = require("sdk/self");
  var settings = require("sdk/simple-prefs");
  var { setTimeout } = require("sdk/timers");
  var { ToggleButton } = require("sdk/ui/button/toggle");
  var tabs = require("sdk/tabs");
  require("sdk/tabs").on("ready", activeOrNot);
}
catch(ModuleNotFoundException) {
  console.log("ERROR: Module " + ModuleNotFoundException + ". "
    + "Refer to SDK documentation on the Mozilla Developer Network.")
}

//Try-catch for importing blacklist module.
try {
  var importBlackList = require("./blacklist.js");
}
catch(FileNotFoundException) {
  console.log("ERROR: BlackList file " + FileNotFoundException.description
    + ". File blacklist.js must be present in ReadMore/lib folder for program"
    + " to function.");
}

//User-defined blacklist will be stored in memory for future browser sessions.
//
//  If there is no precedent of a blacklist in memory, then a new blacklist
//  will be created, which will then take an array of strings.
if(!memory.storage.blackList) {
  memory.storage.blackList = [];
}

//On startup, the preferences page is updated with what is stored in memory.
var blackListed = memory.storage.blackList;
settings.prefs["blackList"] = blackListed.join();

//If there is nothing stored in memory, a default blacklist is created
//  using the blacklist defined in blacklist.js.
if (settings.prefs["blackList"] == "") {
  settings.prefs["blackList"] = (importBlackList.getBlackList()).join();
}
blackListed = settings.prefs["blackList"].split(/[\s,]+/);


//Initialize variables for later use
var mod = null;
var buttonIsOn = false;

//The ReadMore toolbar icon in the Firefox browser.
//
//  ToggleButton requires an ID, a label, and an icon.
var toggleButton = ToggleButton({
  //Used to internally keep track of the button
  id: "readmore-icon",
  //Label shown on mouse hover
  label: "ReadMore",
  //Icons are stored in data folder. Firefox picks an appropriate icon
  //    size based on user's screen resolution
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  //onChange executes when the button is clicked,
  //    calling the "clicked" function below
  onChange: clicked
});

//Defines panel that displays in browser when being redirected.
//
//    See ReadMore/data/redirectPanel.html for further details.
var redirectPanel = panels.Panel({
  width: 145,
  height: 55,
  contentURL: "./redirectPanel.html"
});

//--------------------------------------------------------------------------
//
//  Function: showRedirectPanel()
//
//    Parameters: empty
//
//    Pre-condition: redirectPanel must be defined above.
//    Post-condition: redirectPanel is displayed under the ReadMore toolbar
//        icon in the browser, then hidden automatically after 3 seconds.
//--------------------------------------------------------------------------
function showRedirectPanel() {
  redirectPanel.show({
    position: toggleButton
  });
  setTimeout(function() {
    redirectPanel.hide();
  }, 3000);
}

//Defines panel that displays in browser when user tries to save
//    invalid input in the add-on preferences page.
//
//    See ReadMore/data/errorPanel.html for futher details.
var errorPanel = panels.Panel({
  width: 180,
  height: 100,
  contentURL: "./errorPanel.html"
});

//--------------------------------------------------------------------------
//
//  Function: showErrorPanel()
//
//    Parameters: empty
//
//    Pre-condition: errorPanel must be defined above.
//    Post-condition: The blacklist in the add-on preferences page is
//        reverted to the default as defined in blacklist.js to prevent
//        functionality errors. errorPanel is then displayed under the
//        ReadMore toolbar icon in the browser, then hidden automatically
//        after 3 seconds.
//--------------------------------------------------------------------------
function showErrorPanel() {
  settings.prefs["blackList"] = (importBlackList.getBlackList()).join();
  errorPanel.show({
    position: toggleButton
  });
  setTimeout(function() {
    errorPanel.hide();
  }, 3000);
}

//--------------------------------------------------------------------------
//
//  Function: clicked()
//
//    Parameters:
//    state; a value that holds the properties of the toggle button.
//        The "checked" property indicates whether the button is clicked and
//        activated. Further references to ReadMore's checked button will 
//        have this meaning.
//
//    Pre-condition: ReadMore icon toggle button must be clicked (checked/
//        unchecked), with onChange in toggleButton invoking clicked()
//    Post-condition: 1. Checked toggle button calls blackListAlert(), then
//        modifyPage();, and each respective function will execute if the
//        current website is blacklisted. buttonIsOn is set to true,
//        indicating ReadMore is activated.
//        2. Unchecked toggle destroys the active instance of pageMod, then
//        buttonIsOn is set to false, indicating ReadMore is deactivated.
//--------------------------------------------------------------------------
function clicked(state) {
  if(state.checked) {
    blackListAlert();
    modifyPage();
    buttonIsOn = true;
  }
  else {
    mod.destroy();
    buttonIsOn = false;
  }
}

//--------------------------------------------------------------------------
//
//  Function: modifyPage()
//
//    Parameters: empty
//    
//    Pre-condition: "include" indicates which websites to apply PageMod to;
//            in this case, the websites stored in blackListed.
//        "contentScriptFile" indicates the script that executes on the
//            pages in "include"; in this case, whitelist.js
//        "attachTo" indicates which tabs will be affected; in this case,
//            all tabs including the active tab.
//    Post-condition: whitelist.js is called, redirecting the tabs with
//        blacklisted websites to a randomly selected whitelisted site.
//--------------------------------------------------------------------------
function modifyPage() {
  mod = pageMod.PageMod({
    include: blackListed,
    contentScriptFile: self.data.url("whitelist.js"),
    attachTo: ["existing", "top"]
  });
  return mod;
}

//--------------------------------------------------------------------------
//
//  Function: activeOrNot()
//
//    Parameters:
//        tab; acts on all "ready" tabs (content fully loaded)
//    
//    Pre-condition: buttonIsOn must be defined
//        blackListAlert() must be defined
//        The contents of a tab must fully load
//    Post-condition: If buttonIsOn is true (i.e., ReadMore is checked),
//        blackListAlert() is called
//--------------------------------------------------------------------------
function activeOrNot(tab) {
  if(buttonIsOn) {
    blackListAlert();
  }
}

//--------------------------------------------------------------------------
//
//  Function: blackListAlert()
//
//    Parameters: empty
//    
//    Pre-condition: blackList must be defined as a control function
//        in package.json
//    Post-condition: The first for loop iterates through each URL
//        in blackListed. The second for loop iterates through each open
//        tab and checks the page URL for an instance of the blackListed
//        string. If there is a match, showRedirectPanel() is called.
//--------------------------------------------------------------------------
function blackListAlert() {
  for (var i = 0; i < blackListed.length; i++) {
    //currentURL is set to blackListed string with wildcard *. removed
    var currentURL = blackListed[i].substr(2);
    for (let tab of tabs) {
      if((tab.url).indexOf(currentURL) >= 0) {
        showRedirectPanel();
      }
    }
  }
}

//--------------------------------------------------------------------------
//
//  Function: ensureValidBlackList()
//
//    Parameters: empty
//    
//    Pre-condition: blackListed must be defined
//        blackList in package.json must be defined
//    Post-condition: First, if the blacklist string in the add-on
//        preferences is empty, it is reverted to the default blacklist
//        and an error message is displayed. Second, if one of the strings
//        in blackListed is 1. not started with the wildcard "*.", 2. not
//        longer than 2 characters (to avoid a wildcard by itself), or
//        3. missing a "." in the address, showErrorPanel() is called.
//--------------------------------------------------------------------------
function ensureValidBlackList() {
  if(settings.prefs["blackList"] == "") {
    showErrorPanel();
  }
  blackListed = settings.prefs["blackList"].split(/[\s,]+/);

  for(var j = 0; j < blackListed.length; j++) {
    if(blackListed[j].substr(0,2) != "*." || blackListed[j].substr(2,3) == null || blackListed[j].substr(2).indexOf(".") == -1) {
      showErrorPanel();
    }
  }
  return blackListed;
}

//--------------------------------------------------------------------------
//
//  Function: updatePageModInclude()
//
//    Parameters: empty
//    
//    Pre-condition: blackListed must be defined
//        mod (PageMod) must be ensured not to be null
//    Post-condition: mod is emptied with a while loop, then repopulated
//        with the elements in blackListed. The PageMod will now execute
//        on the pages within blackListed.
//--------------------------------------------------------------------------
function updatePageModInclude() {
  if(mod == null) {
    mod = pageMod.PageMod({
      include: blackListed,
      contentScript: console.log("BlackList Initialized")
    });
  }
  while(mod.include.length != 0) {
    mod.include.remove(mod.include[0]);
  }
  for(var i = 0; i < blackListed.length; i++) {
    mod.include.add(blackListed[i]);
  }
  return mod;
}

//--------------------------------------------------------------------------
//
//  Function: storePreferencesInMemory()
//
//    Parameters: empty
//    
//    Pre-condition: blackList must be defined as a control function
//        in package.json
//    Post-condition: The first for loop iterates through each URL
//        in blackListed. The second for loop iterates through each open
//        tab and checks the page URL for an instance of the blackListed
//        string. If there is a match, showRedirectPanel() is called.
//--------------------------------------------------------------------------
function storePreferencesInMemory() {
  while(memory.storage.blackList.length != 0) {
    memory.storage.blackList.pop(memory.storage.blackList[0]);
  }
  for(var k = 0; k < blackListed.length; k++) {
    memory.storage.blackList.push(blackListed[k]);
  }
  return memory.storage.blackList;
}


//--------------------------------------------------------------------------
//
//  Function: settings.on()
//
//    Parameters:
//        "saveBlackList"; the blacklist control function in package.json
//        function(websites); function that will be executed when the
//            "Save" button is pressed in the add-on preferences menu.
//    
//    Pre-condition: saveBlackList must be defined as a control function
//        in package.json
//        All relevant functions must be defined above.
//    Post-condition: A series of functions will execute, first checking the
//        validity of the blacklist, then updating PageMod, and finally
//        storing the updated blacklist in memory.
//--------------------------------------------------------------------------
settings.on("saveBlackList", function(websites) {
  ensureValidBlackList();  
  updatePageModInclude();
  storePreferencesInMemory();
});


//--------------------------------------------------------------------------
//
//  Function: settings.on()
//
//    Parameters:
//        "OverQuota"; event called when the memory quota is exceeded.
//        function(); function that will be executed when the
//            memory quota is exceeded.
//    
//    Pre-condition: The quotaUsage property indicates the occupied memory
//        as a percentage, represented by a number from 0 to 1. If the
//        value is greater than 1, the quota has been exceeded, and no new
//        data can be stored to memory without first removing old data.
//    Post-condition: While the quotaUsage number is greater than 1,
//        elements from the blacklist will be removed till the quota is in
//        the range of 0 to 1.
//--------------------------------------------------------------------------
memory.on("OverQuota", function () {
  console.log("Quota usage exceeded. Removing data to make room for more.");
  while (memory.quotaUsage > 1)
    memory.storage.blackList.pop();
});

//--------------------------------------------------------------------------
//
//  TO BE IMPLEMENTED IN THE FUTURE: Function: saveWhiteList()
//
//    Parameters:
//        "saveWhitelist"; the whitelist control function in package.json
//        function(websites); function that will be executed when the
//            "Save" button is pressed in the add-on preferences menu.
//    
//    Pre-condition: saveWhiteList must be defined as a control function
//        in package.json
//    Post-condition: The function will define a process for editing and
//        storing new elements for a whitelist in memory.
//
//  REASON FOR NOT IMPLEMENTING:
//
//    The whitelist is defined by a content script, which is accessed by
//        PageMod as a contentScriptFile. If the whitelist were to be
//        edited, the functionality provided by whitelist.js would have to
//        be recoded in main.js. With the current structure of the program,
//        this would result in very sloppy code with poor cohesion. As such,
//        the program would have to be entirely restructured to allow this
//        functionality, and would probably require some convoluted
//        workarounds in the face of limitations of the Firefox SDK that
//        make modularity an issue.
//
//        The whitelist.js script functions as a proof of concept for
//        parsing strings, separated by commas and/or spaces, and then
//        populating an array with the strings, simulating user input.
//--------------------------------------------------------------------------
//
//Basic function skeleton:
//
//settings.on("saveWhiteList", function(websites) {
//  console.log("WhiteList Options (to be implemented)");
//});

//Exports functions for unit testing in test-main.js
exports.modifyPage = modifyPage;
exports.ensureValidBlackList = ensureValidBlackList;
exports.updatePageModInclude = updatePageModInclude;
exports.storePreferencesInMemory = storePreferencesInMemory;

//End of main.js
