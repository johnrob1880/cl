define(['jquery', 'knockout', 'cl'], function($, ko, CL) {
    var start = function() {
        
        $('#commandLine').cl();
        
        $.subscribe('text/undo', function (e) {
            $('#output').html('');
        });
        $.subscribe('text/clear', function (e, props) {
            $(props.target).html(''); 
        });
        $.subscribe('style/text-color', function (e, props) {
            console.log(e);
            console.log(['subscribe', props]);
        });
    };
    
    return {
        start: start  
    };
});