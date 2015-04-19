define(['jquery',
    'underscore',	
    'handlebars',
    'highcharts',
    'leaflet',
    'bootstrap',    
    'getwds',
    'text!fm_gts/html/templates.html',
    'fenix-map'], function ($, _, Handlebars, highcharts, L, bootstrap, getwds, templates) {

    'use strict';

    var wds = new getwds();

	var listMonths = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

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
		var FIELD = 'country';
		wds.query("select distinct "+FIELD+" from gts order by "+FIELD+" ASC",null, function(data) {

			_.each(data, function(v) {
				$('#country').append('<option value="'+v+'">'+v+'</option>');
			});
		});		

		var FIELD = 'date';
		wds.query("select distinct "+FIELD+" from gts order by "+FIELD+" DESC",null, function(data) {

			data = _.uniq(_.map(data, function(v) {
				return v[0].substr(4,4);
			}));

			data.sort();

			_.each(data, function(v) {
				$('#month').append('<option value="'+v+'">'+listMonths[parseInt(v.substr(0,2))]+'</option>');
			});
		});

		$('#country, #month').on('change', function(e) {
			self.updateMap({
				country: $('#country').val(),
				date:    $('#month').val()				
			});
		});

		$('#map').on('click','.leaflet-popup .btn', function(e) {
			e.preventDefault();

			self.updateChart({
				station: $(e.target).data('station'),
				country: $('#country').val(),
				date:    $('#month').val()				
			});
		});


		self.updateMap({
			country: $('#country').val(),
			date:    $('#month').val()				
		});		

    };

    FM_GTS.prototype.updateMap = function(filter) {

		var self = this,
			map = self.map,
			ll = [];

		var sql = "SELECT * FROM gts WHERE date LIKE '%{date}' ";

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
				return v.station;
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

    FM_GTS.prototype.updateChart = function(filter) {

		var self = this,
			map = self.map,
			ll = [];

		var sql = "SELECT * FROM gts WHERE date LIKE '%{date}' ";

		if(filter.station)
			sql += " AND station = '{station}'";

		function normalizeVal(str) {
			var v = (parseInt(str)/10);
			if(v === -999)
				return 0;
			return v;
		}

		wds.query(sql, filter, function(data) {
			
			data = _.map(data, function(v) {
				return _.object([
					"country","station","station_name",
					"elevation","latitude","longitude","date",
					"monthly_precip","max_temp","min_temp","mean_temp",
					], v);
			});

			data = _.map(data, function(v) {
				
				v.elevation = parseInt(v.elevation);
				v.date = parseInt(v.date);

				v.max_temp  = normalizeVal(v.max_temp);
				v.min_temp  = normalizeVal(v.min_temp);
				v.mean_temp = normalizeVal(v.mean_temp);
				v.monthly_precip = normalizeVal(v.monthly_precip);			
				return v;
			});

			var title = [data[0].station, listMonths[parseInt($('#month').val().substr(0,2))]].join(' &bull; ');
        	$('#modalchart').modal('show').find('.modal-title').html('STATION: '+title);

			self.renderChart(data);
		});
    };


    FM_GTS.prototype.renderChart = function (data) {

    	console.log(data);

        return new Highcharts.Chart({
        	chart: {
	            renderTo: 'resultchart',
	            type: 'line',
	            width: 500
	        },
	        series: this.getChartSeries(data),
	        xAxis: {
	        	categories: _.map(_.pluck(data,'date'), function(d) {
	        		console.log(d)
	        		return parseInt((d+"").substr(0,4));
	        	}).sort()
			},
        });
    };

    FM_GTS.prototype.getChartSeries = function (data) {

        var retSeries = [
        	{name: 'max_temp', data: _.pluck(data,'max_temp') },
        	{name: 'min_temp', data: _.pluck(data,'min_temp') }
        ];

        return retSeries;
    };

    return FM_GTS;
});