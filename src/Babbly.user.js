// ==UserScript==
// @name           Babbly
// @namespace      http://www.jxdevelopment.com
// @description    Tweet up to 138 words
// @include        http://twitter.com/*
// @include        https://twitter.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js
// @require        http://www.jxdevelopment.com/scripts/babbly/Babbly.min.js
// @require        http://www.jxdevelopment.com/scripts/babbly/charmap-en-v1.js
// ==/UserScript==

// Removed:
// require        http://www.jxdevelopment.com/Babbly/wString.js
// require        http://www.jxdevelopment.com/Babbly/compat.js
// require        http://www.jxdevelopment.com/Babbly/UnicodeMapper.js

// TODO
// * Create chrome extension
// * Make encode button automatically post tweet.
// * Try to hijack loading of tweets instead of using timer.
// * Recalc length after encoding and activate tweet button.
// * Switch too Google Closure Library instead of jQuery
// * Create a simplified version that only replaces words with an emoji or obvious glyph.

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

(function($) {
    // Register menu options
    GM_registerMenuCommand('Decode babbly tweets', Babbly.decodeBabblyTweets, 'l');
    GM_registerMenuCommand('Add encode button', Babbly.addBabblyButton, 'a');

    Babbly.init();

})(jQuery);

