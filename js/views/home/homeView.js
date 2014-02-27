
define([
    'jquery', 
    'underscore', 
    'backbone',
    'text!templates/home/homeTemplate.html'
], function($, _, Backbone, homeTemplate){ 
 
  var HomeView = Backbone.View.extend({ 
    tagName: 'section',
    id: 'yagapp',
    //initialize template 
    template:_.template(homeTemplate), 
 
    //render the content into div of view 
    render: function(){ 
	  //this.el is the root element of Backbone.View. By default, it is a div.    
      //$el is cached jQuery object for the view’s element. 
      //append the compiled template into view div container 
      $(this.el).html(homeTemplate);
 
      //return to enable chained calls 
      return this; 
    } 
  }); 
  return HomeView; 
});