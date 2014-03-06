define([
    'jquery',
    'underscore',
    'backbone',
    'collections/EstablecimientoCollection',
    'views/establecimiento/EstablecimientoListItemView',
    'text!templates/establecimiento/establecimientoTemplate.html'
],function($, _, Backbone, EstablecimientoCollection, EstablecimientoListItemView, establecimientoTemplate) {
    'use strict';

    var EstablecimientoView = Backbone.View.extend({
        initialize: function() {
            console.log('EstablecimientoView init');
            var self = this;

            _.bindAll(this,"render");
            this.listenTo(self.collection, "reset", self.render);

            this.collection.fetch({ reset: true });
        },
        
        //el: '#content',
        tagName: 'ul',
        className: 'list-group',
        
        //template: _.template(establecimientoTemplate),

        render: function(eventName) {
            console.log(this.collection.length);
            $(this.el).empty();
            $('#content').html($(this.el));

            _.each(this.collection.models, function(establecimiento) {
                var itemView = new EstablecimientoListItemView({ model: establecimiento });

                this.$el.append(itemView.render().el);
            },this);
            
            return this;
        }
    });

    return EstablecimientoView;
});