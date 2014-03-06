define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header/headerTemplate.html'
],function($, _, Backbone, headerTemplate) {
    'use strict';

    var HeaderView = Backbone.View.extend({

        template: _.template(headerTemplate),

        render: function() {
            $(this.el).html(this.template());

            return this;
        } // render()
    });

    return HeaderView;
});