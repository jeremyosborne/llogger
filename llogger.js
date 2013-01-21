/*
 * The lame logger. Standardize the level of message using html tag names
 * as logging methods.
 */

var path = require("path");
// Just in case colors was not required previously, we need it here.
var colors = require("colors");



/**
 * Builds an 80 character width underline.
 * @return {String} A string acting as a horizontal rule.
 * @private
 */
var _hr = function() {
    var hr = [];
    var i;
    for (i = 0; i < 79; i++) {
        hr[i] = "-"
    }
    return hr.join("");
};



/**
 * Builds an underline the same size as the message that is passed in.
 * @param message {String} Assumes message is a string.
 * @param c {String} What is the underline sequence to use. Assumes 1 char.
 * @return {String} Underline the length of the message passed in.
 * @private
 */
var _underline = function(message, c) {
    var underline = [];
    var i;
    for (i = 0; i < message.length; i++) {
        underline[i] = c;
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
        console.log(this._callerInfo() + this._getIndent() + _underline(message, "=").magenta.bold.inverse);
    },
    /**
     * Print message as a stylized diagnostic sub-section header.
     * @param message {String} Assumes message is a string.
     */
    "h2": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + message.magenta.bold.inverse);
        console.log(this._callerInfo() + this._getIndent() + _underline(message, "-").magenta.bold.inverse);
    },
    /**
     * Print message as a stylized diagnostic sub-sub-section header.
     * @param message {String} Assumes message is a string.
     */
    "h3": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + "### ".magenta.bold + message.magenta.bold);
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-section header.
     * @param message {String} Assumes message is a string.
     */
    "h4": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + "#### ".magenta.bold + message.magenta.bold);
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-sub-section header.
     * @param message {String} Assumes message is a string.
     */
    "h5": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + "##### ".magenta.bold + message.magenta);
    },
    /**
     * Print message as a stylized diagnostic sub-sub-sub-sub-sub-section 
     * header.
     * @param message {String} Assumes message is a string.
     */
    "h6": function(message) {
        console.log("\n" + this._callerInfo() + this._getIndent() + "###### ".magenta.bold + message.toLowerCase().magenta);
    },    
    /**
     * Indent message one level in from the current indentation level.
     * @param message {String} Assumes message is a string.
     */
    "li": function(message) {
        console.log(this._callerInfo() + this._getIndent() + "* " + message.green);
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
        console.log(this._callerInfo() + this._getIndent() + _hr().green);
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
