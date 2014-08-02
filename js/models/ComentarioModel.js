define([
    'underscore',
    'backbone'
], function(_,Backbone) {
    'use strict';

    var ComentarioModel = Backbone.Model.extend({
        default: {
            titulo: '',
            fecha: '',
            usuario: '',
            establecimiento: '',
            comentario: '',
            ranking: 0
        }
    });

    return ComentarioModel;
})