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
            _.bindAll(this,"render","takePicture","uploadPicture","sendComment","renderComments","showPicture");

            // to listen events for this objects
            this.listenTo(self.model, "reset", self.render);
            this.listenTo(this.model, "change", self.render);
            this.listenTo(this.commentCollection,"reset",self.renderComments);

            // fetching the information for these object and collection
            this.model.fetch({ reset: true });
            this.commentCollection.fetch({ reset: true });

        },
        
        el: '#content',
        imageURI : null,
        
        template: _.template(establecimientoTemplate),

        // events handlers
        events: {
            'click #take-pic' : 'takePicture',
            'click #send-opinion' : 'sendComment',
            'click #send-pic' : 'uploadPicture'
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

            $('#send-pic').on('click',self.uploadPicture());

            //$('#content').html($(this.el));
            // showing a message if there is no comments
            if(this.commentCollection.length < 1) {
                $('#comment-info').removeClass('hidden');
            }

            
            
            return this;
        },//render()

        renderComments: function(e) {
            $('#comments-list').empty();
            // rendering the comments for each one in the collection
            _.each(this.commentCollection.models, function(comentario) {
                var commentView = new ComentarioListItemView({ model: comentario });
                $('#comments-list').append(commentView.render().el);
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
                self.clearCommentForm();
                $('#myComment').modal('hide');

                self.commentCollection.fetch({ reset: true });
            });

            query.fail(function(jqXHR, textStatus) {
                console.log(textStatus);
                alert(textStatus);
            });
        },//sendComment()

        // method to clear the form of the comments after this is sent
        clearCommentForm: function() {
            $('#CommentForm input').val('');
            $('#CommentForm input[type=radio]').attr('checked',false);
            $('#CommentForm textarea').val('Yo opino...');
        },//clearForm()

        clearPictureForm: function() {
            $('#picture').attr('src','#');
            $('#pic-title').val('');
            $('#pic-pie').val('');
        },//clearPictureForm()

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
                self.imageURI = imageURI;
                self.clearPictureForm();
                self.showPicture();
            }, function(message) {
                // case of fail
                alert('Failed because: ' + message);
            }, options);

            return false;
        },//takePicture()

        showPicture: function() {
            $('#picture').attr('src',this.imageURI);
            $('#myPicture').modal('show');
        },//showPicture()

        uploadPicture: function() {
            var ft = new FileTransfer(),
                options = new FileUploadOptions(),
                self = this;

            options.fileKey = "file"; // this is the name that appears in req.files
            options.fileName = "filename.jpg";
            options.mimeType = "multipart/form-data";
            options.chunkedMode = false;
            options.params = { // in nodejs this can be retreived in req.body
                "user" : app.session.user.attributes.username,
                "est" : this.model.attributes._id,
                "title" : $('#pic-title').val(),
                "pie" : $('#pic-pie').val(),
            };
            alert(JSON.stringify(options.params));
            //options.headers = { 'Authorization': 'Bearer ' + app.session.getSess('token') };

            //ft.upload(self.imageURI, 'http://192.168.0.32:8000' + '/establecimientos/upload-pic',
            ft.upload(self.imageURI, app.URL + '/establecimientos/upload-pic',
            //ft.upload(self.imageURI, 'http://192.168.1.7' + '/server.php',
                function(e) {
                    console.log(JSON.stringify(e));
                    $('#myPicture').modal('hide');
                    self.clearPictureForm();
                }, function(e) {
                    alert("upload failed : " + e.message);
                }, options);
        },//upload()
    });

    return EstablecimientoView;
});