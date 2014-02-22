// sets the requirejs
'use strict';

require.config({
    // 3rd party scripts
    paths: {
        jquery : "vendor/jquery/jquery.min",
        jqm : "vendor/jquery/jquery.mobile-min",
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
define(['app','jqm-config'],function(app) {
    $(document).ready(function() {
        console.log("DOM is ready");
        app.initialize();
    });
});

/*require(["jquery","backbone","router","jqm"], function($, Backbone, Router) {
    $.mobile.ajaxEnabled = false;
    // Prevents all anchor click handling
    $.mobile.linkBindingEnabled = false;
    $.mobile.pushStateEnabled = false
    // Disabling this will prevent jQuery Mobile from handling hash changes
    $.mobile.hashListeningEnabled = false;
    
    // Remove page from DOM when it's being replaced
    $('div[data-role="page"]').on('pagehide', function (event, ui) {
        $(event.currentTarget).remove();
    });
    
    Router.initialize();
    
});*/