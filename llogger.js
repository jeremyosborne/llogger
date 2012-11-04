/*
 * Simple message logger to standardize diagnostic output, in the flavor
 * of HTML names for the messages.
 * 
 * Usage:
 * // I like to use the worst identifier name ever for my loggers.
 * // Assuming you want only 1 logger in your file, just create it.
 * var l = require("llogger").create();
 * // NOTE: Assumes all messages are text strings.
 * // Standard logging methods with a bit of flavor added.
 * l.log("normal log message");
 * l.warn("normal warn message");
 * l.error("normal error message");
 * // And because I spend most of my time in HTML, I thought why not have
 * // tag based messages (I know, lame idea, but I like it):
 * l.h1("Really important message, section header.");
 * l.h2("Important message, sub-section header.");
 * l.h3("Somewhat important message, sub-sub-section header.");
 * l.h4("Sort of important, sub-sub-sub-section header.");
 * l.h5("Not as important, sub-sub-sub-sub-section header.");
 * l.h6("Probably not at all important, sub-sub-sub-sub-sub-section header.");
 * l.p("Equivalent to a normal log message.");
 * l.li("Indented one level in from the current indent.");
 * // The following will print an 80 character horizontal rul.
 * l.hr();
 * // The following will increase the indentation level by 1.
 * l.indent();
 * l.p("This, and the other 'html' tag messages are indented.");
 * l.log("The log, warn, and error messages are immune to indentation.");
 * // The following will decrease the indentation level by 1.
 * l.dedent();
 * l.p("No longer indented.");
 * // Turn on filename and linenumber display on this logger instance.
 * l.displayCallerInfo(true);
 * // Turn off filename and linenumber display on this logger instance.
 * l.displayCallerInfo(false);
 * // Turn on filename and linenumber display globally across all loggers,
 * // overriding the logger instance setting.
 * require("llogger").globalDisplayCallerInfo(true);
 * // Turn off filename and linenumber display globally across all loggers,
 * // deferring to the logger instance setting.
 * require("llogger").globalDisplayCallerInfo(false);
 */

var path = require("path");
// Just in case colors was not required previously, we need it here.
var colors = require("colors");



/*
 * Title Caps
 * 
 * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
 * License: http://www.opensource.org/licenses/mit-license.php
 * 
 * (with very, very minor changes by me to make it fit more with my logger
 *  code.)
 */
