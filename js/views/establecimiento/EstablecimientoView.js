define([
    'app',

    'models/EstablecimientoModel',
    'text!templates/establecimiento/establecimientoTemplate.html'
],function(app, EstablecimientoModel, establecimientoTemplate) {
    'use strict';

    var EstablecimientoView = Backbone.View.extend({
        initialize: function(options) {
            console.log('EstablecimientoView init');
            var self = this;
            // initialize the model to show in this view
            this.model = new EstablecimientoModel();
            // set the url for the retrieve of the information
            this.model.url = app.API + '/establecimientos/' + options.estId;

            _.bindAll(this,"render","takePicture");
            this.listenTo(self.model, "reset", self.render);
            this.listenTo(this.model, "change", self.render);

            this.model.fetch({ reset: true });


        },
        
        el: '#content',
        
        template: _.template(establecimientoTemplate),

        events: {
            'click #take-pic' : 'takePicture'
        },

        render: function(eventName) {
            

            $(this.el).empty();
            $(this.el).html(this.template(this.model.toJSON() ));
            
            var mapOptions = {
                center: new google.maps.LatLng(this.model.attributes.coordinates.y,this.model.attributes.coordinates.x),
                zoom: 10
            };
            
            var map = new google.maps.Map($('#est-map')[0],
                            mapOptions);

            //$('#content').html($(this.el));

            
            return this;
        },

        takePicture: function(e) {
            e.preventDefault();
            var options = {
                quality: 65,
                targetWidth: 1000,
                targetHeight: 1000,
                destinationType: Camera.DestinationType.FILE_URI,
                //destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA 
            };

            navigator.camera.getPicture(function(imageURI) {
                console.log(imageURI);
                //this.upload(imageURI);
                var image = document.getElementById('est-map');
                //image.src = "data:image/jpeg;base64," + imageURI;
                image.src = imageURI;
            }, function(message) {
                // case of fail
                alert('Failed because: ' + message);
            }, options);

            return false;
        },//takePicture()

        upload: function(imageURI) {
            var ft = new FileTransfer(),
                options = new FileUploadOptions();

            options.fileKey = "file";
            options.fileName = "filename.jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = { // in nodejs this can be retreived in req.body
                "description": "uploaded from my phone"
            };

            ft.upload(inageURI, app.API + '/upload-pics',
                function(e) {
                    alert("must refresh");
                }, function(e) {
                    alert("upload failed");
                }, options);
        },//upload()
    });

    return EstablecimientoView;
});