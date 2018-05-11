var _ = require("underscore"),
    child_process = require("child_process");
    // const file = require.resolve('./bin/R.framework/Resources/bin/Rscript');
    const file = require.resolve('./bin_legacy/Rscript');
    console.log(`file: ${file}`);

function init(path) {
  var obj = new R(path);
  _.bindAll(obj, "data", "call", "callSync");
  return obj;
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
  var child = child_process.spawn(file, _opts);
  var body = "";
  child.stderr.on("data", function(d) {
    body += d;
  });
  child.stdout.on("data", function(d) {
    // console.log(d.toString('utf8'));
     body += d;
  });
  child.on("close", function(code) {
    console.log('close '+code);
    callback(body);
  });
};

R.prototype.callSync = function(_opts) {
  var opts = _opts || {};
  this.options.env.input = JSON.stringify([this.d, this.path, opts]);
  var child = child_process.spawnSync(file, this.args, this.options);
  if (child.stderr) throw child.stderr;
  return(child.stdout);
};

module.exports = init;
