
define([
    'app',

    'text!templates/home/loginTemplate.html',
    'text!templates/home/homeTemplate.html',

    'parsley',
    'utils'
], function(app, loginTemplate, homeTemplate){ 

    var HomeView = Backbone.View.extend({ 

        initialize: function() {
            console.log('Initialize HomeView');
            _.bindAll(this,'render','onPasswordKeyup','onLoginAttempt');
            navigator.geolocation.getCurrentPosition(this.geoSuccess,this.geoError);

            // listen for a session logged_in state changes an re-render
            this.listenTo(app.session,"change:logged_in", this.render);
        },

        events: {
            'click #login-btn': 'onLoginAttempt',
            'click #login-password-input': 'onPasswordKeyup',
        },

        //initialize template 
        //template:_.template(homeTemplate), 
        className: 'row',

        //render the content into div of view 
        render: function() { 
            //this.el is the root element of Backbone.View. By default, it is a div.    
            //$el is cached jQuery object for the view’s element. 
            //append the compiled template into view div container 
            //$(this.el).html(homeTemplate);

            if(app.session.get('logged_in')) this.template = _.template(homeTemplate);
            else this.template = _.template(loginTemplate);

            $(this.el).html(this.template({
                user: app.session.user.toJSON(),
            }));

            //return to enable chained calls 
            return this; 
        },

        geoSuccess: function(position) {
            $("#position").html('<p>latitude: ' + position.coords.latitude + " longitude: " + position.coords.longitude + "</p>");
        },

        geoError: function(err) {
            console.log('ERROR: '+ err);
        },//geoError()

        // allow enter press  to trigger login
        onPasswordKeyup: function(e) {
            var k = e.keyCode || e.which;

            if( k == 13 && $('#login-password-input').val() === '') {
                e.preventDefault();     // prevent enter-press submit when input is empty
            } else if(k == 13) {
                e.preventDefault();
                this.onLoginAttempt();
                return false;
            }
        },//onPasswordKeyup()

        onLoginAttempt: function(e) {
            if(e) e.preventDefault();

            if(this.$('#login-form').parsley('validate')) {
                app.session.login({
                    username: this.$('#login-username-input').val(),
                    password: this.$('#login-password-input').val() 
                },{
                    success: function(mod,res) {
                        if(DEBUG) console.log(mod,res);
                    },
                    error: function(mod,res) {
                        if(DEBUG) console.log("ERROR",mod,res);
                    }
                });
            } else {
                //invalid clientside validations thru parsley
                if(DEBUG) console.log('Did not pass clientside validations');
            }
        }, //onLoginAttempt
    }); 
    return HomeView; 
});