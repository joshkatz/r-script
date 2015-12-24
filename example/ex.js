#!/usr/bin/env node
var R = require("r-script");

// sync
var out = R("example/ex-sync.R")
  .data("hello world", 20)
  .callSync();
console.log(out);

// async
var attitude = JSON.parse(
  require("fs").readFileSync("example/attitude.json", "utf8"));

R("example/ex-async.R")
  .data({df: attitude, nGroups: 3, fxn: "mean" })
  .call(function(err, d) {
    if (err) throw err;
    console.log(d);
  });