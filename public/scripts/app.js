define(['jquery', 'knockout', 'cl'], function($, ko, CL) {
    var start = function() {
        
        $('#commandLine').cl();
        
        $.subscribe('style/text-color', function (e, props) {
            console.log(e);
            console.log(['subscribe', props]);
        });
    };
    
    return {
        start: start  
    };
});