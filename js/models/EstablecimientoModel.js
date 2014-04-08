define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    'use strict';

    var EstablecimientoModel = Backbone.Model.extend({
        default: {
            nombre: '',
            direccion: ''
        },

        parse: function(response) {
            console.log('Parsing ' + JSON.stringify(response) + ' data');
            return response;
        }
    });

    return EstablecimientoModel;
});