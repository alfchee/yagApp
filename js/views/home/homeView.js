
define([
    'jquery', 
    'underscore', 
    'backbone',
    'text!templates/home/homeTemplate.html'
], function($, _, Backbone, homeTemplate){ 

    var HomeView = Backbone.View.extend({ 

        initialize: function() {
            console.log('Initialize HomeView');
            navigator.geolocation.getCurrentPosition(this.geoSuccess,this.geoError);
        },

        //initialize template 
        template:_.template(homeTemplate), 
        className: 'row',

        //render the content into div of view 
        render: function() { 
            //this.el is the root element of Backbone.View. By default, it is a div.    
            //$el is cached jQuery object for the view’s element. 
            //append the compiled template into view div container 
            $(this.el).html(homeTemplate);

            //return to enable chained calls 
            return this; 
        },

        geoSuccess: function(position) {
            $("#position").html('<p>latitude: ' + position.coords.latitude + " longitude: " + position.coords.longitude + "</p>");
        },

        geoError: function(err) {
            console.log('ERROR: '+ err);
        }
    }); 
    return HomeView; 
});