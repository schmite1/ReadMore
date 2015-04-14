// Name: Eric Schmitt
// Course: CSC 415
// Semester: Spring 2015
// Instructor: Dr. Pulimood
// Project name: ReadMore
// Description: A Mozilla Firefox add-on that prevents users from browsing certain sites denoted by a customizable blacklist, not by preventing site access entirely, but by redirecting to productive alternative sites for the user to explore.
// Filename: test-main.js
// Description: SDK testing file included in the Mozilla Add-on SDK
// Last modified on: 04/14/15

var main = require("./main");

exports["test main"] = function(assert) {
  assert.pass("Unit test running!");
};

exports["test main async"] = function(assert, done) {
  assert.pass("async Unit test running!");
  done();
};

require("sdk/test").run(exports);
