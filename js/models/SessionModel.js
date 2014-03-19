/**
*   @desc       store the POST state and response the state of authentication for user
*/
define([
    'app',
    'models/UserModel',
    'utils'
],function(app, UserModel){
    'use strict';

    var SessionModel = Backbone.Model.extend({

        //Initialize whit negative/emptey defaults
        // these will be overriden after the initial checkAuth
        defaults: {
            logged_in : false,
            user_id : ''
        },

        initialize: function() {
            _.bindAll(this,'updateSessionUser','checkAuth','postAuth','login','logout','signup','removeAccount');

            // singleton user object
            // access  or listen on this throghout any module with app.session.user
            this.user = new UserModel({ });
        },

        url: function() {
            return app.API + '/auth';
        },//url()

        // function to update the user attributes after receiving the API response
        updateSessionUser: function(userData) {
            this.user.set(_.pick(userData, _.keys(this.user.defaults) ));
        },//updateSessionUser()

        /**
        *   Check for session from API
        *   The API will parse client cookies usin secret token
        *   and return a user object authenticated
        */
        checkAuth: function(callback, args) {
            var self = this;
            this.fetch({
                success: function(mod,res) {
                    if(!res.error && res.user) {
                        self.updateSessionUser(res.user);
                        self.self({ logged_in: true });
                        if('success' in callback) callback.success(mod, res);
                    } else {
                        self.set({ logged_in: false });
                        if('error' in callback) callback.error(mod,res);
                    }
                }, 
                error: function(mod, res) {
                    self.set({ logged_in: false });
                    if('error' in callback) callback.error(mod,res);
                }
            }).complete(function() {
                if('complete' in callback) callback.complete();
            });
        },//checkAuth()

        /*
        * Abstracted function to make a POST request to the auth endpoint
        * This takes care of the CSRF header for security, as well as
        * updating the user and session after receiving an API response
        */
        postAuth: function(opts, callback, args) {
            var self = this;
            var postData = _.omit(opts,'method');
            if(DEBUG) console.log(postData);
            console.log(this.url());
            var meth = opts.method;
            $.ajax({
                url: this.url() + '/' + meth,
                dataType: 'json',
                crossDomain: true,
                type: 'POST',
                beforeSend: function(xhr) {
                    // set the CSRF token int the header for security
                    var token = $('meta[name="csrf-token"]').attr('content');
                    if(token) xhr.setRequestHeader('X-CSRF-Token',token);
                    console.log(this.type);
                },
                data: postData,
                success: function(res) {
                    console.log(res);
                }
            }).complete(function() {
                if(callback && 'complete' in callback) callback.complete(res);
            });

            /*$.ajax({
                url: this.url() + '/' +opts.method,
                contentType: 'application/json',
                dataType: 'json',
                crossDomain: true,
                xhrFields: {    withCredentials: true   },
                type: 'POST',
                beforeSend: function(xhr) {
                    // set the CSRF token int the header for security
                    var token = $('meta[name="csrf-token"]').attr('content');
                    if(token) xhr.setRequestHeader('X-CSRF-Token',token);
                    console.log(this.type);
                },
                data: JSON.stringify(_.omit(opts,'method')),
                success: function(res) {
                    if(!res.error) {
                        if(_.indexOf(['login','signup'],opts.method) !== -1) {
                            self.updateSessionUser(res.user || { });
                            self.set({ user_id: res.user.id, logged_in: true });
                        } else {
                            self.set({ logged_in: false });
                        }

                        if(callback && 'success' in callback) callback.success(res);
                    } else {
                        if(callback && 'error' in callback) callback.error(res);
                    }
                },
                error: function(mod, res) {
                    if(callback && 'error' in callback) callback.error(res);
                }
            }).complete(function() {
                if(callback && 'complete' in callback) callback.complete(res);
            });*/
        },//postAuth()

        login: function(opts, callback, args) {
            this.postAuth(_.extend(opts,{ method: 'login' }), callback);
        },//login()

        logout: function(opts, callback, args) {
            this.postAuth(_.extend(opts,{ method: 'logout'}), callback);
        },//logout()

        signup: function(opts, callback, args) {
            this.postAuth(_.extend(opts,{ method: 'signup'}), callback);
        },//signup()

        removeAccount: function(opts, callback, args) {
            this.postAuth(_.extend(opts,{ method: 'remove_account'}),callback);
        },//removeAccount()
    });

    return SessionModel;
});