var _toTitleCase = function(title) {
    var parts = [], 
        split = /[:.;?!] |(?: |^)["Ò]/g, 
        index = 0;

    var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
    var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

    var lower = function(word) {
        return word.toLowerCase();
    };
    
    var upper = function(word) {
      return word.substr(0,1).toUpperCase() + word.substr(1);
    };
    
    while (true) {
        var m = split.exec(title);

        parts.push( title.substring(index, m ? m.index : title.length)
            .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
                return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
            })
            .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
            .replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
                return punct + upper(word);
            })
            .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));
        
        index = split.lastIndex;
        
        if ( m ) parts.push( m[0] );
        else break;
    }
    
    return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
        .replace(/(['Õ])S\b/ig, "$1s")
        .replace(/\b(AT&T|Q&A)\b/ig, function(all){
            return all.toUpperCase();
        });
};



/**
 * Builds an 80 character width underline.
 * @return {String} A string acting as a horizontal rule.
 * @private
 */
var _hr = function() {
    var hr = [];
    var i;
    for (i = 0; i < 80; i++) {
        hr[i] = "="
    }
    return hr.join("");
};



/**
 * Builds an underline the same size as the message that is passed in.
 * @param message {String} Assumes message is a string.
 * @return {String} Underline the length of the message passed in.
 * @private
 */
var _underline = function(message) {
    var underline = [];
    var i;
    for (i = 0; i < message.length; i++) {
        underline[i] = "="
    }
    return underline.join("");
};



/**
 * Prototype for the logger instances.
 * @private
 */
var _loggerPrototype = {
    /**
     * Should the caller info be displayed with messages or not?
     * @type {Boolean}
     * @private
     */
    "_displayCallerInfo": false,
    /**
     * What line number called this logger method?
     * NOTE: This method is designed to be called from within a logger
     * function and will not work as expected if called outside of the
     * logger.
     * @private
     */
    "_callerInfo": function() {
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
    "displayCallerInfo": function(setting) {
        this._displayCallerInfo = (setting) ? true : false;
    },
    /**
     * What represents a single indentation level?
     * @type {String}
     * @private
     */
    "_singleIndent": "    ",
    /**
     * What is the current indentation level?
     * @type {Number}
     * @private
     */
    "_currentIndent": 0,
    /**
     * Return the current amount of indentation.
     * @return {String} The current indentation.
     * @private
     */
    "_getIndent": function() {
        var currentIndent = [];
        var i;
        for (i = 0; i < this._currentIndent; i++) {
            currentIndent[i] = this._singleIndent;
        }
        return currentIndent.join("");
    },
    /**
     * Increase the indentation level by one.
     */
    "indent": function() {
        this._currentIndent += 1;
    },
    /**
     * Decrease the indentation level by one (never goes below 0).
     */
    "dedent": function() {
        this._currentIndent -= 1;
        if (this._currentIndent < 0) {
            this._currentIndent = 0;
        }
    },
    /**
     * Print message as a stylized diagnostic section header.
     * @param message {String} Assumes message is a string.
     */
    "h1": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + message.toUpperCase().magenta.bold.inverse);
        console.log(this._getIndent() + _hr().magenta.bold.inverse);
    },
    /**
     * Print message as a stylized diagnostic sub-section header.
     * @param message {String} Assumes message is a string.
     */
    "h2": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + message.toUpperCase().magenta.bold.inverse);
        console.log(this._getIndent() + _underline(message).magenta.bold.inverse);
    },
    /**
     * Print message as a stylized diagnostic sub-sub-section header.
     * @param message {String} Assumes message is a string.
     */
    "h3": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + message.toUpperCase().magenta.bold);
        console.log(this._getIndent() + _underline(message).magenta.bold);
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-section header.
     * @param message {String} Assumes message is a string.
     */
    "h4": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + _toTitleCase(message).magenta.bold);
        console.log(this._getIndent() + _underline(message).magenta.bold);
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-sub-section header.
     * @param message {String} Assumes message is a string.
     */
    "h5": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + _toTitleCase(message).magenta.bold);
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-sub-sub-section 
     * header.
     * @param message {String} Assumes message is a string.
     */
    "h6": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + message.toLowerCase().magenta.bold);
    },    
    /**
     * Indent message one level in from the current indentation level.
     * @param message {String} Assumes message is a string.
     */
    "li": function(message) {
        console.log(this._callerInfo() + this._getIndent() + this._singleIndent + message.green);
    },
    /**
     * Print a normal message to stdout, shorthand for log.
     * @param message {String} Assumes message is a string.
     */
    "p": function(message) {
        console.log(this._callerInfo() + this._getIndent() + message.green);
    },
    /**
     * Prints out an 80 character horizontal rule.
     */
    "hr": function() {
        console.log(this._getIndent() + _hr().green);
    },
    /**
     * Print a regular output message.
     * Output is sent through console.log.
     * (Output is immune to the indentation rules but will print file info.)
     * @param message {String} Assumes message is a string.
     */
    "log": function(message) {
        console.log(this._callerInfo().green + message.green);
    },
    /**
     * Print a warning message.
     * Output is sent through console.warn.
     * (Output is immune to the indentation rules but will print file info.)
     * @param message {String} Assumes message is a string.
     */
    "warn": function(message) {
        console.warn(this._callerInfo().yellow + "WARNING: ".yellow + message.yellow);
    },
    /**
     * Print an error message.
     * Output is sent through console.error.
     * (Output is immune to the indentation rules but will print file info.)
     * @param message {String} Assumes message is a string.
     */
    "error": function(message) {
        console.error(this._callerInfo().red + "ERROR:".red + " " + message.red);
    },
};

/**
 * If made truthy, all loggers will display caller information,
 * despite their individual settings.
 */
var _globalDisplayCallerInfo = false

/**
 * Turns on, or off, the display of the caller info, globally overriding
 * all local settings.
 * @param setting {Boolean} If truthy, turns on the display of the
 * caller info for all existing loggers. If falsey, turns it off.
 */
module.exports.globalDisplayCallerInfo = function(setting) {
    _globalDisplayCallerInfo = (setting) ? true : false;
};

/**
 * Create a new logger instance.
 */
module.exports.create = function() {
    return Object.create(_loggerPrototype);
};
