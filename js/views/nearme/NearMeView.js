define([
    'app',

    'views/establecimiento/EstablecimientoListItemView',
    'collections/EstablecimientoCollection',
    'text!templates/nearme/nearmeTemplate.html',
    'text!templates/header/nearmeHeaderTemplate.html'
], function(app, EstablecimientoListItemView, EstablecimientoCollection, nearmeTemplate, headerTemplate) {
    'use strict';


    var NearMeView = Backbone.View.extend({
        initialize: function() {
            console.log('NearMeView init');

            // Initialize the collection to show in this view
            this.collection = new EstablecimientoCollection();
            // set the url for the retrieve of the information
            this.collection.url = app.API + '/establecimientos/near/';

            var self = this;


            // asking for the current position to the device
            navigator.geolocation.getCurrentPosition(function(position) {
                self.coords = position.coords;
                // fetching the collection by means the current position
                self.collection.fetch({ reset: true, data: $.param({ "lon": position.coords.longitude, "lat": position.coords.latitude }) });
            },function(err) {
                alert('Code: ' + err.code + '. Mensaje: ' + err.message);
            });

            _.bindAll(this,'render');
            this.listenTo(self.collection,"reset",self.render);
        },//initialize()

        el: '#content',
        template: _.template(nearmeTemplate), // template of the view
        templateHeader: _.template(headerTemplate), // template for the header of the view

        render: function(eventName) {
            console.log(this.collection.length);
            $(this.el).empty(); // clearing the view
            $(this.el).html(this.template); // here we render the basic template
            $('#header-content').html(this.templateHeader); // adding the header
            $('#back-btn').on('click',this.goBack); // event on the "Back" button

            // showing a message if there's no elements in the collection
            if(this.collection.length < 1) {
                $('#nearme-info').removeClass('hidden');
                $('#nearme-map').addClass('hidden');
            } else {
                // if there's elemnts in the collection, we render the map
                this.renderMap(this.collection, $('#nearme-map'));
            }

            // rendering the subviews for each item in the collection
            _.each(this.collection.models,function(establecimiento) {
                var itemView = new EstablecimientoListItemView({ model: establecimiento });

                $('.list-group').append(itemView.render().el);
            },this);

            return this;
        },// render()

        renderMap: function(collection, maptag) {
            var url = 'http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyA6ALD0IZKUrgtSgswquK0VzzEN_qltvVE&sensor=false&size=640x320&scale=2';

            // our own position
            url += '&markers=size:mid|color:blue|label:I|' + this.coords.latitude + ',' + this.coords.longitude;
            // settings of the positions markers
            url += '&markers=color:red|';

            // adding the coordinates of each item to the marker
            _.each(collection.models, function(est) {
                url += est.attributes.loc.x + ',' + est.attributes.loc.y +'|';
            });

            // changing the src of te img tag
            maptag.attr('src',url);
        }, //renderMap()

        goBack: function(event) {
            window.history.back(); // going back in history
            $('#header-content').empty(); // reset the header
        },//goBack()

        close: function(){
            this.remove();
            this.off();
        }, // close()
    });

    return NearMeView;
});