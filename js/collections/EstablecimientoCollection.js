define([
    'app',
    'models/EstablecimientoModel'
],function(app, EstablecimientoModel) {
    'use strict';

    var EstablecimientoCollection = Backbone.Collection.extend({
        model: EstablecimientoModel,

        initialize: function(models, options) {
            console.log('EstablecimientoCollection init');
        },

        url: function(coords) {
            return  app.API + '/establecimientos';
        },

        sync: function(method, collection, options) {
            options || (options = {});

            options.crossDomain = true;
            options.headers = { 'Authorization' : 'Bearer ' + app.session.getSess('token') };

            return Backbone.sync(method, collection, options);
        },

        parse: function(response) {
            //console.log('Parsing ' + JSON.stringify(response) + ' data');
            return response;
        }
    });

    return EstablecimientoCollection;
});