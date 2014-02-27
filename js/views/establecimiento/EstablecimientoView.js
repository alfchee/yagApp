define([
    'jquery',
    'underscore',
    'backbone',
    'collections/EstablecimientoCollection',
    'text!templates/establecimiento/establecimientoTemplate.html'
],function($, _, Backbone, EstablecimientoCollection, establecimientoTemplate) {
    'use strict';

    var EstablecimientoView = Backbone.View.extend({
        initialize: function() {
            console.log('EstablecimientoView init');
            var self = this;

            _.bindAll(this,"render");
            this.listenTo(self.collection, "reset", self.render);

            //this.collection.fetch({ reset: true });
        },
        
        el: '#yagapp',
        
        template: _.template(establecimientoTemplate),

        render: function(eventName) {
            console.log(this.collection.length);
            $(this.el).html(establecimientoTemplate);

            return this;
        }
    });

    return EstablecimientoView;
});