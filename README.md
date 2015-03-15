# llogger (the lame logger)
This is yet another logger for nodejs. I departed from my previous experience with markdown friendly HTML tag names, along with the basic log functions I expect.



## Stability
Using the [Node.js](http://nodejs.org/api/documentation.html#documentation_stability_index) stability index, this API is:

```
Stability: 2 - Unstable
```



## Install

    npm install llogger



## Test (includes visual only tests that demonstrate each method)
Once installed (and you're in the logger/ directory):

    npm test



## Usage

```javascript
// Assuming you want only 1 logger in your file, just create it
// (using the world's worst variable name).
var l = require("llogger").create();

// Standard logging methods with a bit of flavor added.
// Pretty much the same syntax as console.log().

l("normal log message"); // equivalent to l.log
l.log("normal log message");
l.warn("normal warn message");
l.error("normal error message");
// And why not have HTML tag based methods?
l.h1("Section header.");
l.h2("Sub-section header.");
l.h3("Sub-sub-section header.");
l.h4("Sub-sub-sub-section header.");
l.h5("Sub-sub-sub-sub-section header.");
l.h6("Sub-sub-sub-sub-sub-section header.");
l.li("List item.");
// Print an 80 character horizontal rule.
l.hr();

// Increase the indentation level for this logger.
l.indent();
l.li("This is now indented one level.");
l.log("log, warn, and error messages are immune to indentation.");
// Decrease the indentation level for this logger.
l.dedent();
l.li("No longer indented.");

// Turn on filename and linenumber display on this logger instance.
l.displayCallerInfo(true);
l.log("This will now display the module name and line number from where it is called.");
// Turn off filename and linenumber display on this logger instance.
l.displayCallerInfo(false);

// Tell a logger instance to be quiet.
l.quiet = true;
l("won't see this");

// Turn on filename and linenumber display globally across all loggers,
// overriding the logger instance setting.
require("llogger").globalDisplayCallerInfo(true);
// Turn off filename and linenumber display globally across all loggers,
// deferring to the logger instance setting.
require("llogger").globalDisplayCallerInfo(false);
```



## Credits

Rarely is software created in a vacuum, and that includes this lame logger. In addition to the modules referenced in the package.json file, I give credit to:

* Igor Urminček (nlogger at https://github.com/igo/nlogger) for how to get caller module name and line number.
