define([
    'jquery',
    'underscore',
    'backbone',
    'collections/EstablecimientoCollection',
    'views/establecimiento/EStablecimientoListItemView',
    'text!templates/header/searchHeaderTemplate.html',
    'text!templates/search/searchTemplate.html'
], function($, _, Backbone, EstablecimientoCollection, EstablecimientoListItemView, searchHeaderTemplate, searchTemplate) {
    'use strict';

    var SearchView = Backbone.View.extend({
        initialize: function() {
            console.log('SearchView init');
            var self = this;

            this.collection = new EstablecimientoCollection();
            this.collection.url = 'http://162.243.16.24:3001/establecimientos/search';

            _.bindAll(this,'render');
            _.bindAll(this,'search');
            this.listenTo(self.collection,'reset',self.render);

            $('#header-content').html(_.template(searchHeaderTemplate));
            $('#back-btn').on('click',this.goBack); // event on the "Back" button
            $('#searchBtn').on('click',this.search);
            $('#searchText').on('keypress',function(e){ 
                if(e.keyCode == 13) {
                    e.preventDefault(); 
                    self.search(); 
                }
            });
        },

        el: '#content',

        template: _.template(searchTemplate),

        render: function(eventName) {
            console.log('SearchView render');
            $(this.el).empty();
            $(this.el).html(this.template);

            _.each(this.collection.models, function(establecimiento) {
                var itemView = new EstablecimientoListItemView({ model: establecimiento });

                $('.list-group').append(itemView.render().el);
            },this);

            return this;
        },//render()

        goBack: function(eventName) {
            window.history.back();
            $('#header-content').empty();
        },//goBack()

        search: function() {
            var key = $('#searchText').val();
            console.log('search ' + key);
            this.collection.fetch({ reset: true, data: $.param({ q: key }) });
        },//search()

        keypress: function(event) {
            if(event.keyCode == 13) {
                event.preventDefault();
                this.search();
            }
        },//keypress()

        close: function(){
            this.unbind();
            this.model.unbind("change", this.model);
            this.remove();
        }, // close()
    });

    return SearchView;
});