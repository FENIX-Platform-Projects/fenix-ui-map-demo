var modules = 'src/'

requirejs.config({

    baseUrl: '',

    paths: {
        'bootstrap': 'node_modules/bootstrap/dist/js/bootstrap.min',
        'jquery': 'node_modules/jquery/dist/jquery.min',
        'backbone': 'node_modules/backbone/backbone-min',
        'underscore': 'node_modules/underscore/underscore-min',
        'handlebars': 'node_modules/handlebars/dist/handlebars.min',
        'chosen': 'node_modules/chosen-jquery/lib//chosen.jquery.min',
        'text': 'node_modules/text/text',
        'domReady':  'node_modules/domReady/domReady',


        // fenix-map-js
        'import-dependencies':'http://fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
        'leaflet': 'node_modules/leaflet/dist/leaflet',
        'jquery.power.tip': 'node_modules/jquery-powertip/dist/jquery.powertip.min',
        'jquery-ui':   'http://fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
        'jquery.i18n.properties': 'http://fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
        'jquery.hoverIntent': 'http://fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent',

        'fenix-map': 'libs/fenix-ui-map/fenix-ui-map.min',
        'fenix-map-config': 'libs/fenix-ui-map/fenix-ui-map-config',

        // MODULES
        'fm_join_gaul0_module' : modules + 'fm_join_gaul0/main',
        'fm_join_gaul0'        : modules + 'fm_join_gaul0',
        'fm_join_gaul1_module' : modules + 'fm_join_gaul1/main',
        'fm_join_gaul1'        : modules + 'fm_join_gaul1',
        'fm_join_gaul2_module' : modules + 'fm_join_gaul2/main',
        'fm_join_gaul2'        : modules + 'fm_join_gaul2'
    },

    shim: {
        'routing': ['main'],
        'bootstrap': ['jquery'],
        'jquery-ui': ['jquery'],
        'jquery.power.tip': ['jquery'],
        'jquery.i18n.properties': ['jquery'],
        'chosen': ['jquery'],
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'fenix-map': {
            deps: [
                'jquery',
                'jquery-ui',
                'leaflet',
                'fenix-map-config',
                'jquery.power.tip',
                'jquery.i18n.properties',
                'import-dependencies',
                'jquery.hoverIntent',
                'chosen'
            ]
        }
    }
});
