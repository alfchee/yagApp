/**
*   @desc          store the POST state and response state of authentication for user
*/
define([
    'app',
    'utils'
], function(app) {
    'use sctrict';

    var UserModel = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this,'url');
        },//initialize()

        defaults: {
            id: 0,
            username: '',
            name: '',
            email: ''
        },

        url: function() {
            return app.API + '/user';
        }
    });

    return UserModel;
})