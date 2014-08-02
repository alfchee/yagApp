define([
    'app',
    'models/ComentarioModel'
],function(app,ComentarioModel) {
    'use strict';

    var ComentarioCollection = Backbone.Collection.extend({
        model: ComentarioModel,

        initialize: function(models, options) {
            console.log('ComentarioCollection init');
            this.estId = models.estId;
            _.bindAll(this,'url');
        },//initialize()

        url: function() {
            return app.URL + '/establecimientos/comments' + '?est=' + this.estId;
        },//url()
    });

    return ComentarioCollection;
});