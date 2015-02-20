/*
 * metalsmith-swig-helpers
*/

'use strict';

var swig = require("swig"),
    _str = require("underscore.string"),
    debug = require("debug")("metalsmith-swig-helpers");

module.exports = function plugin( data ) {

    data = (('object' === typeof data)? data : undefined) || {};

    return function through (files, metalsmith, done) {

        /* Slugifies the input using underscore.string
         * @example
         * {{varName|slug}}
         */
         swig.setFilter('slug', function(input){
          return _str.slugify(input).toLowerCase();
        });

        /* When slugified and lowercased does input match the slugified and lowercased compareTo?
         * @example
         * {% set navItemIsActivePage = navItem.name|isSlugMatch(title) %}
         * {% if navItemIsActivePage == true %}
         *  <li class="active">…</li>
         * {% else %}
         *  <li>…</li>
         */
        swig.setFilter('isSlugMatch', function(input,compareTo) {
          return (_str.slugify(input).toLowerCase() == _str.slugify(compareTo).toLowerCase());
        });

        /* Take the input and provides a truncated version…
         * @example
         * {{varName|excerpt}} or {{varName|excerpt|120}}
         */
        swig.setFilter('limit', function(input,limit) {

          var output;

          if(!limit) limit = 140;

          if( input.length < limit ) return input;

          if( input.lastIndexOf( ' ' ) > 0 ) {
            output = input.substr( 0, input.lastIndexOf( ' ', limit ) ) + '…';
          } else {
            output = input.substr( 0, -1 ) + '…';
          }

          return output;

         });

        done();

    };
}
