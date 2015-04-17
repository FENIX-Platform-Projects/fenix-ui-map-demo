define(['jquery',
    'underscore',	
    'handlebars',
    'text!fm_gts/html/template.html',
    'getwds',
    'fenix-map'], function ($, _, Handlebars, template, getwds) {

    'use strict';


    var w = new getwds().init();

    w.query('select {id} from',{id:'*'}, function(data) {
    	console.log('query', data);
    });

    console.log(w);

    function FM_GTS() {
        this.o = {
            'lang': 'en',
            'placeholder': 'main_content'
        };
    }

    FM_GTS.prototype.init = function(config) {

        this.o = $.extend(true, {}, this.o, config);
        
        var source = $(template).filter('#template').html();
        var t = Handlebars.compile(source);
        var html = t();
        $('#' + this.o.placeholder).html(html);

        // map
        var m = new FM.Map('map', {
            plugins: {
                geosearch: true,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay: true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
            }
        }, {
            zoomControl: false,
            attributionControl: false
        });
        
        m.createMap();

        m.addLayer( new FM.layer({
            layers: 'fenix:gaul0_line_3857',
            layertitle: 'Country Boundaries',
            urlWMS: 'http://fenixapps.fao.org/geoserver',
            opacity: '0.9',
            lang: 'en'
        }) );

    };

    return FM_GTS;
});