
define([
    'jquery',
    'underscore',
    'backbone',
    'utils'
], function($, _, Backbone) {
    'use strict';
    
    var app = {
        root : '/',         // the root path to run the application trought
        URL : 'http://localhost:3000',          // Base application URL
        API : 'http://localhost:3000/api',       // Base API URL (used by models and collections)

        // show alert classes and hide after a specified timeout
        showAlert: function(title, text, klass) {
            $('#header-alert').removeClass('alert-error alert-warning alert-success alert-info');
            $('#header-alert').addClass(klass);
            $('#header-alert').html('<button class="close" data-dismiss="alert">x</button><strong>' + title + '</strong>' +  text);
            $('#header-alert').show('fast');
            setTimeout(function() {
                $('header-alert').hide();
            }, 7000);
        },//showAlert()
    };

    $.ajaxSetup({ cache: false });  // force ajax call on all browsers

    var proxiedSync = Backbone.sync;

    Backbone.sync = function(method, model, options) {
        options || (options = {});

        if(!options.crossDomain)
            options.crossDomain = true;

        if(!options.xhrFields)
            options.xhrFields = { withCredentials: true };

        return proxiedSync(method, model, options);
    };

    //global event aggregator 
    app.eventAggregator = _.extend({}, Backbone.events);

    return app;
    
});