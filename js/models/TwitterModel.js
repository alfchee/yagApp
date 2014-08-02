
define([
    'app',
    'async'
], function(app, async){ 
    'use strict';

    var TwitterModel = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this,'success','verifyCredentials','requestToken');

            // Apps storedAccessData, Apps Data in Raw format
            var storedAccessData, rawData = localStorage.getItem(this.twitterKey);

            if(localStorage.getItem(this.twitterKey) !== null) {
                // when app already knows  the data
                storedAccessData = JSON.parse(rawData);

                this.oauth = OAuth(this.options);
                this.oauth.setAccessToken([storedAccessData.accessTokenKey, storedAccessData.accessTokenSecret]);
                //this.options.accessTokenSecret = storedAccessData.accessTokenSecret;

                this.verifyCredentials();
            }
        },//initialize()

        options : {
            consumerKey: 'asoG7Knl1OR2ArPuDDxvLMhn4',
            consumerSecret: 'uQ0mG11kafGDzRroCHRqNwfKBnq7fSum18yujmctQUZp5TCsXA',
            callbackUrl: 'http://goideas.net'
        }, //options

        twitterKey : 'twtrKey',

        ref : {},

        requestParams : '',

        userData : {},

        // verify the credentials of the user, obtaining the data of the user
        // the response of twitter is saved in session to show data of the user
        verifyCredentials: function() {
            var self = this;
            this.oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
                            function(data) {
                                var entry = JSON.parse(data.text);
                                console.log("USERNAME: " + entry.screen_name);
                                self.userData = entry; // let the user data accessible as an object attribute

                                // if JWT doesn't exists we request a token to the server to have a session
                                if(!app.session.getSess('token'))
                                    app.session.verifyTwitterUser(self);

                                return data.text ? entry : false;
                            },
                            function(data) {
                                console.log('ERROR: ' + data);
                            });
        },//verifyCredentials()

        // firstly obtain a token to ask a request authorization
        // after that open an InAppBrowser to let the user authorize the application
        requestToken: function() {
            var self = this;
            this.oauth = OAuth(this.options);
            this.oauth.get('https://api.twitter.com/oauth/request_token',
                            function(data) {
                                self.requestParams = data.text;

                                self.ref = window.open('https://api.twitter.com/oauth/authorize?' + data.text,'_blank','location=yes'); // this opens the twitter authorization

                                self.ref.addEventListener('loadstart',function(event) { self.success(event.url) });
                                self.ref.addEventListener('loaderror',function(event) { console.log('InAppBrowser ERROR: ' + event.message) });
                                self.ref.addEventListener('exit',function(event) { console.log("Exit InAppBrowser") } );
                                                                  
                            },
                            function(data) {
                                console.log('ERROR: ' + data);
                            }
                            );
        },//requestToken()

        success: function(url) {
            var self = this;

            async.series([
                function(callback) {
                    // here we check whether the callback URL  matches with the given URL
                    if(url && url.indexOf("http://goideas.net/?") >= 0) {
                        // parse the returned URL
                        var index, verifier = '';
                        var params = url.substr(url.indexOf('?') +1);

                        params = params.split('&');
                        for(var i = 0; i < params.length; i++) {
                            var y = params[i].split('=');
                            if(y[0] === 'oauth_verifier') {
                                verifier = y[1];
                            }
                        }

                        // here we are going to change token for request with token for access
                        // once user has authorized us then we change the token for request for the token for access
                        // and then save it in localStorage
                        self.oauth.get("https://api.twitter.com/oauth/access_token?oauth_verifier=" + verifier + '&' + self.requestParams,
                            function(data) {
                                var accessParams = {};
                                var qvars_tmp = data.text.split('&');
                                for(var i = 0; i < qvars_tmp.length; i++) {
                                    var y = qvars_tmp[i].split('=');
                                    accessParams[y[0]] = decodeURIComponent(y[1]);
                                }

                                self.oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);

                                var accessData = {};
                                accessData.accessTokenKey = accessParams.oauth_token;
                                accessData.accessTokenSecret = accessParams.oauth_token_secret;

                                console.log('TWITTER: Storing token key/secret in localStorage');
                                app.session.setSess(self.twitterKey,JSON.stringify(accessData));
                                self.verifyCredentials();

                                self.ref.close();
                            },
                            function(data) {
                                console.log(data);
                            });
                    }
                    callback(null,self);
                }
            ],function(err, result){
                //if(self.userData.screen_name)
                    
            });

            
        },
    });

    return TwitterModel;
});