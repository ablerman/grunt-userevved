/*
 * grunt-userevved
 *
 *
 * Copyright (c) 2014 Sandy Lerman
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var json = require('json3');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('userevved', 'Use revved filenames for static assets.', function () {

        var summary = grunt.filerev.summary;
        console.log(summary);

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });

        this.processMap = function() {
            var mapfiles = grunt.file.expand(this.data.map);
            _.each(mapfiles, function(path) {
                var pathParts = path.split('/');
                var justThePath = pathParts.slice(0, pathParts.length-1).join('/');
                var content = grunt.file.readJSON(path);

                var lookupVal = justThePath + '/' + content.file;
                if(_.has(summary, lookupVal)) {
                    var newFile = summary[lookupVal];
                    var parts = newFile.split('/');

                    content.file = parts[parts.length-1];
                    grunt.file.write(path, json.stringify(content) );
                }
            });
        };
        this.processMap();

        this.processJs = function() {
            var jsFiles = grunt.file.expand(this.data.js);
            _.each(jsFiles, function(path) {
                console.log('+' + path)
                var pathParts = path.split('/');
                var justThePath = pathParts.slice(0, pathParts.length-1).join('/');
                var content = grunt.file.read(path);

                var re = /\/\/# sourceMappingURL=(.+)/gm;
                var matches = content.match(re);
                content = content.replace(re, function(match, group) {
                    var lookupVal = justThePath + '/' + group;
                    if(_.has(summary, lookupVal)) {
                        var newFile = summary[lookupVal];
                        var parts = newFile.split('/');
                        return '//# sourceMappingURL=' + parts[parts.length-1];
                    }
                    return match;
                });
                grunt.file.write(path, content);
                console.log('-' + path)
            });
        };
        this.processJs();


        var processHtml = function() {

        };

        var processCss = function() {

        };

        var processJs = function() {

        };
    });
};
