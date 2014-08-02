define([
    'jquery',
    'underscore',
    'backbone',
    'models/ComentarioModel',
    'text!templates/establecimiento/comentarioListItem.html'
],function($, _, Backbone, ComentarioModel, comentarioListItem) {
    'use strict';

    var ComentarioListItemView = Backbone.View.extend({
        tagName: 'li',

        className: 'list-group-item',

        template: _.template(comentarioListItem),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });

    return ComentarioListItemView;
});