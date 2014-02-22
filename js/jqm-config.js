
define(['jquery'], function($) {
    'use strict';
    
    $(document).on('mobileinit',function() {
        console.log('mobileinit');
        $.mobile.ajaxEnabled = false;
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;
        
        // Remove page from DOM when it’s being replaced 
		$('div[data-role="page"]').on('pagecontainerhide', function (event, ui) { 
			$(event.currentTarget).remove(); 
		});
    });
});