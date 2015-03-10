(function(root, factory) {
    'use strict';
    /* globals module, define, require */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['es6-pomise'], function(promise) {
            promise.polyfill();
            return factory(root);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var Promise = require('es6-promise').polyfill();
        module.exports = factory(root);
    } else if (root !== undefined) {
        if (root.ES6Promise !== undefined && typeof root.ES6Promise.polyfill === 'function') {
            root.ES6Promise.polyfill();
        }
        root.corbel = factory(root);
    }

})(this, function(root) {
    'use strict';
    /* jshint unused: false */

    var corbel = {};

    //-----------Utils and libraries (exports into corbel namespace)---------------------------

    (function() {
        /**
         * A module to some library utils.
         * @exports validate
         * @namespace
         * @memberof app
         */
        var utils = corbel.utils = {};
    
        /**
         * Extend a given object with all the properties in passed-in object(s).
         * @param  {Object}  obj
         * @return {Object}
         */
        utils.extend = function(obj) {
            Array.prototype.slice.call(arguments, 1).forEach(function(source) {
                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        };
    
        utils.reload = function() {
            // console.log('utils.reload');
            if (window) {
                window.location.reload();
            }
        };
    
        return utils;
    
    })();


    (function() {
    
        /**
         * A module to make values validation.
         * @exports validate
         * @namespace
         * @memberof app
         */
        var validate = corbel.validate = {};
    
        /**
         * Checks if some value is not undefined
         * @param  {Mixed}  value
         * @param  {String}  [message]
         * @throws {Error} If return value is false and message are defined
         * @return {Boolean}
         */
        validate.isDefined = function(value, message) {
            var isUndefined = value === undefined;
    
            if (isUndefined && message) {
                throw new Error(message);
            }
            return !isUndefined;
        };
    
        /**
         * Checks if some value is defined and throw error
         * @param  {Mixed}  value
         * @param  {String}  [message]
         * @throws {Error} If return value is false and message are defined
         * @return {Boolean}
         */
    
        validate.failIfIsDefined = function(value, message) {
            var isDefined = value !== undefined;
    
            if (isDefined && message) {
                throw new Error(message);
            }
            return !isDefined;
        };
    
        /**
         * Checks whenever value are null or not
         * @param  {Mixed}  value
         * @param  {String}  [message]
         * @throws {Error} If return value is false and message are defined
         * @return {Boolean}
         */
        validate.isNotNull = function(value, message) {
            var isNull = value === null;
    
            if (isNull && message) {
                throw new Error(message);
            }
            return !isNull;
        };
    
        /**
         * Checks whenever a value is not null and not undefined
         * @param  {Mixed}  value
         * @param  {String}  [message]
         * @throws {Error} If return value is false and message are defined
         * @return {Boolean}
         */
        validate.isValue = function(value, message) {
            return this.isDefined(value, message) && this.isNotNull(value, message);
        };
    
        /**
         * Checks whenever a value is greater than other
         * @param  {Mixed}  value
         * @param  {Mixed}  greaterThan
         * @param  {String}  [message]
         * @throws {Error} If return value is false and message are defined
         * @return {Boolean}
         */
        validate.isGreaterThan = function(value, greaterThan, message) {
            var gt = this.isValue(value) && value > greaterThan;
    
            if (!gt && message) {
                throw new Error(message);
            }
            return gt;
        };
    
        /**
         * Checks whenever a value is greater or equal than other
         * @param  {Mixed}  value
         * @param  {Mixed} isGreaterThanOrEqual
         * @param  {String}  [message]
         * @throws {Error} If return value is false and message are defined
         * @return {Boolean}
         */
        validate.isGreaterThanOrEqual = function(value, isGreaterThanOrEqual, message) {
            var gte = this.isValue(value) && value >= isGreaterThanOrEqual;
    
            if (!gte && message) {
                throw new Error(message);
            }
            return gte;
        };
    
        return validate;
    
    })();


    /* jshint camelcase:false */
    corbel.cryptography = (function() {
        'use strict';
        /*
         * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
         * in FIPS 180-2
         * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
         * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
         * Distributed under the BSD License
         * See http://pajhome.org.uk/crypt/md5 for details.
         * Also http://anmar.eu.org/projects/jssha2/
         */
    
        /*
         * Configurable variables. You may need to tweak these to be compatible with
         * the server-side, but the defaults work in most cases.
         */
        var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
        var b64pad = ''; /* base-64 pad character. "=" for strict RFC compliance   */
    
        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_sha256(s) {
            return rstr2hex(rstr_sha256(str2rstr_utf8(s)));
        }
    
        function b64_sha256(s) {
            return rstr2b64(rstr_sha256(str2rstr_utf8(s)));
        }
    
        function any_sha256(s, e) {
            return rstr2any(rstr_sha256(str2rstr_utf8(s)), e);
        }
    
        function hex_hmac_sha256(k, d) {
            return rstr2hex(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
        }
    
        function b64_hmac_sha256(k, d) {
            return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
        }
    
        function any_hmac_sha256(k, d, e) {
            return rstr2any(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)), e);
        }
    
        /*
         * Perform a simple self-test to see if the VM is working
         */
        function sha256_vm_test() {
            return hex_sha256('abc').toLowerCase() ==
                'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
        }
    
        /*
         * Calculate the sha256 of a raw string
         */
        function rstr_sha256(s) {
            return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
        }
    
        /*
         * Calculate the HMAC-sha256 of a key and some data (raw strings)
         */
        function rstr_hmac_sha256(key, data) {
            var bkey = rstr2binb(key);
            if (bkey.length > 16) bkey = binb_sha256(bkey, key.length * 8);
    
            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
    
            var hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
            return binb2rstr(binb_sha256(opad.concat(hash), 512 + 256));
        }
    
        /*
         * Convert a raw string to a hex string
         */
        function rstr2hex(input) {
            try {
                hexcase
            } catch (e) {
                hexcase = 0;
            }
            var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
            var output = '';
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
            }
            return output;
        }
    
        /*
         * Convert a raw string to a base-64 string
         */
        function rstr2b64(input) {
            try {
                b64pad
            } catch (e) {
                b64pad = '';
            }
            var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var output = '';
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8) output += b64pad;
                    else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        }
    
        /*
         * Convert a raw string to an arbitrary string encoding
         */
        function rstr2any(input, encoding) {
            var divisor = encoding.length;
            var remainders = Array();
            var i, q, x, quotient;
    
            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
    
            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. We stop when the dividend is zero.
             * All remainders are stored for later use.
             */
            while (dividend.length > 0) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[remainders.length] = x;
                dividend = quotient;
            }
    
            /* Convert the remainders to the output string */
            var output = '';
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
    
            /* Append leading zero equivalents */
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)))
            for (i = output.length; i < full_length; i++)
                output = encoding[0] + output;
    
            return output;
        }
    
        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        function str2rstr_utf8(input) {
            var output = '';
            var i = -1;
            var x, y;
    
            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }
    
                /* Encode output as utf-8 */
                if (x <= 0x7F)
                    output += String.fromCharCode(x);
                else if (x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
                        0x80 | (x & 0x3F));
                else if (x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                        0x80 | ((x >>> 6) & 0x3F),
                        0x80 | (x & 0x3F));
                else if (x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                        0x80 | ((x >>> 12) & 0x3F),
                        0x80 | ((x >>> 6) & 0x3F),
                        0x80 | (x & 0x3F));
            }
            return output;
        }
    
        /*
         * Encode a string as utf-16
         */
        function str2rstr_utf16le(input) {
            var output = '';
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
            return output;
        }
    
        function str2rstr_utf16be(input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                    input.charCodeAt(i) & 0xFF);
            return output;
        }
    
        /*
         * Convert a raw string to an array of big-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        function rstr2binb(input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            return output;
        }
    
        /*
         * Convert an array of big-endian words to a string
         */
        function binb2rstr(input) {
            var output = '';
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
            return output;
        }
    
        /*
         * Main sha256 function, with its support functions
         */
        function sha256_S(X, n) {
            return (X >>> n) | (X << (32 - n));
        }
    
        function sha256_R(X, n) {
            return (X >>> n);
        }
    
        function sha256_Ch(x, y, z) {
            return ((x & y) ^ ((~x) & z));
        }
    
        function sha256_Maj(x, y, z) {
            return ((x & y) ^ (x & z) ^ (y & z));
        }
    
        function sha256_Sigma0256(x) {
            return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22));
        }
    
        function sha256_Sigma1256(x) {
            return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25));
        }
    
        function sha256_Gamma0256(x) {
            return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3));
        }
    
        function sha256_Gamma1256(x) {
            return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10));
        }
    
        function sha256_Sigma0512(x) {
            return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39));
        }
    
        function sha256_Sigma1512(x) {
            return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41));
        }
    
        function sha256_Gamma0512(x) {
            return (sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7));
        }
    
        function sha256_Gamma1512(x) {
            return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6));
        }
    
        var sha256_K = new Array(
            1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
            1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
            264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
            113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
            1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
            430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
            1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998
        );
    
        function binb_sha256(m, l) {
            var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534,
                1359893119, -1694144372, 528734635, 1541459225);
            var W = new Array(64);
            var a, b, c, d, e, f, g, h;
            var i, j, T1, T2;
    
            /* append padding */
            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;
    
            for (i = 0; i < m.length; i += 16) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];
    
                for (j = 0; j < 64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                        sha256_Gamma0256(W[j - 15])), W[j - 16]);
    
                    T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
                        sha256_K[j]), W[j]);
                    T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }
    
                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }
    
        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
    
        /*! base64x-1.1.3 (c) 2012-2014 Kenji Urushima | kjur.github.com/jsjws/license
         */
        /*
         * base64x.js - Base64url and supplementary functions for Tom Wu's base64.js library
         *
         * version: 1.1.3 (2014 May 25)
         *
         * Copyright (c) 2012-2014 Kenji Urushima (kenji.urushima@gmail.com)
         *
         * This software is licensed under the terms of the MIT License.
         * http://kjur.github.com/jsjws/license/
         *
         * The above copyright and license notice shall be
         * included in all copies or substantial portions of the Software.
         *
         * DEPENDS ON:
         *   - base64.js - Tom Wu's Base64 library
         */
    
        /**
         * Base64URL and supplementary functions for Tom Wu's base64.js library.<br/>
         * This class is just provide information about global functions
         * defined in 'base64x.js'. The 'base64x.js' script file provides
         * global functions for converting following data each other.
         * <ul>
         * <li>(ASCII) String</li>
         * <li>UTF8 String including CJK, Latin and other characters</li>
         * <li>byte array</li>
         * <li>hexadecimal encoded String</li>
         * <li>Full URIComponent encoded String (such like "%69%94")</li>
         * <li>Base64 encoded String</li>
         * <li>Base64URL encoded String</li>
         * </ul>
         * All functions in 'base64x.js' are defined in {@link _global_} and not
         * in this class.
         *
         * @class Base64URL and supplementary functions for Tom Wu's base64.js library
         * @author Kenji Urushima
         * @version 1.1 (07 May 2012)
         * @requires base64.js
         * @see <a href="http://kjur.github.com/jsjws/">'jwjws'(JWS JavaScript Library) home page http://kjur.github.com/jsjws/</a>
         * @see <a href="http://kjur.github.com/jsrsasigns/">'jwrsasign'(RSA Sign JavaScript Library) home page http://kjur.github.com/jsrsasign/</a>
         */
        function Base64x() {}
    
        // ==== string / byte array ================================
        /**
         * convert a string to an array of character codes
         * @param {String} s
         * @return {Array of Numbers}
         */
        function stoBA(s) {
            var a = new Array();
            for (var i = 0; i < s.length; i++) {
                a[i] = s.charCodeAt(i);
            }
            return a;
        }
    
        /**
         * convert an array of character codes to a string
         * @param {Array of Numbers} a array of character codes
         * @return {String} s
         */
        function BAtos(a) {
            var s = "";
            for (var i = 0; i < a.length; i++) {
                s = s + String.fromCharCode(a[i]);
            }
            return s;
        }
    
        // ==== byte array / hex ================================
        /**
         * convert an array of bytes(Number) to hexadecimal string.<br/>
         * @param {Array of Numbers} a array of bytes
         * @return {String} hexadecimal string
         */
        function BAtohex(a) {
            var s = "";
            for (var i = 0; i < a.length; i++) {
                var hex1 = a[i].toString(16);
                if (hex1.length == 1) hex1 = "0" + hex1;
                s = s + hex1;
            }
            return s;
        }
    
        // ==== string / hex ================================
        /**
         * convert a ASCII string to a hexadecimal string of ASCII codes.<br/>
         * NOTE: This can't be used for non ASCII characters.
         * @param {s} s ASCII string
         * @return {String} hexadecimal string
         */
        function stohex(s) {
            return BAtohex(stoBA(s));
        }
    
        // ==== string / base64 ================================
        /**
         * convert a ASCII string to a Base64 encoded string.<br/>
         * NOTE: This can't be used for non ASCII characters.
         * @param {s} s ASCII string
         * @return {String} Base64 encoded string
         */
        function stob64(s) {
            return hex2b64(stohex(s));
        }
    
        // ==== string / base64url ================================
        /**
         * convert a ASCII string to a Base64URL encoded string.<br/>
         * NOTE: This can't be used for non ASCII characters.
         * @param {s} s ASCII string
         * @return {String} Base64URL encoded string
         */
        function stob64u(s) {
            return b64tob64u(hex2b64(stohex(s)));
        }
    
        /**
         * convert a Base64URL encoded string to a ASCII string.<br/>
         * NOTE: This can't be used for Base64URL encoded non ASCII characters.
         * @param {s} s Base64URL encoded string
         * @return {String} ASCII string
         */
        function b64utos(s) {
            return BAtos(b64toBA(b64utob64(s)));
        }
    
        // ==== base64 / base64url ================================
        /**
         * convert a Base64 encoded string to a Base64URL encoded string.<br/>
         * Example: "ab+c3f/==" &rarr; "ab-c3f_"
         * @param {String} s Base64 encoded string
         * @return {String} Base64URL encoded string
         */
        function b64tob64u(s) {
            s = s.replace(/\=/g, '');
            s = s.replace(/\+/g, '-');
            s = s.replace(/\//g, '_');
            return s;
        }
    
        /**
         * convert a Base64URL encoded string to a Base64 encoded string.<br/>
         * Example: 'ab-c3f_' &rarr; 'ab+c3f/=='
         * @param {String} s Base64URL encoded string
         * @return {String} Base64 encoded string
         */
        function b64utob64(s) {
            if (s.length % 4 == 2) s = s + '==';
            else if (s.length % 4 == 3) s = s + '=';
            s = s.replace(/-/g, '+');
            s = s.replace(/_/g, '/');
            return s;
        }
    
        // ==== hex / base64url ================================
        /**
         * convert a hexadecimal string to a Base64URL encoded string.<br/>
         * @param {String} s hexadecimal string
         * @return {String} Base64URL encoded string
         */
        function hextob64u(s) {
            return b64tob64u(hex2b64(s));
        }
    
        /**
         * convert a Base64URL encoded string to a hexadecimal string.<br/>
         * @param {String} s Base64URL encoded string
         * @return {String} hexadecimal string
         */
        function b64utohex(s) {
            return b64tohex(b64utob64(s));
        }
    
        var utf8tob64u, b64utoutf8;
    
        if (typeof Buffer === 'function') {
            utf8tob64u = function(s) {
                return b64tob64u(new Buffer(s, 'utf8').toString('base64'));
            };
    
            b64utoutf8 = function(s) {
                return new Buffer(b64utob64(s), 'base64').toString('utf8');
            };
        } else {
            // ==== utf8 / base64url ================================
            /**
             * convert a UTF-8 encoded string including CJK or Latin to a Base64URL encoded string.<br/>
             * @param {String} s UTF-8 encoded string
             * @return {String} Base64URL encoded string
             * @since 1.1
             */
            utf8tob64u = function(s) {
                return hextob64u(uricmptohex(encodeURIComponentAll(s)));
            };
    
            /**
             * convert a Base64URL encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
             * @param {String} s Base64URL encoded string
             * @return {String} UTF-8 encoded string
             * @since 1.1
             */
            b64utoutf8 = function(s) {
                return decodeURIComponent(hextouricmp(b64utohex(s)));
            };
        }
    
        // ==== utf8 / base64url ================================
        /**
         * convert a UTF-8 encoded string including CJK or Latin to a Base64 encoded string.<br/>
         * @param {String} s UTF-8 encoded string
         * @return {String} Base64 encoded string
         * @since 1.1.1
         */
        function utf8tob64(s) {
            return hex2b64(uricmptohex(encodeURIComponentAll(s)));
        }
    
        /**
         * convert a Base64 encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
         * @param {String} s Base64 encoded string
         * @return {String} UTF-8 encoded string
         * @since 1.1.1
         */
        function b64toutf8(s) {
            return decodeURIComponent(hextouricmp(b64tohex(s)));
        }
    
        // ==== utf8 / hex ================================
        /**
         * convert a UTF-8 encoded string including CJK or Latin to a hexadecimal encoded string.<br/>
         * @param {String} s UTF-8 encoded string
         * @return {String} hexadecimal encoded string
         * @since 1.1.1
         */
        function utf8tohex(s) {
            return uricmptohex(encodeURIComponentAll(s));
        }
    
        /**
         * convert a hexadecimal encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
         * Note that when input is improper hexadecimal string as UTF-8 string, this function returns
         * 'null'.
         * @param {String} s hexadecimal encoded string
         * @return {String} UTF-8 encoded string or null
         * @since 1.1.1
         */
        function hextoutf8(s) {
            return decodeURIComponent(hextouricmp(s));
        }
    
        /**
         * convert a hexadecimal encoded string to raw string including non printable characters.<br/>
         * @param {String} s hexadecimal encoded string
         * @return {String} raw string
         * @since 1.1.2
         * @example
         * hextorstr("610061") &rarr; "a\x00a"
         */
        function hextorstr(sHex) {
            var s = "";
            for (var i = 0; i < sHex.length - 1; i += 2) {
                s += String.fromCharCode(parseInt(sHex.substr(i, 2), 16));
            }
            return s;
        }
    
        /**
         * convert a raw string including non printable characters to hexadecimal encoded string.<br/>
         * @param {String} s raw string
         * @return {String} hexadecimal encoded string
         * @since 1.1.2
         * @example
         * rstrtohex("a\x00a") &rarr; "610061"
         */
        function rstrtohex(s) {
            var result = '';
            for (var i = 0; i < s.length; i++) {
                result += ('0' + s.charCodeAt(i).toString(16)).slice(-2);
            }
            return result;
        }
    
        // ==== hex / b64nl =======================================
    
        /*
         * since base64x 1.1.3
         */
        function hextob64(s) {
            return hex2b64(s);
        }
    
        /*
         * since base64x 1.1.3
         */
        function hextob64nl(s) {
            var b64 = hextob64(s);
            var b64nl = b64.replace(/(.{64})/g, '$1\r\n');
            b64nl = b64nl.replace(/\r\n$/, '');
            return b64nl;
        }
    
        /*
         * since base64x 1.1.3
         */
        function b64nltohex(s) {
            var b64 = s.replace(/[^0-9A-Za-z\/+=]*/g, '');
            var hex = b64tohex(b64);
            return hex;
        }
    
        // ==== URIComponent / hex ================================
        /**
         * convert a URLComponent string such like "%67%68" to a hexadecimal string.<br/>
         * @param {String} s URIComponent string such like "%67%68"
         * @return {String} hexadecimal string
         * @since 1.1
         */
        function uricmptohex(s) {
            return s.replace(/%/g, '');
        }
    
        /**
         * convert a hexadecimal string to a URLComponent string such like "%67%68".<br/>
         * @param {String} s hexadecimal string
         * @return {String} URIComponent string such like "%67%68"
         * @since 1.1
         */
        function hextouricmp(s) {
            return s.replace(/(..)/g, '%$1');
        }
    
        // ==== URIComponent ================================
        /**
         * convert UTFa hexadecimal string to a URLComponent string such like "%67%68".<br/>
         * Note that these "<code>0-9A-Za-z!'()*-._~</code>" characters will not
         * converted to "%xx" format by builtin 'encodeURIComponent()' function.
         * However this 'encodeURIComponentAll()' function will convert
         * all of characters into "%xx" format.
         * @param {String} s hexadecimal string
         * @return {String} URIComponent string such like "%67%68"
         * @since 1.1
         */
        function encodeURIComponentAll(u8) {
            var s = encodeURIComponent(u8);
            var s2 = '';
            for (var i = 0; i < s.length; i++) {
                if (s[i] == '%') {
                    s2 = s2 + s.substr(i, 3);
                    i = i + 2;
                } else {
                    s2 = s2 + '%' + stohex(s[i]);
                }
            }
            return s2;
        }
    
        // ==== new lines ================================
        /**
         * convert all DOS new line("\r\n") to UNIX new line("\n") in
         * a String "s".
         * @param {String} s string
         * @return {String} converted string
         */
        function newline_toUnix(s) {
            s = s.replace(/\r\n/mg, '\n');
            return s;
        }
    
        /**
         * convert all UNIX new line('\r\n') to DOS new line('\n') in
         * a String 's'.
         * @param {String} s string
         * @return {String} converted string
         */
        function newline_toDos(s) {
            s = s.replace(/\r\n/mg, '\n');
            s = s.replace(/\n/mg, '\r\n');
            return s;
        }
    
    
        return {
            rstr2b64: rstr2b64,
            str2rstr_utf8: str2rstr_utf8,
            b64_hmac_sha256: b64_hmac_sha256,
            b64tob64u: b64tob64u
        }
    })();


    //----------corbel modules----------------

    (function() {
        /**
         * Application global common, config and params
         * @exports common
         * @namespace
         * @memberof corbel
         */
        var common = corbel.common = {
            config: {}
        };
    
        /**
         * Checks if the app type is production or not
         * @return {Boolean}
         */
        common.isProduction = function() {
            return !common.config.mode;
        };
    
    
        var isNode = typeof module !== 'undefined' && module.exports;
    
        /**
         * Config data structure
         * @namespace
         */
        common.config = {
    
            /**
             * @type {String}
             * @default undefined|'DEVELOPER'
             */
            mode: undefined,
    
            /**
             * @type {Boolean}
             * @default app.common.isProduction()
             */
            production: common.isProduction(),
    
            /**
             * @type {String}
             * @default
             */
            version: '0.0.1',
    
            /**
             * @type {String}
             * @default
             */
            appName: 'corbel-js',
    
            /**
             * Client type
             * @type {String}
             * @default
             */
            clientType: isNode ? 'NODE' : 'WEB',
    
            /**
             * WebApp root URL
             * @type {String}
             * @default
             */
            wwwRoot: !isNode ? root.location.protocol + '//' + root.location.host + root.location.pathname : 'localhost',
    
            /**
             * Default lang
             * @type {String}
             * @default
             */
            lang: 'es - ES ',
    
            autoTokenRefresh: true,
            autoUpgradeToken: true
        };
    
        /**
         * Returns all application config params
         * @return {Object}
         */
        common.getConfig = function() {
            return this.config;
        };
    
        /**
         * Overrides current config with params object config
         * @param {Object} config An object with params to set as new config
         */
        common.setConfig = function(config) {
            this.config = corbel.utils.extend(this.config, config);
            this.config.production = this.isProduction();
            return this;
        };
    
        /**
         * Gets a specific config param
         * @param  {String} field config param name
         * @return {Mixed}
         */
        common.get = function(field) {
            if (this.config[field] === undefined) {
                throw new Error('UndefinedCommonField "' + field + '"');
            }
    
            return this.config[field];
        };
    
        /**
         * Gets a specific config param or default
         * @param  {String} field config param name
         * @param  {String} defaultValue return value when config param is undefined
         * @return {Mixed}
         */
        common.getOrDefault = function(field, defaultValue) {
            return this.config[field] || defaultValue;
        };
    
    
        /**
         * Sets a new value for specific config param
         * @param {String} field Config param name
         * @param {Mixed} value Config param value
         */
        common.set = function(field, value) {
            this.config[field] = value;
        };
    
        return common;
    
    })();


    (function() {
    
        /**
         * Request object available for brwoser and node environment
         * @type {Object}
         */
        corbel.request = {};
    
        var xhrSuccessStatus = {
            // file protocol always yields status code 0, assume 200
            0: 200,
            // Support: IE9
            // #1450: sometimes IE returns 1223 when it should be 204
            1223: 204
        };
    
        /**
         * Process the server response to the specified object/array/blob/byteArray/text
         * @param  {Mixed} data                             The server response
         * @param  {String} type='array'|'blob'|'json'      The class of the server response
         * @param  {Stirng} dataType                        Is an extra param to form the blob object (if the type is blob)
         * @return {Mixed}                                  Processed data
         */
        var processResponseData = function(data, type, dataType) {
            var parsedData = data;
    
            if (type === 'arraybuffer') {
                parsedData = new Uint8Array(data);
            } else if (type === 'blob') {
                parsedData = new Blob([data], {
                    type: dataType
                });
            }
    
            return parsedData;
    
        };
    
        /**
         * Serialize the data to be sent to the server
         * @param  {Mixed} data                             The data that would be sent to the server
         * @param  {String} type='array'|'blob'|'json'      The class of the data (array, blob, json)
         * @return {String}                                 Serialized data
         */
        var serializeData = function(data, type) {
            var serializedData = data;
    
            if (type === 'json' && typeof data === 'object') {
                serializedData = JSON.stringify(data);
            }
    
            return serializedData;
    
        };
    
        /**
         * [processResponse description]
         * @param  {[type]} response        [description]
         * @param  {[type]} resolver        [description]
         * @param  {[type]} callbackSuccess [description]
         * @param  {[type]} callbackError   [description]
         * @return {[type]}                 [description]
         */
        var processResponse = function(response, resolver, callbackSuccess, callbackError) {
    
            //xhr = xhr.target || xhr || {};
            var statusCode = xhrSuccessStatus[response.status] || response.status,
                statusType = Number(response.status.toString()[0]),
                promiseResponse;
    
            if (statusType < 3) {
                var data = processResponseData(response.responseType, response.dataType);
    
                if (callbackSuccess) {
                    callbackSuccess.call(this, data, response.status, response.responseObject);
                }
    
                promiseResponse = {
                    data: data,
                    status: response.status,
                };
    
                promiseResponse[response.responseObjectType] = response.responseObject;
    
                resolver.resolve(promiseResponse);
    
            } else if (statusType === 4) {
    
                if (callbackError) {
                    callbackError.call(this, response.status, response.responseObject, response.error);
                }
    
                promiseResponse = {
                    error: response.error,
                    status: response.status,
                };
    
                promiseResponse[response.responseObjectType] = response.responseObject;
    
                resolver.reject(promiseResponse);
            }
    
        };
    
        //nodejs
        if (typeof module !== 'undefined' && module.exports) {
            var request = require('request');
    
            corbel.request.send = function(options) {
                options = options || {};
    
                var method = String((options.type || 'GET')).toUpperCase(),
                    url = options.url,
                    headers = typeof options.headers === 'object' ? options.headers : {},
                    contentType = options.contentType || 'application/json',
                    isJSON = contentType === 'application/json; charset=utf-8' ? true : false,
                    callbackSuccess = options.success && typeof options.success === 'function' ? options.success : undefined,
                    callbackError = options.error && typeof options.error === 'function' ? options.error : undefined,
                    self = this,
                    responseType = options.responseType === 'arraybuffer' || options.responseType === 'text' || options.responseType === 'blob' ? options.responseType : 'json',
                    dataType = options.responseType === 'blob' ? options.type || 'image/jpg' : undefined,
                    data = options.data || {};
    
    
                if (!url) {
                    throw new Error('You must define an url');
                }
    
                headers['content-type'] = contentType;
    
                var promise = new Promise(function(resolve, reject) {
    
                    request({
                        method: method,
                        url: url,
                        headers: headers,
                        json: isJSON,
                        body: data
                    }, function(error, response, body) { //callback
    
                        processResponse.call(self, {
                            responseObject: response,
                            dataType: dataType,
                            responseType: response.headers['content-type'],
                            response: body,
                            status: response.statusCode,
                            responseObjectType: 'response',
                            error: error
                        }, {
                            resolve: resolve,
                            reject: reject
                        }, callbackSuccess, callbackError);
    
                    });
    
                });
    
                return promise;
            };
    
            module.exports = corbel.request;
        }
    
        //browser
        if (typeof window !== 'undefined') {
    
            corbel.request.send = function(options) {
                options = options || {};
    
                var httpReq = new XMLHttpRequest(),
                    url = options.url,
                    headers = typeof options.headers === 'object' ? options.headers : {},
                    contentType = options.contentType || 'application/json',
                    callbackSuccess = options.success && typeof options.success === 'function' ? options.success : undefined,
                    callbackError = options.error && typeof options.error === 'function' ? options.error : undefined,
                    self = this,
                    responseType = options.responseType === 'arraybuffer' || options.responseType === 'text' || options.responseType === 'blob' ? options.responseType : 'json',
                    dataType = options.responseType === 'blob' ? options.type || 'image/jpg' : undefined;
    
    
                if (!url) {
                    throw new Error('You must define an url');
                }
    
                var method = String((options.type || 'GET')).toUpperCase();
    
                // add responseType to the request (blob || arraybuffer || text)
                httpReq.responseType = responseType;
    
                //add content-type header
                headers['content-type'] = contentType;
    
                httpReq.open(method, url, true);
    
                /* add request headers */
                for (var header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        httpReq.setRequestHeader(header, headers[header]);
                    }
                }
    
                //  Process the server response to the specified object type
                var promise = new Promise(function(resolve, reject) {
                    //response recieved
                    httpReq.onload = function(xhr) {
                        xhr = xhr.target || xhr; // only for fake sinon response xhr
    
                        processResponse.call(self, {
                            responseObject: xhr,
                            dataType: xhr.dataType,
                            responseType: xhr.responseType,
                            response: xhr.response || xhr.responseText,
                            status: xhr.status,
                            responseObjectType: 'xhr',
                            error: xhr.error
                        }, {
                            resolve: resolve,
                            reject: reject
                        }, callbackSuccess, callbackError);
    
                        //delete callbacks
                    };
    
                    //response fail ()
                    httpReq.onerror = function(xhr) {
                        xhr = xhr.target || xhr; // only for fake sinon response xhr
    
                        processResponse.call(self, {
                            responseObject: xhr,
                            dataType: xhr.dataType,
                            responseType: xhr.responseType,
                            response: xhr.response || xhr.responseText,
                            status: xhr.status,
                            responseObjectType: 'xhr',
                            error: xhr.error
                        }, {
                            resolve: resolve,
                            reject: reject
                        }, callbackSuccess, callbackError);
    
                    };
    
                });
    
                if (options.data) {
                    httpReq.send(serializeData(options.data, responseType));
                } else {
                    httpReq.send();
                }
    
    
                return promise;
    
            };
        }
    
    
        return corbel.request;
    
    })();
    


    (function() {
    
        /* jshint camelcase:false */
    
        corbel.jwt = {
    
            /**
             * JWT-HmacSHA256 generator
             * http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html
             * @param  {Object} claims Specific claims to include in the JWT (iss, aud, exp, scope, ...)
             * @param  {String} [secret='common.clientSecret'] String with the client assigned secret
             * @param  {Object} [alg='common.jwtAlgorithm']   Object with the algorithm type
             * @return {String} jwt JWT string
             */
            generate: function(claims, secret, alg) {
                // console.log('jwt.generate', claims, secret, alg);
                secret = secret || corbel.common.get('clientSecret'); //Todo
                alg = alg || corbel.common.get('jwtAlgorithm'); //Todo
    
                var bAlg = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify({
                        alg: alg
                    }))),
                    bClaims = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify(claims))),
                    segment = bAlg + '.' + bClaims,
                    assertion = corbel.cryptography.b64tob64u(corbel.cryptography.b64_hmac_sha256(secret, segment));
    
                return segment + '.' + assertion;
            },
    
            /**
             * Returns a claim with default values, that can be overriden with params values.
             * @param  {Object} params Dicctionary with claims values
             * @return {Object}        Claims Object
             */
            createClaims: function(params) {
                params = params || {};
    
                // Default claims values
                var claims = {
                    iss: corbel.common.get('clientId'), //TODO
                    aud: corbel.common.get('claimAud'), //TODO
                    scope: corbel.common.getOrDefault('claimScopes'), //TODO
                    version: corbel.common.get('version') //TODO
                };
    
                claims.exp = Math.round((new Date().getTime() / 1000)) + corbel.common.get('claimExp');
    
                claims = corbel.utils.extend(claims, params);
    
                // console.log('jwt.createClaims.claims', claims);
    
                return claims;
            }
        };
    
        return corbel.jwt;
    
    })();
    


    (function() {
    
    
        /** --core engine services-- */
    
        var corbelServices = corbel.services = {
            /**
             * method constants
             * @namespace
             */
            method: {
    
                /**
                 * GET constant
                 * @constant
                 * @type {String}
                 * @default
                 */
                GET: 'GET',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                POST: 'POST',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                PUT: 'PUT',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                DELETE: 'DELETE',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                OPTIONS: 'OPTIONS',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                PATCH: 'PATCH',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                HEAD: 'HEAD'
            }
        };
    
    
        var _FORCE_UPDATE_TEXT = 'unsupported_version',
            _FORCE_UPDATE_MAX_RETRIES = 3;
        // _FORCE_UPDATE_STATUS = 'fu_r';
    
        /**
         * Generic Services request.
         * Support all corbel.request parameters and some more:
         * @param {Object} args
         * @param {String} [args.method=app.services.method.GET]
         * @param {String} [args.accessToken] set request with auth. (accessToken overrides args.withAuth)
         * @param {Boolean} [args.withAuth] set request with auth. (if not exists args.accessToken)
         * @param {Boolean} [args.noRetry] [Disable automatic retry strategy]
         * @param {String} [args.retryHook] [reqres hook to retry refresh token]
         * @return {ES6 Promise}
         */
        corbelServices.request = function(args) {
    
            return new Promise(function(resolve, reject) {
    
    
                corbelServices.makeRequest({
                    resolve: resolve,
                    reject: reject
                }, args);
    
            });
        };
    
    
        /**
         * Check if an url should be process as a crossdomain resource.
         * @return {Boolean}
         */
        corbelServices.isCrossDomain = function(url) {
            if (url && url.indexOf('http') !== -1) {
                return true;
            } else {
                return false;
            }
        };
    
        /**
         * Transform an array of scopes to a string separated by an space
         * @param  {Array} scopes
         * @return {String}
         */
        corbelServices.arrayScopesToString = function(scopes) {
            var memo = '';
    
            scopes.forEach(function(scope) {
                memo += ' ' + scope;
            });
    
            return memo.substr(1);
        };
    
    
        /**
         * Execute the actual ajax request.
         * Retries request with refresh token when credentials are needed.
         * Refreshes the client when a force update is detected.
         * Returns a server error (403 - unsupported_version) when force update max retries are reached
         *
         * @param  {Promise} dfd     The deferred object to resolve when the ajax request is completed.
         * @param  {Object} args    The request arguments.
         */
        corbelServices.makeRequest = function(resolver, args) {
            // console.log('services.doRequestCall.args', args);
    
            var params = corbelServices.buildParams(args);
            corbel.request.send(params).then(function(response) {
    
                // console.log('doRequestCall.resolve', arguments);
    
                // session.add(_FORCE_UPDATE_STATUS, 0); //TODO SESSION
    
                resolver.resolve({
                    data: response.data, //arguments[0]
                    textStatus: response.status, //arguments[1]
                    responseObject: response.response || response.xhr //arguments[2]
                });
    
            }).fail(function(response) {
                // Force update
                if (response.status === 403 &&
                    response.textStatus === _FORCE_UPDATE_TEXT) {
    
                    var retries = /*session.get(_FORCE_UPDATE_STATUS) ||*/ 0; //TODO SESSION
                    if (retries < _FORCE_UPDATE_MAX_RETRIES) {
                        // console.log('services.request.force_update.reload', retries);
                        retries++;
                        // session.add(_FORCE_UPDATE_STATUS, retries); //TODO SESSION
    
                        corbel.utils.reload();
                    } else {
                        // console.log('services.request.force_update.fail');
    
                        // Send an error to the caller
                        resolver.reject({
                            responseObject: response.xhr || response.response, //arguments[0]
                            textStatus: response.status, //arguments[1]
                            errorThrown: response.error //arguments[2]
                        });
    
                    }
                } else {
                    // Any other error fail to the caller
                    resolver.reject({
                        responseObject: response.xhr || response.response, //arguments[0]
                        textStatus: response.status, //arguments[1]
                        errorThrown: response.error //arguments[2]
                    });
                }
    
            });
        };
    
    
        /**
         * Returns a valid corbel.request parameters with default values,
         * CORS detection and authorization params if needed.
         * By default, all request are json (dataType/contentType)
         * with object serialization support
         * @param  {Object} args
         * @return {Object}
         */
        corbelServices.buildParams = function(args) {
    
            // Default values
            args = args || {};
    
            // args.dataType = args.dataType || 'json';
            // args.contentType = args.contentType || 'application/json; charset=utf-8';
            args.dataFilter = args.dataFilter || addEmptyJson;
    
            // Construct url with query string
            var url = args.url;
    
            if (!url) {
                throw new Error('You must define an url');
            }
    
            if (args.query) {
                url += '?' + args.query;
            }
    
            var headers = args.headers || {};
            // Use access access token if exists
            if (args.accessToken) {
                headers.Authorization = 'Bearer ' + args.accessToken;
            }
            if (args.noRedirect) {
                headers['No-Redirect'] = true;
            }
            if (args.Accept) {
                headers.Accept = args.Accept;
                args.dataType = undefined; // Accept & dataType are incompatibles
            }
    
    
            var params = {
                url: url,
                dataType: args.dataType,
                contentType: args.contentType,
                type: args.method || corbelServices.method.GET,
                headers: headers,
                data: (args.contentType.indexOf('json') !== -1 && typeof args.data === 'object' ? JSON.stringify(args.data) : args.data),
                dataFilter: args.dataFilter
            };
    
            // For binary requests like 'blob' or 'arraybuffer', set correct dataType
            params.dataType = args.binaryType || params.dataType;
    
            // Prevent JQuery to proceess 'blob' || 'arraybuffer' data
            // if ((params.dataType === 'blob' || params.dataType === 'arraybuffer') && (params.type === 'PUT' || params.type === 'POST')) {
            //     params.processData = false;
            // }
    
            // if (corbelServices.isCrossDomain(url)) {
            //     // http://stackoverflow.com/questions/5241088/jquery-call-to-webservice-returns-no-transport-error
            //     $.support.cors = true;
            //     params.crossDomain = true;
            //     if (args.withCredentials) {
            //         params.xhrFields = {
            //             withCredentials: true
            //         };
            //     }
            // }
    
            // console.log('services.buildParams (params)', params);
            // if (args.data) {
            //      console.log('services.buildParams (data)', args.data);
            // }
    
            return params;
        };
    
    
        var addEmptyJson = function(response, type) {
            if (!response && type === 'json') {
                response = '{}';
            }
            return response;
        };
    
    
        /** end--core engine services-- */
    
    
        return corbelServices;
    
    })();


    'use strict';
    /* global define, console, corbel */
    
    // define([
    //     'corejs/app',
    //     'corejs/engine/jwt',
    //     'corejs/engine/validate',
    //     'corejs/modules/corbel/services',
    //     'corejs/modules/corbel/common',
    //     'underscore',
    //     'q'
    // ], function(app, jwt, //validate, services, common, _, q) {
    
    /**
     * A module to make iam requests.
     * @exports iam
     * @namespace
     * @memberof app.corbel
     */
    var iam = corbel.iam = {};
    
    /**
     * Creates a TokenBuilder for token requests
     * @return {iam.TokenBuilder}
     */
    iam.token = function() {
        // console.log('iamInterface.token');
        return new iam.TokenBuilder();
    };
    
    /**
     * A builder for token requests
     * @class
     * @memberOf iam
     */
    iam.TokenBuilder = function() {
        this.uri = 'oauth/token';
    };
    
    /**
     * Creates a token to connect with iam
     * @method
     * @memberOf iam.TokenBuilder
     * @param  {Object} params          Parameters to authorice
     * @param {String} [params.jwt]     Assertion to generate the token
     * @param {Object} [params.claims]  Claims to generate the token
     * @return {Promise}                Q promise that resolves to an AccessToken {Object} or rejects with a {@link corbelError}
     */
    iam.TokenBuilder.prototype.create = function(params, setCookie) {
        // console.log('iamInterface.token.create', params);
        // we need params to create access token
        corbel.validate.isValue(params, 'Create token request must contains params');
        // if there are oauth params this mean we should do use the GET verb
        if (params.oauth) {
            return doGetTokenRequest(this.uri, params, setCookie);
        }
        // otherwise we use the traditional POST verb.
        return doPostTokenRequest(this.uri, params, setCookie);
    };
    
    /**
     * Refresh a token to connect with iam
     * @method
     * @memberOf iam.TokenBuilder
     * @param {String} [refresh_token]   Token to refresh an AccessToken
     * @param {String} [scopes]          Scopes to the AccessToken
     * @return {Promise}                 Q promise that resolves to an AccesToken {Object} or rejects with a {@link corbelError}
     */
    iam.TokenBuilder.prototype.refresh = function(refreshToken, scopes) {
        // console.log('iamInterface.token.refresh', refreshToken);
        // we need refresh token to refresh access token
        corbel.validate.isValue(refreshToken, 'Refresh access token request must contains refresh token');
        // we need create default claims to refresh access token
        var params = {
            'claims': corbel.jwt.createClaims({
                'refresh_token': refreshToken
            })
        };
        if (scopes) {
            params.claims.scope = scopes;
        }
        // we use the traditional POST verb to refresh access token.
        return doPostTokenRequest(this.uri, params);
    };
    
    /**
     * Starts a user request
     * @param  {String} [id] Id of the user to perform the request
     * @return {iam.UserBuilder | iam.UsersBuilder}    The builder to create the request
     */
    iam.user = function(id) {
        // console.log.debug('iamInterface.user', id);
        if (id) {
            return new UserBuilder(id);
        }
        return new corbel.UsersBuilder();
    };
    
    /**
     * Builder for creating requests of users collection
     * @class
     * @memberOf iam
     */
    
    var UsersBuilder = iam.UsersBuilder = function() {
        this.uri = 'user';
    };
    
    /**
     * Sends a reset password email to the email address recived.
     * @method
     * @memberOf oauth.UsersBuilder
     * @param  {String} userEmailToReset The email to send the message
     * @return {Promise}                 Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.sendResetPasswordEmail = function(userEmailToReset) {
        console.log('iamInterface.users.sendResetPasswordEmail', userEmailToReset);
        var query = 'email=' + userEmailToReset;
        return corbel.services.requestXHR({
            url: buildUri(this.uri + '/resetPassword'),
            method: corbel.services.method.GET,
            query: query,
            withAuth: true
        }).then(function(res) {
            return corbel.services.extractLocationId(res);
        });
    };
    
    /**
     * Creates a new user.
     * @method
     * @memberOf iam.UsersBuilder
     * @param  {Object} data The user data.
     * @return {Promise}     A promise which resolves into the ID of the created user or fails with a {@link corbelError}.
     */
    UsersBuilder.prototype.create = function(data) {
        console.log('iamInterface.users.create', data);
        return corbel.services.requestXHR({
            url: buildUri(this.uri),
            method: corbel.services.method.POST,
            data: data,
            withAuth: true
        }).then(function(res) {
            return corbel.services.extractLocationId(res);
        });
    };
    
    /**
     * Gets the logged user
     * @method
     * @memberOf iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.getMe = function() {
        console.log('iamInterface.users.getMe');
        return getUser(corbel.services.method.GET, this.uri, 'me');
    };
    
    /**
     * Gets all users of the current domain
     * @method
     * @memberOf iam.UsersBuilder
     * @return {Promise} Q promise that resolves to an {Array} of Users or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.get = function(params) {
        console.log('iamInterface.users.get', params);
        return corbel.services.request({
            url: buildUri(this.uri),
            method: corbel.services.method.GET,
            query: params ? common.serializeParams(params) : null,
            withAuth: true
        });
    };
    
    /**
     * Builder for a specific user requests
     * @class
     * @memberOf iam
     * @param {String} id The id of the user
     */
    var UserBuilder = iam.UserBuilder = function(id) {
        this.uri = 'user';
        this.id = id;
    };
    
    /**
     * Gets the user
     * @method
     * @memberOf iam.UserBuilder
     * @return {Promise}  Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.get = function() {
        console.log('iamInterface.user.get');
        return getUser(corbel.services.method.GET, this.uri, this.id);
    };
    
    /**
     * Updates the user
     * @method
     * @memberOf iam.UserBuilder
     * @param  {Object} data    The data to update
     * @return {Promise}        Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.update = function(data) {
        console.log('iamInterface.user.update', data);
        return corbel.services.request({
            url: buildUri(this.uri, this.id),
            method: corbel.services.method.PUT,
            data: data,
            withAuth: true
        });
    };
    
    /**
     * Update the logged user
     * @method
     * @memberOf iam.UsersBuilder
     * @param  {Object} data    The data to update
     * @param  {String} [token]   Token to use
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.updateMe = function(data, token) {
        console.log('iamInterface.users.updateMe', data);
        var args = {
            url: buildUri(this.uri, 'me'),
            method: corbel.services.method.PUT,
            data: data,
            args: args,
            withAuth: true
        };
        if (token) {
            args.accessToken = token;
        }
        return corbel.services.request(args);
    };
    
    /**
     * Deletes the user
     * @method
     * @memberOf iam.UserBuilder
     * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.delete = function() {
        console.log('iamInterface.user.delete');
        return corbel.services.request({
            url: buildUri(this.uri, this.id),
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };
    
    /**
     * Delete the logged user
     * @method
     * @memberOf iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.deleteMe = function() {
        console.log('iamInterface.users.deleteMe');
        return corbel.services.request({
            url: buildUri(this.uri, 'me'),
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };
    
    /**
     * Sign Out the logged user
     * @method
     * @memberOf iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.signOutMe = function() {
        // console.log('iamInterface.users.signOutMe');
        return corbel.services.request({
            url: buildUri(this.uri, 'me') + '/signout',
            method: corbel.services.method.PUT,
            withAuth: true
        });
    };
    
    /**
     * disconnect the user, all his tokens are deleted
     * @method
     * @memberOf iam.UserBuilder
     * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.disconnect = function() {
        // console.log('iamInterface.user.disconnect');
        return corbel.services.request({
            url: buildUri(this.uri, this.id) + '/disconnect',
            method: corbel.services.method.PUT,
            withAuth: true
        });
    };
    
    /**
     * disconnect the logged user, all his tokens are deleted
     * @method
     * @memberOf iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.disconnectMe = function() {
        // console.log('iamInterface.users.disconnectMe');
        return corbel.services.request({
            url: buildUri(this.uri, 'me') + '/disconnect',
            method: corbel.services.method.PUT,
            withAuth: true
        });
    };
    
    /**
     * Adds an identity (link to an oauth server or social network) to the user
     * @method
     * @memberOf iam.UserBuilder
     * @param {Object} identity     The data of the identity
     * @param {String} oauthId      The oauth ID of the user
     * @param {String} oauthService The oauth service to connect (facebook, twitter, google, corbel)
     * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.addIdentity = function(identity) {
        // console.log('iamInterface.user.addIdentity', identity);
        corbel.validate.isValue(identity, 'Missing identity');
        return corbel.services.request({
            url: buildUri(this.uri, this.id) + '/identity',
            method: corbel.services.method.POST,
            data: identity,
            withAuth: true
        });
    };
    
    /**
     * Get user identities (links to oauth servers or social networks)
     * @method
     * @memberOf iam.UserBuilder
     * @return {Promise}  Q promise that resolves to {Array} of Identity or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.getIdentities = function() {
        console.log('iamInterface.user.getIdentities');
        return corbel.services.request({
            url: buildUri(this.uri, this.id) + '/identity',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * User device register
     * @method
     * @memberOf iam.UsersBuilder
     * @param  {Object} data      The device data
     * @param  {Object} data.URI  The device token
     * @param  {Object} data.name The device name
     * @param  {Object} data.type The device type (Android, Apple)
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.registerMyDevice = function(data) {
        console.log('iamInterface.user.registerMyDevice');
        return corbel.services.requestXHR({
            url: buildUri(this.uri, 'me') + '/devices',
            method: corbel.services.method.PUT,
            withAuth: true,
            data: data
        }).then(function(res) {
            return corbel.services.extractLocationId(res);
        });
    };
    
    /**
     * User device register
     * @method
     * @memberOf iam.UserBuilder
     * @param  {Object} data      The device data
     * @param  {Object} data.URI  The device token
     * @param  {Object} data.name The device name
     * @param  {Object} data.type The device type (Android, Apple)
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.registerDevice = function(data) {
        console.log('iamInterface.user.registerDevice');
        return corbel.services.requestXHR({
            url: buildUri(this.uri, this.id) + '/devices',
            method: corbel.services.method.PUT,
            withAuth: true,
            data: data
        }).then(function(res) {
            return corbel.services.extractLocationId(res);
        });
    };
    
    /**
     * Get device
     * @method
     * @memberOf iam.UserBuilder
     * @param  {String}  deviceId    The device id
     * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.getDevice = function(deviceId) {
        console.log('iamInterface.user.getDevice');
        return corbel.services.request({
            url: buildUri(this.uri, this.id) + '/devices/' + deviceId,
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * Get devices
     * @method
     * @memberOf iam.UserBuilder
     * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.getDevices = function() {
        console.log('iamInterface.user.getDevices');
        return corbel.services.request({
            url: buildUri(this.uri, this.id) + '/devices/',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * Get my user devices
     * @method
     * @memberOf iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a list of Device {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.getMyDevices = function() {
        console.log('iamInterface.user.getMyDevices');
        return corbel.services.request({
            url: buildUri(this.uri, 'me') + '/devices',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * Get my user devices
     * @method
     * @memberOf iam.UsersBuilder
     * @param  {String}  deviceId    The device id
     * @return {Promise} Q promise that resolves to a list of Device {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.getMyDevice = function(deviceId) {
        console.log('iamInterface.user.getMyDevice');
        return corbel.services.request({
            url: buildUri(this.uri, 'me') + '/devices/' + deviceId,
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * Delete user device
     * @method
     * @memberOf iam.UsersBuilder
     * @param  {String}  deviceId    The device id
     * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.deleteMyDevice = function(deviceId) {
        console.log.debug('iamInterface.user.deleteMyDevice');
        return corbel.services.request({
            url: buildUri(this.uri, 'me') + '/devices/' + deviceId,
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };
    
    /**
     * Delete user device
     * @method
     * @memberOf iam.UserBuilder
     * @param  {String}  deviceId    The device id
     * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.deleteDevice = function(deviceId) {
        console.log.debug('iamInterface.user.deleteDevice');
        return corbel.services.request({
            url: buildUri(this.uri, this.id) + '/devices/' + deviceId,
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };
    
    /**
     * Starts a username request
     * @return {iam.UsernameBuilder}    The builder to create the request
     */
    iam.username = function() {
        console.log.debug('iamInterface.username');
        return new UsernameBuilder();
    };
    
    /**
     * Builder for creating requests of users name
     * @class
     * @memberOf iam
     */
    
    var UsernameBuilder = iam.UsernameBuilder = function() {
        this.uri = 'username';
    };
    
    /**
     * Return availability endpoint.
     * @method
     * @memberOf iam.UsernameBuilder
     * @param  {String} username The username.
     * @return {Promise}     A promise which resolves into usename availability boolean state.
     */
    UsernameBuilder.prototype.availability = function(username) {
        console.log('iamInterface.username.availability', username);
        return corbel.services.requestXHR({
            url: buildUri(this.uri, username),
            method: corbel.services.method.HEAD,
            withAuth: true
        }).then(
            function() {
                return false;
            },
            function(response) {
                if (response.httpStatus === 404) {
                    return true;
                } else {
                    return q.reject(response); //TODO - preguntar a anthanh
                }
            }
        );
    };
    
    
    
    /**
     * Gets the logged user profile
     * @method
     * @memberOf iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User Profile {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.getMeProfile = function() {
        console.log('iamInterface.users.getMeProfile');
        return corbel.services.request({
            url: buildUri(this.uri, 'me') + '/profile',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * Get user profiles
     * @method
     * @memberOf iam.UserBuilder
     * @return {Promise}  Q promise that resolves to a User Profile or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.getProfile = function() {
        console.log('iamInterface.user.getProfile');
        return corbel.services.request({
            url: buildUri(this.uri, this.id) + '/profile',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    UsersBuilder.prototype.getProfiles = function(params) {
        console.log('iamInterface.users.getProfiles', params);
        return corbel.services.request({
            url: buildUri(this.uri) + '/profile',
            method: corbel.services.method.GET,
            query: params ? common.serializeParams(params) : null, //TODO cambiar por util e implementar dicho metodo
            withAuth: true
        });
    };
    
    /**
     * Creates a DomainBuilder for domain managing requests.
     *
     * @param {String} domainId Domain id.
     *
     * @return {iam.DomainBuilder}
     */
    iam.domain = function(domainId) {
        // console.log('iamInterface.domain');
        return new DomainBuilder(domainId);
    };
    
    /**
     * A builder for domain management requests.
     *
     * @param {String} domainId Domain id (optional).
     *
     * @class
     * @memberOf iam
     */
    var DomainBuilder = iam.DomainBuilder = function(domainId) {
        this.domainId = domainId;
        this.uri = 'domain';
    };
    
    /**
     * Creates a new domain.
     *
     * @method
     * @memberOf iam.DomainBuilder
     *
     * @param {Object} domain                    The domain data.
     * @param {String} domain.description        Description of the domain.
     * @param {String} domain.authUrl            Authentication url.
     * @param {String} domain.allowedDomains     Allowed domains.
     * @param {String} domain.scopes             Scopes of the domain.
     * @param {String} domain.defaultScopes      Default copes of the domain.
     * @param {Object} domain.authConfigurations Authentication configuration.
     * @param {Object} domain.userProfileFields  User profile fields.
     *
     * @return {Promise} A promise with the id of the created domain or fails
     *                   with a {@link corbelError}.
     */
    DomainBuilder.prototype.create = function(domain) {
        console.log('iamInterface.domain.create', domain);
        return corbel.services.requestXHR({
            url: buildUri(this.uri),
            method: corbel.services.method.POST,
            data: domain,
            withAuth: true
        }).then(function(res) {
            return corbel.services.extractLocationId(res);
        });
    };
    
    /**
     * Gets a domain.
     *
     * @method
     * @memberOf iam.DomainBuilder
     *
     * @return {Promise} A promise with the domain or fails with a {@link corbelError}.
     */
    DomainBuilder.prototype.get = function() {
        console.log('iamInterface.domain.get', this.domainId);
        return corbel.services.request({
            url: buildUri(this.uri + '/' + this.domainId),
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * Updates a domain.
     *
     * @method
     * @memberOf iam.DomainBuilder
     *
     * @param {Object} domain                    The domain data.
     * @param {String} domain.description        Description of the domain.
     * @param {String} domain.authUrl            Authentication url.
     * @param {String} domain.allowedDomains     Allowed domains.
     * @param {String} domain.scopes             Scopes of the domain.
     * @param {String} domain.defaultScopes      Default copes of the domain.
     * @param {Object} domain.authConfigurations Authentication configuration.
     * @param {Object} domain.userProfileFields  User profile fields.
     *
     * @return {Promise} A promise or fails with a {@link corbelError}.
     */
    DomainBuilder.prototype.update = function(domain) {
        console.log('iamInterface.domain.update', domain);
        return corbel.services.request({
            url: buildUri(this.uri + '/' + this.domainId),
            method: corbel.services.method.PUT,
            data: domain,
            withAuth: true
        });
    };
    
    /**
     * Removes a domain.
     *
     * @method
     * @memberOf iam.DomainBuilder
     *
     * @param {String} domainId The domain id.
     *
     * @return {Promise} A promise or fails with a {@link corbelError}.
     */
    DomainBuilder.prototype.remove = function() {
        console.log('iamInterface.domain.remove', this.domainId);
        return corbel.services.request({
            url: buildUri(this.uri + '/' + this.domainId),
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };
    
    /**
     * Creates a ClientBuilder for client managing requests.
     *
     * @param {String} domainId Domain id (optional).
     * @param {String} clientId Client id (optional).
     *
     * @return {iam.ClientBuilder}
     */
    iam.client = function(domainId, clientId) {
        console.log('iamInterface.client');
        return new ClientBuilder(domainId, clientId);
    };
    
    /**
     * A builder for client management requests.
     *
     * @param {String} domainId Domain id.
     * @param {String} clientId Client id.
     *
     * @class
     * @memberOf iam
     */
    var ClientBuilder = iam.ClientBuilder = function(domainId, clientId) {
        this.domainId = domainId;
        this.clientId = clientId;
        this.uri = 'domain';
    };
    
    /**
     * Adds a new client.
     *
     * @method
     * @memberOf iam.ClientBuilder
     *
     * @param {Object} client                          The client data.
     * @param {String} client.id                       Client id.
     * @param {String} client.name                     Client domain (obligatory).
     * @param {String} client.key                      Client key (obligatory).
     * @param {String} client.version                  Client version.
     * @param {String} client.signatureAlghorithm      Signature alghorithm.
     * @param {Object} client.scopes                   Scopes of the client.
     * @param {String} client.clientSideAuthentication Option for client side authentication.
     * @param {String} client.resetUrl                 Reset password url.
     * @param {String} client.resetNotificationId      Reset password notification id.
     *
     * @return {Promise} A promise with the id of the created client or fails
     *                   with a {@link corbelError}.
     */
    ClientBuilder.prototype.create = function(client) {
        console.log('iamInterface.domain.create', client);
        return corbel.services.requestXHR({
            url: buildUri(this.uri + '/' + this.domainId + '/client'),
            method: corbel.services.method.POST,
            data: client,
            withAuth: true
        }).then(function(res) {
            return corbel.services.extractLocationId(res);
        });
    };
    
    /**
     * Gets a client.
     *
     * @method
     * @memberOf iam.ClientBuilder
     *
     * @param {String} clientId Client id.
     *
     * @return {Promise} A promise with the client or fails with a {@link corbelError}.
     */
    ClientBuilder.prototype.get = function() {
        console.log('iamInterface.domain.get', this.clientId);
        return corbel.services.request({
            url: buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * Updates a client.
     *
     * @method
     * @memberOf iam.ClientBuilder
     *
     * @param {Object} client                          The client data.
     * @param {String} client.name                     Client domain (obligatory).
     * @param {String} client.key                      Client key (obligatory).
     * @param {String} client.version                  Client version.
     * @param {String} client.signatureAlghorithm      Signature alghorithm.
     * @param {Object} client.scopes                   Scopes of the client.
     * @param {String} client.clientSideAuthentication Option for client side authentication.
     * @param {String} client.resetUrl                 Reset password url.
     * @param {String} client.resetNotificationId      Reset password notification id.
     *
     * @return {Promise} A promise or fails with a {@link corbelError}.
     */
    ClientBuilder.prototype.update = function(client) {
        console.log('iamInterface.domain.update', client);
        return corbel.services.request({
            url: buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
            method: corbel.services.method.PUT,
            data: client,
            withAuth: true
        });
    };
    
    /**
     * Removes a client.
     *
     * @method
     * @memberOf iam.ClientBuilder
     *
     * @param {String} clientId The client id.
     *
     * @return {Promise} A promise or fails with a {@link corbelError}.
     */
    ClientBuilder.prototype.remove = function() {
        console.log('iamInterface.domain.remove', this.domainId, this.clientId);
        return corbel.services.request({
            url: buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };
    
    /**
     * Creates a ScopeBuilder for scope managing requests.
     *
     * @param {String} id Scope id.
     *
     * @return {iam.ScopeBuilder}
     */
    iam.scope = function(id) {
        console.log('iamInterface.token');
        return new ScopeBuilder(id);
    };
    
    /**
     * A builder for scope management requests.
     *
     * @param {String} id Scope id.
     *
     * @class
     * @memberOf iam
     */
    var ScopeBuilder = iam.ScopeBuilder = function(id) {
        this.id = id;
        this.uri = 'scope';
    };
    
    /**
     * Creates a new scope.
     *
     * @method
     * @memberOf iam.ScopeBuilder
     *
     * @param {Object} scope        The scope.
     * @param {Object} scope.rules  Scope rules.
     * @param {String} scope.type   Scope type.
     * @param {Object} scope.scopes Scopes for a composite scope.
     *
     * @return {Promise} A promise with the id of the created scope or fails
     *                   with a {@link corbelError}.
     */
    ScopeBuilder.prototype.create = function(scope) {
        console.log('iamInterface.scope.create', scope);
        return corbel.services.requestXHR({
            url: buildUri(this.uri),
            method: corbel.services.method.POST,
            data: scope,
            withAuth: true
        }).then(function(res) {
            return corbel.services.extractLocationId(res);
        });
    };
    
    /**
     * Gets a scope.
     *
     * @method
     * @memberOf iam.ScopeBuilder
     *
     * @return {Promise} A promise with the scope or fails with a {@link corbelError}.
     */
    ScopeBuilder.prototype.get = function() {
        console.log('iamInterface.scope.get', this.id);
        return corbel.services.request({
            url: buildUri(this.uri + '/' + this.id),
            method: corbel.services.method.GET,
            withAuth: true
        });
    };
    
    /**
     * Removes a scope.
     *
     * @method
     * @memberOf iam.ScopeBuilder
     * @return {Promise} A promise user or fails with a {@link corbelError}.
     */
    ScopeBuilder.prototype.remove = function() {
        console.log('iamInterface.scope.remove', this.id);
        return corbel.services.request({
            url: buildUri(this.uri + '/' + this.id),
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };
    
    var buildUri = function(uri, id) {
        if (id) {
            uri += '/' + id;
        }
        return corbel.common.get('iamEndpoint') + uri;
    };
    
    var doGetTokenRequest = function(uri, params, setCookie) {
        var args = {
            url: buildUri(uri),
            method: corbel.services.method.GET,
            query: $.param(_.extend({ //TODO hacernos nuestro utils.param
                assertion: getJwt(params),
                'grant_type': corbel.common.get('grantType')
            }, params.oauth))
        };
    
        if (setCookie) {
            args.headers = {
                RequestCookie: 'true'
            };
        }
    
        return corbel.services.request(args);
    };
    
    var doPostTokenRequest = function(uri, params, setCookie) {
        var args = {
            url: buildUri(uri),
            method: corbel.services.method.POST,
            data: {
                assertion: getJwt(params),
                'grant_type': corbel.common.get('grantType')
            },
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        };
    
        if (setCookie) {
            args.headers = {
                RequestCookie: 'true'
            };
        }
        return corbel.services.request(args);
    };
    
    var getJwt = function(params) {
        if (params.jwt) {
            return params.jwt;
        }
        if (params.claims) {
            return corbel.jwt.generate(params.claims);
        } else {
            throw new Error('Create token request must contains either jwt or claims parameter');
        }
    };
    
    var getUser = function(method, uri, id, postfix) {
        return corbel.services.request({
            url: (postfix ? buildUri(uri, id) + postfix : buildUri(uri, id)),
            method: corbel.services.method.GET,
            withAuth: true
        });
    };


    return corbel;
});