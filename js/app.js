
define([
    'jquery',
    'underscore',
    'backbone',
    'utils',
    'bootstrap',
    'gmaps',
    'snapjs',
    'async',
    'jsoauth',
    'templateHelpers' 
], function($, _, Backbone, Utils, bootstrap, gmaps, snapjs, async) {
    'use strict';
    
    var app = {
        root : '/',         // the root path to run the application trought
        URL : 'http://192.168.1.2:3001',          // Base application URL
        API : 'http://192.168.1.2:3001/api',       // Base API URL (used by models and collections)
        IMG : 'http://others.localhost/yag/web/bundles/upload/',
        //URL : 'http://162.243.16.24:3001',
        //API : 'http://162.243.16.24:3001/api',
        //IMG : 'http://goideas.net/bundles/upload/',

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

        // to parse the profile
        urlBase64Decode: function(str) {
            var output = str.replace("-","+").replace("_","/");
            switch(output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += "==";
                    break;
                case 3:
                    output += "=";
                    break;
                default:
                    throw "Illegal base64url string!";
            }
            return window.atob(output);
        },//urlBase64Decode()

        googleapi : {
            authorize : function(options){
                var derrefed = $.Derrefed()
                derrefed.reject({ error: 'Not implemented' });
                return derrefed.promise();
            }
        }
    };

    //global event aggregator 
    app.eventAggregator = _.extend({}, Backbone.events);

    return app;
    
});