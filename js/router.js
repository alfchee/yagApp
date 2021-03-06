
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

            app.snapper = new Snap({
                element: document.getElementById('content'),
                disable: 'right'
            });
        }, // initialize()

        //definition of routes
        routes: {
            '': 'showHome',
            'home': 'showHome',
            'nearMe' : 'nearMe',
            'search' : 'search',
            'est/:id' : 'estDetails',
            '*actions': 'defaultAction'
        },

        defaultAction: function(actions) {
            this.showHome();  
        },//defaultAction()

        showHome: function(actions) {
            //fix for non-pushState routing (IE9 and bellow)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), { trigger: true, replace: true});
            else {
                this.show( new HomeView({}) );
            }
        },//showHome()

        nearMe: function(actions) {
            var establecimientoView = new NearMeView();
            //establecimientoView.render();
        },//nearMe()

        search: function(actions) {
            var searchView = new SearchView();
            searchView.render();
        },//search()

        estDetails: function(id) {
            var estDetails = new EstablecimientoView({ estId: id });
        },//estDetails()
        //init: true,

        show: function(view, options) {
            //every page view in the router should need a header.
            // instead of creating a base parent view, just assign the view to this
            // so we can create it fi it doesn't exist

            // close and unbind any existing page view
            if(this.currentView) this.currentView.close();

            // Establish the requested view into scope
            this.currentView = view;

            
            $('#content').html(this.currentView.render().$el);

            if(!this.headerView) {
                this.headerView = new HeaderView({ });
                // render the header
                $('.header').html(this.headerView.render().el);
            } else {
                $('.header').html(this.headerView.render().el);
            }
        },//show()
        
    });
    
    return Router;
});