define([
    'underscore',
    'backbone',
    'models/EstablecimientoModel'
],function(_, Backbone, EstablecimientoModel){
       
    var EstablecimientoCollection = Backbone.Collection.extend({
        model: EstablecimientoModel,
        
        initialize: function(models, options) {
            console.log("Establecimiento initialize");
        },
    
        url: function() {
            //return '../js/establecimientos.json';  
            return 'http://localhost:3000/establecimiento';
        },

        sync: function(method, collection, options) {
            options.dataType= 'jsonp';
            return Backbone.sync(method,collection,options);
        },
            
        parse: function(response) {
            console.log("End of loading data " + JSON.stringify(response) + " datos");
            return response;   
        },
    });

    return EstablecimientoCollection;
});