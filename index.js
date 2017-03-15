var _ = require("underscore"),
    child_process = require("child_process");

function init(path) {
  var obj = new R(path);
  return _.bindAll(obj, "data", "call", "callSync");
}

function R(path) {
  this.d = {};
  this.path = path;
  this.options = {
    env: _.extend({DIRNAME: __dirname}, process.env),
    encoding: "utf8"
  };
  this.idCounter = 0;
  this.args = ["--vanilla", __dirname + "/R/launch.R"];
}

R.prototype.data = function() {
  for (var i = 0; i < arguments.length; i++) {
    this.d[++this.idCounter] = arguments[i];
  }
  return this;
};

R.prototype.call = function(_opts, _callback) {
  var callback = _callback || _opts;
  var opts = _.isFunction(_opts) ? {} : _opts;
  this.options.env.input = JSON.stringify([this.d, this.path, opts]);
  var child = child_process.spawn("Rscript", this.args, this.options);
  var body  = {
    out: "",
    err: "",
  }; 
  child.stderr.on("data", function(d){
    body.err += d;
  });
  child.stdout.on("data", function(d) {
    body.out += d;
  });
  child.stderr.on("end", function(){
    if (body.err) callback(new Error(body.err.toString()));
  })
  child.stdout.on("end", function() {
    if (!body.err) callback(null, JSON.parse(body.out));
  });
};

R.prototype.callSync = function(_opts) {
  var opts = _opts || {};
  this.options.env.input = JSON.stringify([this.d, this.path, opts]);
  var child = child_process.spawnSync("Rscript", this.args, this.options);
  if (child.stderr) throw child.stderr;
  return(JSON.parse(child.stdout));
};

module.exports = init;
