
define(['jquery'], function($) {
    'use strict';
    
    $(document).on('mobileinit',function() {
        $.mobile.ajaxEnabled = false;
        $.mobile.linkBindidngEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;
        
        // Remove page from DOM when it’s being replaced 
		$('div[data-role="page"]').bind('pagehide', function (event, ui) { 
			$(event.currentTarget).remove(); 
		});
    });
});