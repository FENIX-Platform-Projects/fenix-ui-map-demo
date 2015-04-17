
define(['jquery', 'underscore'], function($, _) {

    'use strict';

	function _template(str, data) {
		return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			return data[key] || '';
		});
	}

 	function GETWDS() {

		this.serviceUrl =  'http://faostat3.fao.org/wds/';
        this.opts = {
			datasource: 'demo_fenix',
			thousandSeparator: ',',
			decimalSeparator: '.',
			decimalNumbers: 2,
			cssFilename: '',
			nowrap: false,
			valuesIndex: 0,
			json: JSON.stringify({query: ''})
		};
    }

    GETWDS.prototype.init = function(config) {
    	this.opts = _.extend(this.opts, config);
    	return this;
    };

    GETWDS.prototype.query = function(queryTmpl, queryVars, callback) {

		var ret,
			sql = queryVars ? _template(queryTmpl, queryVars) : queryTmpl,
			data = _.extend(this.opts, {
				json: JSON.stringify({query: sql})
			});

		if(_.isFunction(callback))
			ret = $.ajax({
				url: this.serviceUrl,
				data: data,
				type: 'POST',
				dataType: 'JSON',
				success: callback
			});
		else
			$.ajax({
				async: false,
				url: this.serviceUrl,
				data: data,
				type: 'POST',
				dataType: 'JSON',
				success: function(resp) {
					ret = resp;
				}
			});

		return ret;
	};

	return GETWDS;
});