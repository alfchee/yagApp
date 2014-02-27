
define([
    'jquery',
    'underscore',
    'backbone',
    'views/home/homeView',
    'views/establecimiento/EstablecimientoView',
    'collections/EstablecimientoCollection',
    'jqm'
], function($, _, Backbone, HomeView, EstablecimientoView, EstablecimientoCollection) {
    'use strict';
    var Router = Backbone.Router.extend({
        //definition of routes
        routes: {
            '': 'showHome',
            'home': 'showHome',
            'nearMe' : 'nearMe',
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
        nearMe: function(actions) {
            var estColl = new EstablecimientoCollection();
            var establecimientoView = new EstablecimientoView({ collection: estColl });
            this.changePage(establecimientoView);
        },
        init: true,
        dataHandler: function(data) {
            console.log(JSON.stringify(data));
        },
        changePage: function(view) {
            //add the attribute data-role="page" for each view's div
            $(view.el).attr('data-role','page');
            view.render();
            // append to the DOM
            $('body').append($(view.el));
            var transition = $.mobile.defaultPageTransition;
            
            if(this.firstPage) {
                transition = 'none';
                this.firstPage = false;
            }

            // remove page from DOM when it's being replaced
            $('div[data-role="page"]').on('pagehide', function (event, ui) { 
                $(this).remove();
            });

            $.mobile.changePage($(view.el), { transition: transition, changeHash: false });   
            
        } // end of changePage()
    });
    
    return Router;
});