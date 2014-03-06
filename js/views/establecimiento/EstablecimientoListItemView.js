define([
    'jquery',
    'underscore',
    'backbone',
    'models/EstablecimientoModel',
    'text!templates/establecimiento/establecimientoListItem.html'
],function($, _, Backbone, EstablecimientoModel, establecimientoListItem) {
    'use strict';

    var EstablecimientoListItemView = Backbone.View.extend({
        tagName: 'li',

        className: 'list-group-item',

        template: _.template(establecimientoListItem),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });

    return EstablecimientoListItemView;
});