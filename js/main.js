// sets the requirejs
'use strict';

require.config({
    // 3rd party scripts
    paths: {
        jquery : "vendor/jquery/jquery.min",
        underscore : "vendor/underscore/lodash",
        backbone : "vendor/backbone/backbone",
        text: "vendor/require/text",
        templates: '../templates',
        model: 'models'
    },
    // set the configuration for AMD not compatible
    shim: {
        underscore: {
            exports: '_'  
        },
        backbone : {
            "deps" : ["underscore","jquery"],
            "exports": "Backbone" // attaches backbone to the window object
        }
    } // end of shim configuration
});

// Include file dependencies
define(['app'],function(app) {
    $(document).ready(function() {
        document.addEventListener('deviceready',function() { console.log("deviceready trigged"); },false);
        console.log("DOM is ready");
        app.initialize();    
    });
});
