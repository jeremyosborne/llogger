var loggerModule = require('../llogger.js'); 

exports["file info"] = function(test) {
    var l = loggerModule.create();

    // NOTE: Testing the following function is a pain, because we
    // assume that it is being called only from within one of the logger
    // methods.
    // We mimic that by placing it inside of an anonymous function.
    // NOTE 2: This function is sensitive to line number in this file.
    // Better to place this test at the top of the file.

    // Turn on file info.
    l.displayCallerInfo(true);
    test.strictEqual((function() { return l._callerInfo()})(), "(llogger.js:15) ", 
        "Positive file info test. (If failing, make sure this sensitive test hasn't been moved)." );
    // Turn off file info.
    l.displayCallerInfo(false);

    test.strictEqual((function() { return l._callerInfo()})(), "", 
        "Negative file info test." );

    // Sensitive, remember to turn this off before leaving this function.
    loggerModule.globalDisplayCallerInfo(true);
    test.strictEqual((function() { return l._callerInfo()})(), "(llogger.js:25) ", 
        "Positive global file info test. (If failing, make sure this sensitive test hasn't been moved)." );
    // Turn the global off.
    loggerModule.globalDisplayCallerInfo(false);    
    test.strictEqual((function() { return l._callerInfo()})(), "", 
        "Negative global file info test." );
    
    test.done();
};


exports["indentation"] = function(test) {
    // Create a local instance.
    var l = loggerModule.create();
    
    test.strictEqual(l._currentIndent, 0, "Expected default indentation value.");
    
    l.indent();
    test.strictEqual(l._currentIndent, 1, "Expected indentation value.");
    l.indent();
    test.strictEqual(l._currentIndent, 2, "Expected indentation value.");
    
    l.dedent();
    l.dedent();
    test.strictEqual(l._currentIndent, 0, "Expected indentation value.");
    
    l.dedent();
    test.strictEqual(l._currentIndent, 0, "Indentation value doesn't go below zero.");
    
    test.done();
};

exports["blackbox sanity tests"] = function (test) {
    
    var l = loggerModule.create();

    console.log("");
    console.log("--> Beginning of logger sanity tests. Tests are visual.");
    l.h1("This is an h1 (heading) log message.");
    l.h2("This is an h2 (sub-heading) log message.");
    l.h3("This is an h3 (sub-sub-heading) log message.");
    l.h4("This is an h4 (sub-sub-sub-heading) log message.");
    l.h5("This is an h5 (sub-sub-sub-sub-heading) log message.");
    l.h6("This is an h6 (sub-sub-sub-sub-sub-heading) log message.");
    l.li("This is an li log message.");
    l.hr();
    l.log("This is a normal log message.");
    l.warn("This is a warn message.");
    l.error("This is an error message.");
    console.log("--> Ending of logger sanity tests.");
    console.log("");
    
    test.done();
};

exports["blackbox indentation tests"] = function (test) {

    var l = loggerModule.create();

    // Everything should be indented one level more than usual.
    l.indent();

    console.log("");
    console.log("--> Beginning of logger indentation tests. Tests are visual.");
    l.h1("This is an h1.");
    l.h2("This is an h2.");
    l.h3("This is an h3.");
    l.h4("This is an h4.");
    l.h5("This is an h5.");
    l.h6("This is an h6.");
    l.li("This is an li.");
    l.hr();
    l.log("This is a normal log message (should not be indented).");
    l.warn("This is a warn message (should not be indented).");
    l.error("This is an error message (should not be indented).");
    console.log("--> Ending of logger indentation tests.");
    console.log("");
    
    l.dedent();
    
    test.done();
};

exports["blackbox fileinfo tests"] = function (test) {

    var l = loggerModule.create();

    // Everything should show file information.
    l.displayCallerInfo(true);

    console.log("");
    console.log("--> Beginning of logger file info tests. Tests are visual.");
    l.h1("This is an h1.");
    l.h2("This is an h2.");
    l.h3("This is an h3.");
    l.h4("This is an h4.");
    l.h5("This is an h5.");
    l.h6("This is an h6.");
    l.li("This is an li.");
    l.hr();
    l.log("This is a normal log message.");
    l.warn("This is a warn message.");
    l.error("This is an error message.");
    console.log("--> Ending of logger file info tests.");
    console.log("");
    
    test.done();
};

