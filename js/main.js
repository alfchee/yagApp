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
        bootstrap: "vendor/bootstrap/bootstrap",
        templateHelpers: "vendor/underscore/underscore.template-helpers",
        gmaps : "vendor/hpneo/gmaps",
        snapjs : "vendor/snapjs/snap",
        jsoauth : "vendor/jsoauth/jsOAuth",
        async : "vendor/async/async",
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
        bootstrap: { "deps" : ["jquery"] },
        parsley : {
            "deps" : ["jquery"]
        },
        templateHelpers : {
            "deps" : ["underscore"]
        },
        jsoauth : { "deps" : ["templateHelpers"] }
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
        //Backbone.emulateHTTP = true;

        // Create a new session model and scape it to the app global
        // this will be a singleton, which other modules can access
        app.session = new SessionModel({ });

        app.router = new Router();


        // if somewhere in the execution of the app we obtain an 401 error
        // the app will to logout
        $.ajaxSetup({ 
            cache: false,
            statusCode: {
                401: function() {
                    app.session.logout();
                }
            },

        });  // force ajax call on all browsers

        // check the auth status upon initialization,
        // before rendering anything or matchin routes

        Backbone.history.start();

        app.session.checkAuth();

        // store the original Backbone.sync to call it again from the one we make
        var proxiedSync = Backbone.sync;

        Backbone.sync = function(method, model, options) {
            options || (options = {});

            // make the consults by means CORS
            if(!options.crossDomain)
                options.crossDomain = true;

            if(app.session.get('logged_in')) {
                // change the headers options
                options.headers = {
                    'Authorization' : 'Bearer ' + app.session.getSess('token'),
                };
            }

            options.statusCode = {
                401: function() {
                    app.session.logout();
                }
            };

            return proxiedSync(method, model, options);
        };//Backbone.sync()

    });

});
