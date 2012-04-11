// Spec test file for utf8map
load('bootstrap.js');
load('../src/wString.js');
//load('wStringSpec.js');
load('../src/utf8map.js');
load('utf8mapSpec.js');

function doneFn() {
    print("All done! Now you get a cookie.");
}

var reporter = new jasmine.ConsoleReporter(print, doneFn, true);
jasmine.getEnv().addReporter(reporter);
jasmine.getEnv().execute();
