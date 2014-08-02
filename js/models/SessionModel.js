/**
*   @desc       store the POST state and response the state of authentication for user
*/
define([
    'app',
    'models/UserModel',
    'models/TwitterModel',
    'async',
    'utils',
],function(app, UserModel, TwitterModel, async){
    'use strict';

    var SessionModel = Backbone.Model.extend({

        //Initialize whit negative/emptey defaults
        // these will be overriden after the initial checkAuth
        defaults: {
            logged_in : false,
            token : ''
        },

        initialize: function() {
            _.bindAll(this,'updateSessionUser','checkAuth','postAuth','login','logout','signup','removeAccount','loginSuccess');

            // singleton user object
            // access  or listen on this throghout any module with app.session.user
            this.user = new UserModel({ });

            // Changed for localStorage support
            if(window.localStorage && localStorage)
                this.supportStorage = true;
        },

        url: function() {
            return app.URL + '/authenticate';
        },//url()

        getSess: function(key) {
            if(this.supportStorage) {
                var data = localStorage.getItem(key);
                if(data && data[0] === '{') {
                    return JSON.parse(data);
                } else {
                    return data;
                }
            } else {
                return Backbone.Model.prototype.get.call(this,key);
            }
        },//get()

        setSess: function(key,value) {
            if(this.supportStorage) {
                localStorage.setItem(key,value);
            } else {
                Backbone.Model.prototype.set.call(this,key,value);
            }

            return this;
        }, //set()

        unsetSess: function(key) {
            if(this.supportStorage) {
                localStorage.removeItem(key);
            } else {
                Backbone.Model.prototype.unset.call(this,key);
            }
            return this;
        },//unset()

        clearSess: function() {
            if(this.supportStorage){
                localStorage.clear();    
            } else {
                Backbone.Model.prototype.clear(this);
            }
        },//clear()

        // function to update the user attributes after receiving the API response
        updateSessionUser: function(userData) {
            this.user.set(_.pick(userData, _.keys(this.user.defaults) ));
        },//updateSessionUser()

        /**
        *   Check for session from API
        *   The API will parse client cookies usin secret token
        *   and return a user object authenticated
        */
        checkAuth: function() {
            var self = this;
            var data = { token: self.getSess('token') };
            var query = $.ajax({
                url: app.URL + '/refresh-token',
                type: 'POST',
                crossDomain: true,
                data: data,
                dataType: 'json',
            });

            query.done(function(response){
                self.loginSuccess(response);
            });
            query.fail(function(jqXHR, textStatus) {
                console.log(textStatus);
            })
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
                url: this.url() ,
                dataType: 'json',
                crossDomain: true,
                type: 'POST',
                data: postData,
                beforeSend: function(xhr) {
                    if(self.get('logged_in')) {
                        xhr.setRequestHeader('Authorization','Bearer ' + self.getSess('token'));
                    }
                },//beforeSend()
                success: function(res) {
                    console.log(res);
                    if(!res.error) {
                        if(_.indexOf(['login','signup'],meth) !== -1) {
                            // if login or signup
                               self.loginSuccess(res);
                        } else {
                            // if logout
                            this.clearSess();
                            self.clear();
                            self.set({ logged_in: false });
                        }

                        if(callback && 'success' in callback) callback.success(res);
                    } else {
                        if(callback && 'error' in callback) callback.error(res);
                    }
                },
                error: function(mod,res) {
                    if(callback && 'error' in callback) callback.error(res);
                }
            }).complete(function() {
                if(callback && 'complete' in callback) callback.complete(res);
            });
        },//postAuth()

        loginSuccess: function(res) {
            var token = res.token;
            var encoded = token.split('.')[1];
            var profile = app.urlBase64Decode(encoded);
            var user = JSON.parse(profile);

            this.setSess('token',token);
            this.setSess('user',profile);
            this.updateSessionUser(user || { });
            this.set({ logged_in: true });

            if(user.twitterOauthToken) {
                var twitter = TwitterModel();
                this.setSess(twitter.twitterKey,JSON.stringify(user.twitterOauthToken));
            }
        },//loginSuccess()

        login: function(opts, callback, args) {
            this.postAuth(_.extend(opts,{ method: 'login' }), callback);
        },//login()

        loginTwitter: function() {
            var self = this;
            var twitter = new TwitterModel();
            // proceed to authorize the application and register the user in the server
            twitter.requestToken();

            
        },//loginTwitter()

        verifyTwitterUser: function(twitter) {
            var self = this;
            
            $.ajax({
                url: app.URL + '/verify-twitter-user',
                type: 'GET',
                crossDomain: true,
                data: { username: twitter.userData.screen_name }
            }).done(function(data) {
                // compare the username to see if the user is signed 
                if(data.username && twitter.userData.screen_name == data.username) {
                    // TODO: login
                    $.ajax({
                        url: self.url,
                        type: 'POST',
                        crossDomain: true,
                        data: {
                            username: twitter.userData.screen_name,
                            auth_token: JSON.stringify(app.session.getSess(twitter.twitterKey))
                        }
                    }).done(function(res) {
                        self.loginSuccess(res);
                    });
                } else {
                    // sign up the user
                    $.ajax({
                        url: app.URL + '/twitter-signup',
                        type: 'POST',
                        crossDomain: true,
                        data: {
                            name: twitter.userData.name,
                            screen_name : twitter.userData.screen_name,
                            profile_image_url : twitter.userData.profile_image_url,
                            lang : twitter.userData.lang,
                            location : twitter.userData.location,
                            auth_token : JSON.stringify(app.session.getSess(twitter.twitterKey))
                        }
                    }).done(function(res) {
                        self.loginSuccess(res);
                    });
                }
            });
        },//verifyTwitterUser()

        logout: function(opts, callback, args) {
            //this.postAuth(_.extend(opts,{ method: 'logout'}), callback);
            this.updateSessionUser({ });
            this.clearSess();
            this.clear();
            this.set({ logged_in: false });
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