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

var isCommonJS = typeof window == "undefined";

/**
 * Top level namespace for Babbly, a class to write tweets longer than 140 characters.
 *
 * @namespace
 * @export
 */
var Babbly = {};
if (isCommonJS) exports.Babbly = Babbly;

(function() {
    var tweet_count = 0;
    var marker = String.fromCharCode(parseInt('200b', 16));

    /**
     * Characters that are used to define a Babbly tweet.
     * @type {String}
     * @private
     */
    var encodeMarker = marker + marker;
    var marklen = encodeMarker.length;

    /**
     * Number of milliseconds between each run of tweet decoding.
     * @type {Number}
     * @private
     */
    var updateInterval = 500;

    /**
     * XPaths to grab necessary parts of the twitter page.
     * @type {Object}
     * @private
     */
    var xpath = {
       'tweet': 'p.js-tweet-text',
       'textarea': 'textarea.twitter-anywhere-tweet-box-editor',
       'button': '.tweet-button'
    };

    /**
     * @fn init
     *
     * Initialize Babbly and start timer to automatically update tweets.
     */
    this.init = function init() {
        //window.console && console.log('Setting up Babbly');
        timer();
    };

    /**
     * @fn setXPaths
     *
     * Update the list of xpaths used to modify the twitter page.
     *
     * @param {Object} xpaths Object hash containing xpaths for: tweet, textarea, button
     */
    this.setXPaths = function setXPaths(xpaths) {
        xpath = $.extend(xpath, xpaths);
    };

    /**
     * @fn setUpdateInterval
     *
     * Set the update interval.
     * 
     * @param {Number} msecs Milliseconds between updates.
     */
    this.setUpdateInterval = function setUpdateInterval(msecs) {
        updateInterval = msecs;
    };

    /**
     * @fn setEncodeMarker
     *
     * Set the marker used at beginning of tweets to mark them as babbly.
     *
     * @param {String} marker String of characters to define tweets to decode.
     */
    this.setEncodeMarker = function setEncodeMarker(marker) {
        encodeMarker = marker;
        marklen = encodeMarker.length;
    };

    /**
     * @fn addBabblyButton
     *
     * Add button to encode long tweet next to input field.
     */
    this.addBabblyButton = function addBabblyButton() {
        //window.console && console.log('Adding long tweet button');
        var $BabblyBtn = $('<a>')
            .addClass('babbly-tweet-button btn')
            .attr('href', '#')
            .text('Babble')
            .click(this.babble);
        $(xpath.button).before($BabblyBtn);
    };

    /**
     * @fn decodeBabblyTweets
     *
     * Decode all Babbly tweets on page.
     */
    this.decodeBabblyTweets = function decodeBabblyTweets() {
        //window.console && console.log('Decoding all long tweets on page.');
        // Grab all tweets on page
        $(xpath.tweet).each(
            function(idx) {
                var tweet, decode = false, decodedText;
                //window.console && console.log('Decoding tweet...');
                tweet = new wString($(this).text());
                //window.console && console.log('Tweet:', tweet);
                //window.console && console.log('Decode marker:', encodeMarker);
                if (tweet.substr(0, marklen) === encodeMarker) decode = true;
                //window.console && console.log('Decode:', decode);
                decodedText = decode ? UnicodeMapper.decode(tweet.substr(marklen)) : '';
                //window.console && console.log('Decoded tweet:', decodedText);
                if (decode && tweet.toString() != decodedText) {
                    //window.console && console.log('Replacing tweet...');
                    $(this).text(decodedText);
                }
            }
        );
    };

    /**
     * @fn babble
     *
     * Encode text in tweet box and post.
     *
     * @param {Object=} ev Event object.
     */
    this.babble = function babble(ev) {
        var str, tweet;
        //window.console && console.log('Encoding and posting long tweet.');
        str = $(xpath.textarea).val();
        //window.console && console.log('Old tweet:', str);
        if (!str) return;
        tweet = UnicodeMapper.encode(str);
        //window.console && console.log('Encoded tweet:', tweet);
        if (str !== tweet) {
            $(xpath.textarea).val(encodeMarker + tweet);
            //window.console && console.log('Automatic long tweet disabled.');
            //$('.tweet-button').click();
        }
    };

    /**
     * @fn timer
     *
     * Timer to automatically decode new tweets.
     *
     * @private
     */
    function timer() {
        // Decode babbly tweets if number of tweets on page has changed.
        var count = $(xpath.tweet).length;
        if (count != tweet_count) {
            this.decodeBabblyTweets();
            tweet_count = count;
        }

        // Add babbly button if it doesn't exist and normal tweet button is available.
        if ($('a.babbly-tweet-button').length == 0 && $(xpath.button).length > 0) {
            this.addBabblyButton();
        }

        // Reset timer
        setTimeout(timer, updateInterval);
    }

}).apply(Babbly);

Babbly.version_= {
  "major": 1,
  "minor": 0,
  "build": 0,
  "revision": 1
};

