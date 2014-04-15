requirejs.config({
   baseUrl: 'scripts',
    paths: {
        'jquery' : ['lib/jquery.min', '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min'],
        'text': ['lib/text.js', '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text'],
        'bootstrap': ['lib/bootstrap.min', '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min'],
        'underscore': ['lib/underscore-min', '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min'],
        'knockout': ['lib/knockout-min', '//cdnjs.cloudflare.com/ajax/libs/knockout/3.0.0/knockout-min'],
        'mapping': ['lib/knockout.mapping', '//cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.3.5/knockout.mapping'],
        'templates': '../templates',
        'cl': 'lib/jquery.cl'
    },
    shim: {
        'jquery': {
            exports: '$'   
        },
        'underscore': {
            exports: '_'  
        },
        'bootstrap': {
            deps: ['jquery']   
        },
        'knockout': {
            deps: ['jquery'],
            exports: 'ko'
        },
        'mapping': {
            deps: ['jquery', 'knockout'],
            exports: 'mapping'
        },
        'cl' : {
            deps: ['jquery']   
        }
    }
});

define(['jquery', 'knockout', 'mapping', 'app'], function($, ko, mapping, app) {
    window.jQuery = $;
    ko.mapping = mapping;
    app.start();
});