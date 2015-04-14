var random = Math.floor(Math.random()*2)
var whiteList = ["http://www.gutenberg.org/ebooks/search/?sort_order=downloads", "https://en.wikipedia.org/wiki/Special:Random"]

window.location.replace(whiteList[random]);
