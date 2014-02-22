define([
    'jquery',
    'underscore',
    'backbone',
    'collections/EstablecimientoCollection',
    'text!templates/establecimiento/establecimientoTemplate.html'
],function($, _, Backbone, EstablecimientoCollection, establecimientoTemplate) {

    var EstablecimientoView = Backbone.View.extend({
        initialize: function() {

            var self = this;
            //this.collection.fetch({ dataType: 'jsonp' });
            //this.collection = new EstablecimientoCollection([]);
            //this.collection.fetch({ dataType: 'jsonp' });
            //this.collection.fetch({ success: onDataHandler, dataType: 'jsonp' });

            _.bindAll(this,"render");
            this.collection.on("reset",this.render,this);
            //this.listenTo(this.collection, 'reset',this.render)
            this.collection.fetch({ success: function(){ self.render() } });

        }, //end of initialize()

        //tagId: 'nearMe',
        el: '#yagapp',
        template: _.template(establecimientoTemplate),
        

        render: function(eventName) {
            console.log("render");
            console.log(this.collection.length);
            //this.$el.html(this.template({ data: this.collection.toJSON() }));
            //console.log(this.collection.length);
            //this.$el.empty();
            //this.$el.append(this.template({ data: this.collection.toJSON() }));
            $(this.el).empty();
            $(this.el).append(establecimientoTemplate);
            /*this.listView = new EstablecimientoListView({ el: $('ul', this.el), model: this.collection });
            this.listView.render();*/
            
            return this;
        }, //end of render()
    });
    
    return EstablecimientoView;
});