define(['jquery', 'knockout', 'cl'], function($, ko, CL) {
    var start = function() {
        
        $('#commandLine').cl({
            'width': '100%',
            'actions': {
               'text': {
                    'commands': {
                        'insert': {
                            'exec': function (e) {
                                $(e.target).append(e.content);
                            },
                            'prompts': [
                                'target',
                                'content'
                            ]
                        }
                    }
               }
            }
        });
        
        $.subscribe('undo/confirm', function (e, props) {
           alert('undo'); 
        });
        $.subscribe('redo/confirm', function (e, props) {
           alert('redo'); 
        });
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