(function ($) {

    var o = $({});
    $.subscribe = $.subscribe || function () {
        o.on.apply(o, arguments);
    }
    $.unsubscribe = $.unsubscribe || function () {
        on.off.apply(o, arguments);  
    };
    $.publish = $.publish || function () {
        o.trigger.apply(o, arguments);  
    };
    
    $.fn.cl = function (options) {

        var defaults = { 
                actions: {
                    'text':  {
                        'commands' : {
                            'parse' : { 
                                'exec' : function (e) {
                                    $(e.target).css({'background-color': e.color});   
                                },
                                'prompts' : [
                                    'target',
                                    'color'
                                ]
                            },
                            'insert' : { 
                                'exec' : function (e) {
                                    console.log(['inserting...', e]);  
                                },
                                'prompts' : [
                                    'target',
                                    'color'
                                ]
                            }
                        }
                    }, 
                    'style': {
                        'commands' : {
                            'text-color': {
                                'exec': function (props) {
                                    $(props.target).css({'color': props.color});   
                                },
                                'prompts': ['target', 'color']
                            }
                        }
                    }
                }
            },
            activeCommand,
            activeCommandText,
            currentSuggestion,
            promptMode = false,
            promptIndex = 0,
            props = {};

        var opts = $.extend({}, defaults, options);
        
        
        var suggest = function (input) {
            if (typeof activeCommand === "undefined") {
                
                currentSuggestion = '?';
                
                for (var c in opts.actions) {
                    if (opts.actions.hasOwnProperty(c)) {
                        console.log(c.indexOf(input));
                        if (c.indexOf(input) == 0) {
                            currentSuggestion = c;
                        }
                    }
                }
            } else {
                currentSuggestion = '';
                
                for (var c in activeCommand.commands) {
                    if (activeCommand.commands.hasOwnProperty(c)) {
                        console.log(c.indexOf(input));
                        if (c.indexOf(input) === 0) {
                            currentSuggestion = c;
                        }
                    }
                }
            }
        };

        return this.each(function () {
            var $this = $(this);        
            var $slug = $('<span class="cl-slug"></span>');
            var $prompt = $('<span class="cl-prompt">action &rArr;</span>');
            var $info = $('<div class="cl-info"></div>');
            $this.wrap('<div class="cl-wrap" />');
            $this.parent().append($prompt);
            $this.parent().append($slug);
            $this.parent().append($info);
            
            var reset = function () {
                $this.val('');
                $prompt.html('action &rArr;');
                $info.html('');
                $slug.html('?');
                activeCommand = undefined;
                promptMode = false;
                promptIndex = 0;
                props= {};
            };
            
            $this.bind('keydown', function (e) {
                
                if (e.keyCode === 27) { // esc
                    e.preventDefault();
                    e.stopPropagation();
                    reset();
                    return;
                }
                $prompt.hide();
                
               if (e.keyCode === 9) {
                   e.preventDefault();
                   e.stopImmediatePropagation();
                   
                   if (!activeCommand) {
                       if (opts.actions[currentSuggestion]) {
                        $this.val(currentSuggestion);
                        activeCommand = opts.actions[currentSuggestion];
                        activeCommandText = currentSuggestion;
                        $info.html(activeCommandText +  ' &raquo; ');
                        $prompt.html(activeCommandText + "&rArr; command &rArr;");
                        $this.val('');
                        $prompt.show();
                       }
                   } else {
                        if (activeCommand.commands[currentSuggestion]) {
//                            $this.val(currentSuggestion);
//                            console.log(activeCommand.commands[currentSuggestion]);
//                            
                            console.log(['prompt mode', promptMode, promptIndex]);
                            if (promptMode) {
                                
                                props[activeCommand.commands[currentSuggestion].prompts[promptIndex]] = $this.val();
                                    
                                $this.val('');
                                

                                if (promptIndex === activeCommand.commands[currentSuggestion].prompts.length - 1) {
                                    
                                    $.publish(activeCommandText + '/' + currentSuggestion, props);
                                    
                                    activeCommand.commands[currentSuggestion].exec(props);
                                    reset();
                                }
                                else {
                                    promptIndex++;
                                    $slug.html(activeCommand.commands[currentSuggestion].prompts[promptIndex]);
                                    console.log(props);
                                }
                                
                                
                            } else {
                                $info.html(activeCommandText + '&raquo;' + currentSuggestion);
                                promptMode = true;
                                promptIndex = 0;
                                $this.val('');
                                $slug.html(activeCommand.commands[currentSuggestion].prompts[0]);
                            }
                            
                        }
                   }
               }
            });
            
            $this.bind('keyup', function (e) {
                                               
                if (!promptMode) {
                    suggest($this.val());
                    $slug.html(currentSuggestion);
                }
            });
            
        });
    };

})(jQuery);