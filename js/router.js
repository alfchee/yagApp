
define([
    'jquery',
    'underscore',
    'backbone',
    'views/header/HeaderView',
    'views/home/homeView',
    'views/establecimiento/EstablecimientoView',
    'views/nearme/NearMeView',
    'views/search/SearchView',
    'collections/EstablecimientoCollection'
], function($, _, Backbone, HeaderView, HomeView, EstablecimientoView, NearMeView, SearchView, EstablecimientoCollection) {
    'use strict';
    var Router = Backbone.Router.extend({

        initialize: function() {
            this.headerView = new HeaderView();
            $('.header').html(this.headerView.render().el);
        }, // initialize()

        //definition of routes
        routes: {
            '': 'showHome',
            'home': 'showHome',
            'nearMe' : 'nearMe',
            'search' : 'search',
            '*actions': 'defaultAction'
        },
        defaultAction: function(actions) {
            this.showHome();  
        },
        showHome: function(actions) {
            if(!this.homeView) {
                this.homeView = new HomeView();
                this.homeView.render();
            } else {
                this.homeView.delegateEvents(); // delegate events when is recycled
            }
            $('#content').html(this.homeView.el);
        },
        nearMe: function(actions) {
            var establecimientoView = new NearMeView();
            //establecimientoView.render();
        },
        search: function(actions) {
            var searchView = new SearchView();
            searchView.render();
        },
        init: true,
        
    });
    
    return Router;
});