var Jasmine = require('jasmine');
var jasmine = new Jasmine();


console.log(__dirname);

jasmine.loadConfig({
  spec_files: [
    __dirname + '/spec/*.js',
  ],
  helpers: [
    __dirname + '/helpers/shim.js',
    __dirname + '/helpers/helper.js',
  ]
});

jasmine.execute();
