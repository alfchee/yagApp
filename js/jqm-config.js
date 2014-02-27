define(['jquery'], function($) {
    'use strict';
    
    $(document).on('mobileinit',function() {
        console.log('mobileinit');
        // can cause calling object creation twice and back button issues are solved
        $.mobile.ajaxEnabled = false;
        // disable anchor-control
        $.mobile.linkBindingEnabled = false;
        // disable hash-routing
        $.mobile.hashListeningEnabled = false;
        // Otherwise after mobileinit, it tries to load a landing page
        $.mobile.autoInitializePage = false;
        // we want to handle caching and cleaning the DOM ourselves
        $.mobile.page.prototype.options.domCache = false;

        // consider due to compatibility issues
       // not supported by all browsers
       $.mobile.pushStateEnabled = false;
       // Solves phonegap issues with the back-button
       $.mobile.phonegapNavigationEnabled = true;
       //no native datepicker will conflict with the jQM component
       $.mobile.page.prototype.options.degradeInputs.date = true;

        
        $('div[data-role="page"]').on('pagecontainerhide', function (event, ui) { 
            $(event.currentTarget).remove(); 
        });
    });
});