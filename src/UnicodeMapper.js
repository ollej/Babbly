/*
The MIT License

Copyright (c) 2012 Olle Johansson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// TODO: Keep track of unmapped words somehow.

var isCommonJS = typeof window == "undefined";

/**
 * Top level namespace for UnicodeMapper, a class to encode words into utf8 characters.
 *
 * @namespace
 * @export
 */
var UnicodeMapper = {};
if (isCommonJS) exports.UnicodeMapper = UnicodeMapper;

(function() {
    /**
     * Should be set with real map using UnicodeMapper.setMap(map)
     * @private
     * @type {Object.<string, string>}
     */
    var charMap = {
        '☃': 'SNOWMAN',
        '♥': 'HEART'
    };

    /**
     * @fn getMap
     *
     * Return a reference to the entire character map.
     *
     * @return {Object.<string, string>} Character map.
     */
    this.getMap = function getMap() {
        return charMap;
    };

    /**
     * @fn setMap
     *
     * Replaces the charMap with a new map.
     *
     * @param {Object.<string, string>} map Character map to set.
     */
    this.setMap = function setMap(map) {
        charMap = map;
    };

    /**
     * @fn clean
     *
     * Cleans a string by trimming and removing multiple consecutive spaces.
     *
     * @param {String} text Text to clean up.
     * @return {String} Cleaned up string.
     */
    this.clean = function clean(text) {
        text = text.trim();
        text = text.replace(/\s+/g, ' ');
        return text;
    };

    /**
     * @fn translate
     *
     * Translate a character into a word based on charMap.
     *
     * @param {String} c Character
     * @return {String} Word for character c.
     */
    this.translate = function translate(c) {
        var word = charMap[c];
        if (word) word = word.toLowerCase();
        return word;
    };

    /**
     * @fn getChar
     *
     * Returns the character for a given word by looping through
     * the entire character map. Not very efficient.
     *
     * @todo Create a cache for found words.
     *
     * @param {String} word Word to find character for.
     * @return {String} Character for the given word.
     */
    this.getChar = function getChar(word) {
        var w, idx;
        if (!word.toUpperCase) return undefined;
        word = word.toUpperCase();
        for (var c in charMap) if (charMap.hasOwnProperty(c)) {
            w = charMap[c];
            if (w === word) {
                return c;
            }
        }
        return undefined;
    };

    /**
     * @fn decode
     *
     * Decode utf8 glyphs into words based on a character map.
     *
     * @todo Ignore html
     * @todo Remove space before punctuation.
     *
     * @param {String} text Text to decode
     * @return {String} Decoded text
     */
    this.decode = function decode(text) {
        if (!text.charAt) return '';
        var wstr = new wString(text);
        var str = '', lastword = '';
        for (var i = 0, len = wstr.length; i < len; i++) {
            var c = wstr.charAt(i);
            var word = this.translate(c);
            //print('translating: ' + c + ' at pos: ' + i);
            //window.console && console.log('translating: ', c, ' at pos: ', i);
            //if (lastword && word) str += ' ';
            if (word || (lastword && !this.ispunct(c))) str += ' ';
            str += word || c;
            lastword = word;
        }
        return this.clean(str);
    };

    /**
     * @fn encode
     *
     * Encode a text by mapping words to UTF8 glyphs.
     *
     * @todo Support links/html
     * @todo Possibly support phrases (words with spaces)
     * @todo Possibly handle regular conjugated words, regular plural nouns and contractins.
     *
     * @param {String} text Text to encode
     * @return {String} Encoded text
     */
    this.encode = function encode(text) {
        if (!text.split) return '';
        text = this.clean(text);
        var words = text.toUpperCase().split(/\b/),
            str = '', w = '', idx, trans = text.split(/\b/);
        // TODO: Possibly loop through words and translate each instead.
        //       Not as efficient, but would be able to use cache.
        // Loop through entire text map and replace each word found.
        for (var c in charMap) if (charMap.hasOwnProperty(c)) {
            w = charMap[c];
            idx = words.indexOf(w);
            if (idx > -1) {
                trans[idx] = c;
            }
        }
        // Build decoded strings from translated array.
        var last_was_word = false;
        for (var i = 0, len = trans.length; i < len; i++) {
            //print ('trans[' + i + '] = ' + trans[i]);
            //print ('words[' + i + '] = ' + words[i]);
            // Don't add space if last word wasn't translated.
            // TODO: Add space before between translated character and untranslated word.
            if (!(!last_was_word && trans[i] == ' ')) {
                str += trans[i];
            }
            // Check if this word was translated.
            last_was_word = (trans[i].toUpperCase() == words[i]);
        }
        return this.clean(str);
    };

    /**
     * @fn ispunct
     * 
     * Checks if a characters is a punctuation character.
     * 
     * @param {String} c Character
     * @return {Boolean} true if character is punctuation
     */
    this.ispunct = function ispunct(c) {
        return ('[.,-/#?!$%^&*;:{}=-_"`\'~()]'.indexOf(c) !== -1);
    };

}).apply(UnicodeMapper);

UnicodeMapper.version_= {
  "major": 1,
  "minor": 0,
  "build": 0,
  "revision": 1
};

