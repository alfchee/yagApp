define([
    'app'
], function(app) {
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

    _.addTemplateHelpers({
        getImageThumbSrc: function(id) {
            return app.IMG + 'establecimientos/thumb/' + id + '.jpeg';
        },
    });

    return EstablecimientoModel;
});