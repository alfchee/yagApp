
define([
    'jquery',
    'underscore',
    'backbone',
    'views/homeView'
], function($, _, Backbone, HomeView){
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home'   
        }
    });
    
    var initialize = function() {
        var appRouter = new AppRouter;  
        
        appRouter.on('route:home', function() {
            var homeView = new HomeView({ el: $('#container') });
            homeView.render();
            //$('#home').trigger("create");
        });
        
        Backbone.history.start();
    };
    
    return {
        initialize: initialize   
    }
}); 