define([
    'underscore',
    'backbone'
],function(_, Backbone) {
    
    var EstablecimientoModel = Backbone.Model.extend({
        default: {
        	nombre: ''
        }
    });
    
    return EstablecimientoModel;
});