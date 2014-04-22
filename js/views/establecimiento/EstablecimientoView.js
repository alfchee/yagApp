define([
    'app',

    'views/establecimiento/ComentarioListItemView',
    'models/EstablecimientoModel',
    'collections/ComentarioCollection',
    'text!templates/establecimiento/establecimientoTemplate.html'
],function(app, ComentarioListItemView, EstablecimientoModel, ComentarioCollection, establecimientoTemplate) {
    'use strict';

    var EstablecimientoView = Backbone.View.extend({
        initialize: function(options) {
            console.log('EstablecimientoView init');
            var self = this;
            // initialize the model to show in this view
            this.model = new EstablecimientoModel();
            this.commentCollection = new ComentarioCollection({ estId: options.estId });
            // set the url for the retrieve of the information
            this.model.url = app.API + '/establecimientos/' + options.estId;

            // to bind "this" inside this methods
            _.bindAll(this,"render","takePicture","upload","sendComment","renderComments");

            // to listen events for this objects
            this.listenTo(self.model, "reset", self.render);
            this.listenTo(this.model, "change", self.render);
            this.listenTo(this.commentCollection,"reset",self.renderComments);

            // fetching the information for these object and collection
            this.model.fetch({ reset: true });
            this.commentCollection.fetch({ reset: true });

        },
        
        el: '#content',
        
        template: _.template(establecimientoTemplate),

        // events handlers
        events: {
            'click #take-pic' : 'takePicture',
            'click #send-opinion' : 'sendComment'
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
            // showing a message if there is no comments
            if(this.commentCollection.length < 1) {
                $('#comment-info').removeClass('hidden');
            }

            
            
            return this;
        },//render()

        renderComments: function(e) {
            // rendering the comments for each one in the collection
            _.each(this.commentCollection.models, function(comentario) {
                var commentView = new ComentarioListItemView({ model: comentario });
                $('#comments-list').html(commentView.render().el);
            }, this);
        },//renderComments()

        sendComment: function(e) {
            console.log(e);
            var self = this,
                username = app.session.user.attributes.username,
                estId = this.model.attributes._id;

            var postData = $('#CommentForm').serialize();

            var query = $.ajax({
                type: 'post',
                data: postData,
                url: app.URL + '/establecimientos/comment?user=' + username + '&est=' + estId,
                crossDomain: true,
            });

            query.done(function(response) {
                alert('Enviado ;)');
                self.clearForm();
                $('#myComment').modal('hide');

                self.commentCollection.fetch({ reset: true });
            });

            query.fail(function(jqXHR, textStatus) {
                console.log(textStatus);
                alert(textStatus);
            });
        },//sendComment()

        // method to clear the form of the comments after this is sent
        clearForm: function() {
            $('#CommentForm input').val('');
            $('#CommentForm input[type=radio]').attr('checked',false);
            $('#CommentForm textarea').val('Yo opino...');
        },//clearForm()

        takePicture: function(e) {
            e.preventDefault();
            var options = {
                quality: 75,
                targetWidth: 1000,
                targetHeight: 1000,
                destinationType: Camera.DestinationType.FILE_URI,
                //destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA 
            };

            var self = this;

            navigator.camera.getPicture(function(imageURI) {
                console.log(imageURI);
                self.upload(imageURI);
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

            options.fileKey = "file"; // this is the name that appears in req.files
            options.fileName = "filename.jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = { // in nodejs this can be retreived in req.body
                "description": "uploaded from my phone",
                "user" : app.session.user.attributes.username,
                "est" : this.model.attributes._id
            };
            options.headers = { 'Authorization': 'Bearer ' + app.session.getSess('token') };

            ft.upload(imageURI, 'http://192.168.0.27:3001' + '/establecimientos/upload-pic',
                function(e) {
                    alert("must refresh");
                }, function(e) {
                    alert("upload failed : " + e.message);
                }, options);
        },//upload()
    });

    return EstablecimientoView;
});