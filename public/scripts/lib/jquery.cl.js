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

        var activeCommand,
            activeCommandText,
            currentSuggestion,
            promptMode = false,
            promptIndex = 0,
            cache = {},
            props = {},
            executed = [];

        for (var c in options.actions) {
            if (options.actions.hasOwnProperty(c)) {
                $.fn.cl.defaults.actions[c] = options.actions[c];
            }
        }
        for (var c in $.fn.cl.defaults.actions) {
            if ($.fn.cl.defaults.actions.hasOwnProperty(c)) {
                options.actions[c] = $.fn.cl.defaults.actions[c];
            }
        }
        var opts = $.extend({}, $.fn.cl.defaults, options);

        var suggest = function (input) {
            if (typeof activeCommand === "undefined") {

                currentSuggestion = '?';

                for (var c in opts.actions) {
                    if (opts.actions.hasOwnProperty(c)) {
                        if (c.indexOf(input) == 0) {
                            currentSuggestion = c;
                        }
                    }
                }
            } else {
                currentSuggestion = '';

                for (var c in activeCommand.commands) {
                    if (activeCommand.commands.hasOwnProperty(c)) {
                        if (c.indexOf(input) === 0) {
                            currentSuggestion = c;
                        }
                    }
                }
            }
        };

        return this.each(function () {
            var $this = $(this);
            $this.css({'width': opts.width});
            var $slug = $('<span class="cl-slug"></span>');
            var $prompt = $('<span class="cl-prompt">action</span>');
            var $info = $('<div class="cl-info"></div>');
            $this.wrap('<div class="cl-wrap" />');
            $this.parent().append($prompt);
            $this.parent().append($slug);
            $this.parent().append($info);

            var reset = function () {
                $this.val('');
                $prompt.show();
                $prompt.html('action');
                $info.html('');
                $slug.html('?');
                activeCommand = undefined;
                promptMode = false;
                promptIndex = 0;
                props = {};
            };

            $this.bind('keydown', function (e) {

                if (e.keyCode === 27) { // esc
                    e.preventDefault();
                    e.stopPropagation();
                    reset();
                    return;
                }

                $prompt.hide();


                if (e.keyCode === 38) {
                    e.preventDefault();
                    e.stopPropagation();
                    var lastAction = executed.pop();
                    if (lastAction) {
                        reset();
                        activeCommandText = lastAction.action;
                        activeCommand = opts.actions[lastAction.action];
                        currentSuggestion = lastAction.command;
                        promptMode = true;
                        promptIndex = 0;
                        $prompt.html('').hide();
                        $this.val('');
                        $info.html(activeCommandText + ' &raquo; ' + currentSuggestion);
                        var slug = activeCommand.commands[currentSuggestion].prompts[promptIndex];
                        $slug.html(slug + ' [' + (cache[slug] || '') + ']');
                        return;
                    }
                }

                if (e.keyCode === 9 || e.keyCode === 13) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    if (!activeCommand) {
                        var currAction = opts.actions[currentSuggestion];
                        if (currAction) {
                            $this.val(currentSuggestion);
                            activeCommand = currAction;
                            activeCommandText = currentSuggestion;

                            $info.html(activeCommandText + ' &raquo; ');
                            $prompt.html("command");
                            $this.val('');
                            $prompt.show();
                        }
                    } else {
                        if (activeCommand.commands[currentSuggestion]) {
                            if (promptMode) {
                                var slug = activeCommand.commands[currentSuggestion].prompts[promptIndex];
                                props[slug] = cache[slug] = ($this.val().length > 0 ? $this.val() : (cache[slug] || ''));
                                $this.val('');


                                if (promptIndex === activeCommand.commands[currentSuggestion].prompts.length - 1) {

                                    $.publish(activeCommandText + '/' + currentSuggestion, props);

                                    if (typeof activeCommand.commands[currentSuggestion].exec === "function") {
                                        activeCommand.commands[currentSuggestion].exec(props);
                                    }
                                    executed.push({
                                        'action': activeCommandText,
                                        'command': currentSuggestion
                                    });
                                    reset();
                                } else {
                                    promptIndex++;
                                    slug = activeCommand.commands[currentSuggestion].prompts[promptIndex];
                                    $slug.html(slug + ' [' + (cache[slug] || '') + ']');
                                    console.log(props);
                                }


                            } else {
                                var prompts = activeCommand.commands[currentSuggestion].prompts;

                                if (typeof prompts === "undefined" || prompts.length === 0) {
                                    $.publish(activeCommandText + '/' + currentSuggestion, null);
                                    executed.push({
                                        'action': activeCommandText,
                                        'command': currentSuggestion
                                    });
                                    reset();
                                    return;
                                };

                                var slug = activeCommand.commands[currentSuggestion].prompts[0];
                                $info.html(activeCommandText + '&raquo;' + currentSuggestion);

                                promptMode = true;
                                promptIndex = 0;
                                $this.val('');
                                $slug.html(slug + ' [' + (cache[slug] || '') + ']');
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

    $.fn.cl.defaults = {
        width: '250px',
        actions: {
            'undo': {
                'commands': {
                    'confirm [y]': {}
                }
            },
            'redo': {
                'commands': {
                    'confirm [y]': {}                    
                }
            }
        }
    };

})(jQuery);