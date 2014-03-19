
define([
    'app',

    'models/SessionModel',
    'models/UserModel',

    'views/header/HeaderView',
    'views/home/homeView',
    'views/establecimiento/EstablecimientoView',
    'views/nearme/NearMeView',
    'views/search/SearchView',

    'utils'
], function(app, SessionModel, UserModel, HeaderView, HomeView, EstablecimientoView, NearMeView, SearchView) {
    'use strict';
    var Router = Backbone.Router.extend({

        initialize: function() {
            _.bindAll(this,'showHome','show');

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
            //fix for non-pushState routing (IE9 and bellow)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), { trigger: true, replace: true});
            else {
                this.show( new HomeView({}) );
            }

            /*if(!this.homeView) {
                this.homeView = new HomeView();
                this.homeView.render();
            } else {
                this.homeView.delegateEvents(); // delegate events when is recycled
            }
            $('#content').html(this.homeView.el);*/
        },
        nearMe: function(actions) {
            var establecimientoView = new NearMeView();
            //establecimientoView.render();
        },
        search: function(actions) {
            var searchView = new SearchView();
            searchView.render();
        },
        //init: true,

        show: function(view, options) {
            //every page view in the router should need a header.
            // instead of creating a base parent view, just assign the view to this
            // so we can create it fi it doesn't exist
            if(!this.headerView) {
                this.headerView = new HeaderView({ });
                // render the header
            }

            // close and unbind any existing page view
            if(this.currentView) this.currentView.close();

            // Establish the requested view into scope
            this.currentView = view;

            // need to be authenticated before rendering the view
            // for cases like a user's settings page where needed to double check against the server
            if(typeof options !== 'undefined' && options.requiresAuth) {
                var self = this;
                app.session.checkAuth({
                    success: function(res) {
                        // if auth succcessfull, render inside the page wrapper
                        $('#content').html(self.currentView.render().$el);
                    },
                    error: function(res) {
                        self.navigate('/',{ trigger: true, replace: true });
                    }
                });
            } else {
                // render inside the page wrapper
                $('#content').html(this.currentView.render().$el);
            }
        },
        
    });
    
    return Router;
});