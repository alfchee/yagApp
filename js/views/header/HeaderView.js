define([
    'app',
    
    'text!templates/header/headerTemplate.html',
    'utils',
],function(app, headerTemplate) {
    'use strict';

    var HeaderView = Backbone.View.extend({

        template: _.template(headerTemplate),

        initialize: function() {
            _.bindAll(this,'onLoginStatusChange','render');

            // listen for a session logged_in state changes and re-render
            this.listenTo(app.session,"change:logged_in",this.onLoginStatusChange);
        },//initialize()

        events: {
            "click #logout-link" : "onLogoutClick",
        },//events

        onLoginStatusChange: function(e) {
            this.render();
            if(app.session.get("logged_in")) app.showAlert('Succes!',"Logged in as " + app.session.user.get("username"),"alert-success");
            else app.showAlert("See ya!","Logged out successfully","alert-success");
        },//onLoginStatusChange()

        onLogoutClick: function(e) {
            e.preventDefault();
            app.session.logout({}); //no callbacks needed b/c of session event listenig
        },//onLogoutClick()

        render: function() {
            if(DEBUG) console.log("RENDER::",app.session.user.toJSON(),app.session.toJSON);

            $(this.el).html(this.template({
                logged_in: app.session.get("logged_in"),
                user: app.session.user.toJSON()
            }));

            return this;
        } // render()
    });

    return HeaderView;
});