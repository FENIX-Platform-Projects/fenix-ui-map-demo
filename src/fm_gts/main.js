define(['jquery',
    'underscore',	
    'handlebars',
    'leaflet',
    'getwds',
    'text!fm_gts/html/templates.html',
    'fenix-map'], function ($, _, Handlebars, L, getwds, templates) {

    'use strict';

    var wds = new getwds();

    function FM_GTS() {
        this.o = {
            'lang': 'en',
            'placeholder': 'main_content'
        };
    }

    FM_GTS.prototype.init = function(config) {

    	var self = this;

        this.o = $.extend(true, {}, this.o, config);
        
        var source = $(templates).filter('#template').html();
        var t = Handlebars.compile(source);
        var html = t();
        $('#' + this.o.placeholder).html(html);

        // map
        var fm = new FM.Map('map', {
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
        
        fm.createMap();

        self.map = fm.map;

		fm.addLayer( new FM.layer({
			layers: 'fenix:gaul0_line_3857',
			layertitle: 'Country Boundaries',
			urlWMS: 'http://fenixapps.fao.org/geoserver',
			opacity: '0.9',
			lang: 'en'
		}) );

		self.layerMarkers = L.layerGroup().addTo(self.map);


		///////select boxes

		var FIELD = 'date';
		wds.query("select distinct "+FIELD+" from gts order by "+FIELD+" DESC",null, function(data) {

			_.each(_.uniq(_.map(data, function(v) {
				return v[0].substr(0,4);
			})), function(v) {
				$('#year').append('<option value="'+v+'">'+v+'</option>');
			});
		});

		var FIELD = 'country';
		wds.query("select distinct "+FIELD+" from gts order by "+FIELD,null, function(data) {

			_.each(_.uniq(_.map(data, function(v) {
				return v[0].substr(0,4);
			})), function(v) {
				$('#country').append('<option value="'+v+'">'+v+'</option>');
			});
		});		

		$('#year').on('change', function(e) {
			
			self.updateMap({date: $(this).val() });

		}).trigger('change');

    };

    FM_GTS.prototype.updateMap = function(filter) {

		var self = this,
			map = self.map,
			ll = [];



		var sql = "SELECT * FROM gts WHERE date LIKE '{date}%' ";

		if(filter.country)
			sql += " AND country = '{country}'";

		wds.query(sql, filter, function(data) {
			
			if(!data || data.length===0)
				return false;

			self.layerMarkers.clearLayers();

			data = _.map(data, function(v){
				return _.object([
					"country","station","station_name",
					"elevation","latitude","longitude","date",
					"monthly_precip","max_temp","min_temp","mean_temp",
					], v);
			});

			data = _.groupBy(data, function(v) {
				return v.country;
			});

			console.log(data);

			var popupTmpl = Handlebars.compile($(templates).filter('#popup').html());
			//var months = 

			_.each(data, function(vals, country) {

				var loc = L.latLng( parseFloat(vals[0].latitude), parseFloat(vals[0].longitude) );

				ll.push(loc);

				var mark = L.marker(loc);

				mark.on('mouseover', function(e) {
					e.target.openPopup();
				})
				.bindPopup( popupTmpl(vals[0]) )
				.addTo(self.layerMarkers);
			});

			map.fitBounds( L.latLngBounds(ll) );
		});
    };

    return FM_GTS;
});