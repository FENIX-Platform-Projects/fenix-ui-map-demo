define(['jquery',
    'underscore',	
    'handlebars',
    'leaflet',    
    'text!fm_gts/html/template.html',
    'fenix-map'], function ($, _, Handlebars, L, template) {

    'use strict';

	function getWDS(queryTmpl, queryVars, callback) {

	    var sqltmpl, sql;

	    if(queryVars) {
	        sqltmpl = _.template(queryTmpl);
	        sql = sqltmpl(queryVars);
	    }
	    else
	        sql = queryTmpl;

	    var	data = {
	        datasource: 'demo_fenix',
	        thousandSeparator: ',',
	        decimalSeparator: '.',
	        decimalNumbers: 2,
	        cssFilename: '',
	        nowrap: false,
	        valuesIndex: 0,
	        json: JSON.stringify({query: sql})
	    };

	    $.ajax({
	        url: 'http://faostat3.fao.org/wds/rest/table/json',
	        data: data,
	        type: 'POST',
	        dataType: 'JSON',
	        success: callback
	    });
	}
    //console.log('istance',w);

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

/*			0: "Egypt",
			1: "GHCND:EG000062417",
			2: "SIWA EG",
			3: "-15",
			4: "29.199999999999999",
			5: "25.316700000000001",
			6: "19940101",
			7: "130",
			8: "193",
			9: "91",
			10: "142"*/

			var FIELD = 'date';

		getWDS("select distinct "+FIELD+" from gts order by "+FIELD,null, function(data) {
			_.each(data, function(v) {
				//var d = Date.parseDate(v[0], "Ymd"),
				//	date = d.dateFormat("Y / m / d");
				var date = v[0];

				$('#months').append('<option value="'+date+'">'+date+'</option>');
			});
		});

		$('#months').on('change', function(e) {

			var map = m.map,
				layerMarkers = L.layerGroup(),
				ll = [];

			layerMarkers.addTo(map);

			getWDS("select * from gts where date = '<%= date %>' ", { date: $(this).val() }, function(data) {
				
				layerMarkers.clearLayers();

				_.each(data, function(v,k) {

					var loc = L.latLng( parseFloat(v[4]), parseFloat(v[5]) );

					ll.push(loc);

					var mark = L.marker(loc);

					mark.on('mouseover', function(e) {
						e.target.openPopup();
					});

					mark.bindPopup( '<pre>'+JSON.stringify(v)+'</pre>' );

					mark.addTo(layerMarkers);
				});

				map.fitBounds( L.latLngBounds(ll) );
			});
		});

    };

    return FM_GTS;
});