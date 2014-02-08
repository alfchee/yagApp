
define([
    'jquery',
    'underscore',
    'backbone',
    'views/home/homeView',
    'jqm'
], function($, _, Backbone, HomeView) {
    'use strict';
    var Router = Backbone.Router.extend({
        //definition of routes
        routes: {
            '': 'showHome',
            'home': 'showHome',
            '*actions': 'defaultAction'
        },
        defaultAction: function(actions) {
            this.showHome();  
        },
        showHome: function(actions) {
            var homeView = new HomeView();
            homeView.render();
            this.changePage(homeView);
        },
        init: true,
        changePage: function(view) {
            //add the attribute data-role="page" for each view's div
            view.$el.attr('data-role','page');
            view.$el.attr('id',view.tagId);
            // append to the DOM
            $('body').append(view.$el);
            
            //if(!this.init) {
            $.mobile.changePage($(view.el), { reverse:false, changeHash: false });   
            //} else {
            //    this.init = false;   
            //}
        } // end of changePage()
    });
    
    return Router;
});