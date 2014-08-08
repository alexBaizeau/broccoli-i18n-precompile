var fs = require('fs');
var handlebars = require('handlebars');
var util = require('util');
var Writer = require('broccoli-writer');
var walkSync = require('walk-sync');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = Precompiler;

function Precompiler(inputTree, options) {

  if (!(this instanceof Precompiler)) {
    return new Precompiler(inputTree, options);
  }
  this.options = options || {};
  this.inputTree = inputTree;
}

util.inherits(Precompiler, Writer);


Precompiler.prototype.write = function(readTree, destDir) {

  var precompiler = this;
  var outputPath = path.join(destDir, precompiler.options.destDir || '');


  var unescape = function(v) { eval('v = "'+v+'"'); return v; };

  return readTree(this.inputTree).then(function(srcDir) {
    walkSync(srcDir).forEach(function(relPath) {
      if (path.extname(relPath) === '.js') {
        var srcPath = path.join(srcDir, relPath);
        var destPath = path.join(outputPath, relPath);
        var src = fs.readFileSync(srcPath, {encoding: 'utf8'});

        mkdirp.sync(path.dirname(destPath));
        var result = src.replace(/:\s*["'](.*)["'](,?)/gi, function(match, p1, p2) {
          var unescaped = unescape(p1);
          var res = handlebars.precompile(unescaped);
          return ": t(" + res.toString() + ")" + (p2 || ""); // We need to add back the colon and possibly the comma at the end
        });

        result =
          "(function() {\n" +
          "var t = Handlebars.template;\n" +
          result +
          "})();";
        fs.writeFileSync(destPath, result, { encoding: 'utf8' });
      }
    });
  });
};
