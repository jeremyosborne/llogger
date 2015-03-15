/* jshint unused:true, undef:true, node:true */

/*
 * The lame logger. Standardize the level of message using html tag names
 * as logging methods.
 */

var path = require("path");
var util = require("util");
// Just in case colors was not required previously, we need it here.
require("colors");



var argsToArray = function(args) {
    return Array.prototype.slice.call(args);
};



/**
 * If made truthy, all loggers will display caller information,
 * despite their individual settings.
 */
var _globalDisplayCallerInfo = false;

/**
 * Turns on, or off, the display of the caller info, globally overriding
 * all local settings.
 * @param setting {Boolean} If truthy, turns on the display of the
 * caller info for all existing loggers. If falsey, turns it off.
 */
module.exports.globalDisplayCallerInfo = function(setting) {
    _globalDisplayCallerInfo = (setting) ? true : false;
};



var fmixin = {
    /**
     * What line number called this logger method?
     * NOTE: This method is designed to be called from within a logger
     * function and will not work as expected if called outside of the
     * logger.
     */
    _callerInfo: function() {
        if (!this._displayCallerInfo && !_globalDisplayCallerInfo) {
            return "";
        }
        else {
            var callerFrame = (new Error()).stack.split('\n')[3];
            // Got the line number trick from:
            // https://github.com/igo/nlogger
            // in the file:
            // https://github.com/igo/nlogger/blob/master/lib/nlogger.js
            var lineNumber = callerFrame.split(':')[1];
            // Made up the filename trick based on the above.
            var fileName = path.basename(callerFrame.split(/\(|\:/g)[1]);
            return "("+fileName+":"+lineNumber+") ";
        }
    },
    /**
     * Turns on, or off, the display of the caller info.
     * @param setting {Boolean} If truthy, turns on the display of the
     * caller info. If falsey, turns it off.
     */
    displayCallerInfo: function(setting) {
        this._displayCallerInfo = (setting) ? true : false;
    },
    /**
     * Return the current amount of indentation.
     * @return {String} The current indentation.
     * @private
     */
    _getIndent: function() {
        var currentIndent = [];
        var i;
        for (i = 0; i < this._currentIndent; i++) {
            currentIndent[i] = this._singleIndent;
        }
        return currentIndent.join("");
    },
    /**
     * Pass arg to set to make llogger be quiet (no output) or not.
     */
    quiet: function () {
        if (!arguments.length) {
            return this._quiet;
        } else {
            this._quiet = arguments[0];
        }
    },
    /**
     * Increase the indentation level by one.
     */
    indent: function() {
        this._currentIndent += 1;
    },
    /**
     * Decrease the indentation level by one (never goes below 0).
     */
    dedent: function() {
        this._currentIndent -= 1;
        if (this._currentIndent < 0) {
            this._currentIndent = 0;
        }
    },
    /**
     * Print message as a stylized diagnostic section header.
     */
    h1: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo() + this._getIndent() + "#".magenta.bold;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.toUpperCase().magenta.bold.inverse;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
    /**
     * Print message as a stylized diagnostic sub-section header.
     */
    h2: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo() + this._getIndent() + "##".magenta.bold;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.magenta.bold.inverse;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
    /**
     * Print message as a stylized diagnostic sub-sub-section header.
     */
    h3: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo() + this._getIndent() + "###".magenta.bold;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.magenta.bold;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-section header.
     */
    h4: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo() + this._getIndent() + "####".magenta.bold;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.magenta.bold;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-sub-section header.
     */
    h5: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo() + this._getIndent() + "#####".magenta.bold;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.magenta;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-sub-sub-section
     * header.
     */
    h6: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo() + this._getIndent() + "######".magenta.bold;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.toLowerCase().magenta;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
    /**
     * Indent message one level in from the current indentation level.
     */
    li: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo() + this._getIndent() + "*".green;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.green;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
    /**
     * Prints out an 80 character horizontal rule.
     */
    hr: function() {
        if (!this.quiet()) {
            var hr = [];
            for (var i = 0; i < 79; i++) {
                hr[i] = "-";
            }
            console.log(this._callerInfo() + this._getIndent() + hr.join("").green);
        }
    },
    /**
     * Print a regular output message.
     * Output is sent through console.log.
     * (Output is immune to the indentation rules but will print file info.)
     */
    // This will get linked up in the "constructor" function.
    //log: baseLogger,
    /**
     * Print a warning message.
     * Output is sent through console.warn.
     * (Output is immune to the indentation rules but will print file info.)
     */
    warn: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo().yellow + "WARNING:".yellow;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.yellow;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
    /**
     * Print an error message.
     * Output is sent through console.error.
     * (Output is immune to the indentation rules but will print file info.)
     */
    error: function() {
        if (!this.quiet()) {
            var prefix = this._callerInfo().red + "ERROR:".red;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.red;
            }).join(" ");
            console.log.call(console, prefix, args);
        }
    },
};



/**
 * Create a new logger instance.
 */
module.exports.create = function() {
    // Most of this bullshit is because Function.prototype.bind doesn't operate
    // like I thought it would when passing a f() as a thisArg.
    var self = Object.create(fmixin);
    /**
     * Should the caller info be displayed with messages or not?
     * @type {Boolean}
     * @private
     */
    self._displayCallerInfo = false;
    /**
     * What represents a single indentation level?
     * @type {String}
     * @private
     */
    self._singleIndent = "    ";
    /**
     * What is the current indentation level?
     * @type {Number}
     * @private
     */
    self._currentIndent = 0;
    /**
     * Are we quiet or not?
     */
    self._quiet = false;

    // Function that also acts as base object / namespace.
    // Must be bound before calling
    var baseLogger = function() {
        if (!self.quiet()) {
            var prefix = self._callerInfo().green;
            var args = argsToArray(arguments).map(function(a) {
                if (typeof a != "string") {
                    a = util.inspect(a);
                }
                return a.green;
            }).join(" ");
            // This is the only one routinely blank.
            if (prefix) {
                args = prefix + args;
            }
            console.log.call(console, args);
        }
    };

    for (var prop in fmixin) {
        if (fmixin.hasOwnProperty(prop)) {
            // Ugh blargl cthulhu cthulhu beetlegeuse.
            baseLogger[prop] = fmixin[prop].bind(self);
        }
    }
    baseLogger.log = baseLogger;


    // Need to bind here since this function is also used as a generic mixin
    // to the prototype.
    return baseLogger;
};
