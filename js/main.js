// sets the requirejs


if (typeof DEBUG === 'undefined') DEBUG = true;

'use strict';
require.config({
    //baseUrl: '/', // unknown use

    // 3rd party scripts
    paths: {
        jquery : "vendor/jquery/jquery.min",
        underscore : "vendor/underscore/lodash",
        backbone : "vendor/backbone/backbone",
        text: "vendor/require/text",
        parsley: "vendor/parsley/parsley",
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
        },
        parsley : {
            "deps" : ["jquery"]
        }
    } // end of shim configuration
});

// Include file dependencies
define([
    'app',
    'router',
    'models/SessionModel'
],function(app, Router, SessionModel) {

    // when the DOM is fully loadded
    $(document).ready(function() {

        // this event listener is to know if the device is ready, this works for Cordova.js
        document.addEventListener('deviceready',function() { console.log("deviceready trigged"); },false);
        console.log("DOM is ready");


        //app.initialize();    
        // Just use GET and POST to support all browser
        Backbone.emulateHTTP = true;

        // Create a new session model and scape it to the app global
        // this will be a singleton, which other modules can access
        app.session = new SessionModel({ });

        app.router = new Router();

        // check the auth status upon initialization,
        // before rendering anything or matchin routes
        //app.session.checkAuth({

            // start the Backbone routing once we have captured a user's auth status
            //complete: function() {

                // HTML5 pushState for URLs withouth hasbangs
                var hasPushstate = !!(window.history && history.pushState);
                if(hasPushstate) Backbone.history.start({ pushState: true, root: '/' });
                else Backbone.history.start();
            //}
        //});

        // All navigation that is relative shoul be passed through the navigate 
        // method, to be processed by the router. If the link has a 'data-bypass'
        // attribute, bypass the delegation completly
        $('#content').on('click',"a:not([data-bypass])", function(e) {
            e.preventDefault();
            var href = $(this).attr('href');
            app.router.navigate(href,{ trigger: true, replace: false });
        });
    });

});
