# llogger (the lame logger)

This is yet another logger for nodejs. I departed from my previous experience
with loggers and used html tag names as names for the logger methods, attempting
to keep the semantics of the names intact, but with a markdown like flavor.

The itches that this logger scratches for me:

* Most of my output is strings, not objects.
* Simple solution to log synchronous processes where I wanted sections of the output to scream out at me.

What I'm not intending to solve with this logger:

* Not out to recreate console.log or inspect.



## Stability

Sticking with the Node.js stability index, this API is:

```
Stability: 2 - Unstable
```



## Install

`npm install llogger`



## Test (includes visual only tests that demonstrate each method)

Once installed (and you're in the logger/ directory): `npm test`



## Usage

```javascript
// Assuming you want only 1 logger in your file, just create it
// (here using the world's worst variable name).
var l = require("llogger").create();

// NOTE: llogger treats all messages are text strings.
// Standard logging methods with a bit of flavor added.
l.log("normal log message");
l.warn("normal warn message");
l.error("normal error message");
// And why not have HTML tag based methods?
l.h1("Really important message, section header.");
l.h2("Important message, sub-section header.");
l.h3("Somewhat important message, sub-sub-section header.");
l.h4("Sort of important, sub-sub-sub-section header.");
l.h5("Not as important, sub-sub-sub-sub-section header.");
l.h6("Probably not at all important, sub-sub-sub-sub-sub-section header.");
l.p("Equivalent to a normal log message.");
l.li("List item.");
// The following will print an 80 character horizontal rule.
l.hr();

// Increase the indentation level for this logger.
l.indent();
l.p("This is now indented one level.");
l.log("log, warn, and error messages are immune to indentation.");
// Decrease the indentation level for this logger.
l.dedent();
l.p("No longer indented.");

// Turn on filename and linenumber display on this logger instance.
l.displayCallerInfo(true);
l.p("This will now display the module name and line number from where it is called.");
// Turn off filename and linenumber display on this logger instance.
l.displayCallerInfo(false);

// Turn on filename and linenumber display globally across all loggers,
// overriding the logger instance setting.
require("llogger").globalDisplayCallerInfo(true);
// Turn off filename and linenumber display globally across all loggers,
// deferring to the logger instance setting.
require("llogger").globalDisplayCallerInfo(false);
```



## Credits

Rarely is software created in a vacuum, and that includes this lame logger.
In addition to the modules referenced in the package.json file, I give credit
to:

* Igor Urminček (nlogger at https://github.com/igo/nlogger) for how to get caller module name and line number.
