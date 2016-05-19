'use strict';
/*globals define, socket*/

define('admin/plugins/tdwtfcensor', ['settings'], function(settings) {
	var tdwtfCensor = {};
	
	tdwtfCensor.init = function() {
		
		var wrapper = $('.tdwtfcensor-settings');
		
		settings.sync('tdwtfcensor', wrapper);
	
		$('#save').click(function(event) {
            event.preventDefault();
            settings.persist('tdwtfcensor', wrapper, function(){
                socket.emit('admin.settings.syncTdwtfCensor');
            });
		});
		
	};
	
	return tdwtfCensor;
});
