#Broccoli i18n template precompiler

I use it with ember-cli

exemple

```js
var mergeTrees = require('broccoli-merge-trees');
var compileES6 = require('broccoli-es6-concat');
var i18nPrecompile = require('broccoli-i18n-precompile');
var pickFiles = require('broccoli-static-compiler');


var translationTree = pickFiles('i18nFolder', {
  srcDir: '/',
  files: ['i18n/*.js'],
  destDir: app.name
});

var appTranslations = compileES6(translationTree, {
  outputFile: '/assets/i18n.js',
  inputFiles: ['**/*.js'],
  wrapInEval: false,
});

var precompiledTrans = i18nPrecompile(appTranslations);

```

It will generate a precompiled js file that you can include in your index.html file

It is important to set wrapInEval to false;
