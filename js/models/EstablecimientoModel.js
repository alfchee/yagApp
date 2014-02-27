define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    'use strict';

    var EstablecimientoModel = Backbone.Model.extend({
        default: {
            nombre: '',
            direccion: ''
        }
    });

    return EstablecimientoModel;
});