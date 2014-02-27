define([
    'underscore',
    'backbone',
    'models/EstablecimientoModel'
],function(_, Backbone, EstablecimientoModel) {
    'use strict';

    var EstablecimientoCollection = Backbone.Collection.extend({
        model: EstablecimientoModel,

        initialize: function(models, options) {
            console.log('EstablecimientoCollection init');
        },

        url: function() {
            return 'http://localhost:3000/establecimiento'
        },

        sync: function(method, collection, options) {
            options.dataType = 'jsonp';
            return Backbone.sync(method, collection, options);
        },

        parse: function(response) {
            console.log('Parsing ' + JSON.stringify(response) + ' data');
            return response;
        }
    });

    return EstablecimientoCollection;
});