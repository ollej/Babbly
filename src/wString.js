// wString by BentFX - http://stackoverflow.com/users/710913/bentfx
// http://stackoverflow.com/questions/6885879/javascript-and-string-manipulation-w-utf-16-surrogate-pairs
function wString(str) {
    var T = this; //makes 'this' visible in functions
    T.cp = [];    //code point array
    T.length = 0; //length attribute
    T.wString = true; // (item.wString) tests for wString object

    //member functions

    /**
     * @fn sortSurrogates
     * Returns array of utf-16 code points.
     */
    sortSurrogates = function(s) {  
        var chrs = [];
        // Loop till we've done the whole string.
        while (s.length) {
            // Test the first character.
            if (/[\uD800-\uDFFF]/.test(s.substr(0, 1))) { 
                // High surrogate found low surrogate follows
                // Push the two onto array
                chrs.push(s.substr(0, 2)); 
                // Clip the two off the string
                s = s.substr(2);         
            } else {                     
                // BMP code point
                // Push one onto array
                chrs.push(s.substr(0, 1));
                // Clip one from string
                s = s.substr(1);         
            }
        }
        return chrs;
    };
    //end member functions

    //prototype functions
    T.substr = function(start, len) {
        if (len) {
            return T.cp.slice(start, start + len).join('');
        } else {
            return T.cp.slice(start).join('');
        }
    };

    T.substring = function(start, end) {
        return T.cp.slice(start, end).join('');
    };

    T.replace = function(target, str) {
        // Allow wStrings as parameters.
        if (str.wString) str = str.cp.join('');
        if (target.wString) target = target.cp.join('');
        return T.toString().replace(target, str);
    };

    T.equals = function(s) {
        if (!s.wString) {
            s = sortSurrogates(s);
            T.cp = s;
        } else {
            T.cp = s.cp;
        }
        T.length = T.cp.length;
    };

    T.charAt = function(pos) {
        return T.substr(pos, 1);
    };

    T.toString = function() {
        return T.cp.join('');
    };
    //end prototype functions

    T.equals(str)
};

