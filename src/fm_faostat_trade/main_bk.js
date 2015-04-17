define(['jquery',
    'handlebars',
    'text!fm_faostat_trade/html/template.html',
    'fenix-map',
    'chosen'], function ($, Handlebars, template) {

    'use strict';

    function FAOSTAT_TRADE() {
        this.o = {
            'placeholder': 'main_content',
            lang: 'E',
            item: {
                id: 'item',
                defaultcode: '',
                url: 'items/faostat2/TM/E',
                callback: '',
                width: '100%',
                chosenOptions: {disable_search_threshold: 10, no_results_text: "Nothing found"}
            },
            area: {
                id: 'area',
                defaultcode: '',
                url: 'usp_GetListBox/faostat2/TM/1/1/E',
                callback: '',
                width: '100%',
                chosenOptions: {disable_search_threshold: 10, no_results_text: "Nothing found"}
            },
            year: {
                fromyear: {
                    url: 'usp_GetListBox/faostat2/TM/5/1/E',
                    id: 'fromyear',
                    defaultcode: '2005',
                    callback: '',
                    width: '100%',
                    chosenOptions: {disable_search_threshold: 10, no_results_text: "Nothing found"}
                },
                toyear: {
                    url: 'usp_GetListBox/faostat2/TM/5/1/E',
                    id: 'toyear',
                    defaultcode: '2010',
                    callback: '',
                    width: '100%',
                    chosenOptions: {disable_search_threshold: 10, no_results_text: "Nothing found"}
                }
            },
            elements: [
                {
                    // code: '5610,5608,5609,5607'
                    code: '5622'
                },
                {
                    //code: '5910,5908,5909,5907'
                    code: '5922'
                }
            ],
            wdsurl: 'http://faostat3.fao.org/wds/rest/procedures/',
            datasource: 'faostat2',
            domain: 'TP',
            maps: [
                {
                    id: 'importmap-growthrate',
                    id_container: 'importmap-container',
                    id_nodata: 'importmap-nodata',
                    title: 'Import Value',
                    measurementunit: 'Growth Rate (&#37;)',
                    fenixmap: '',
                    colorramp: 'YlOrRd',
                    colors: '1a9850,66bd63,a6d96a,d9ef8b,ffffbf,fee08b,fc8d59,d73027',
                    l: {
                        layer: {layertitle: 'test'}
                    }

                },
                {
                    id: 'importmap-avg',
                    id_container: 'importmap-container',
                    id_nodata: 'importmap-nodata',
                    title: 'Import Value',
                    measurementunit: 'Average Import Value (1000 US$)',
                    colorramp: 'YlOrRd',
                    colors: '1a9850,66bd63,a6d96a,d9ef8b,ffffbf,fee08b,fc8d59,d73027',
                    fenixmap: '',
                    l: {
                        layer: {layertitle: 'test'}
                    }
                },
                {
                    id: 'exportmap-growthrate',
                    id_container: 'exportmap-container',
                    id_nodata: 'exportmap-nodata',
                    title: 'Export Value',
                    measurementunit: 'Growth Rate (&#37;)',
                    colorramp: 'YlGn',
                    colors: 'd73027,fc8d59,fee08b,ffffbf,d9ef8b,a6d96a,66bd63,1a9850',
                    fenixmap: '',
                    l: {
                        layer: {layertitle: 'test'}
                    }
                },
                {
                    id: 'exportmap-avg',
                    id_container: 'exportmap-container',
                    id_nodata: 'exportmap-nodata',
                    title: 'Export Value',
                    measurementunit: 'Average Export Value (1000 US$)',
                    colorramp: 'YlGn',
                    colors: 'd73027,fc8d59,fee08b,ffffbf,d9ef8b,a6d96a,66bd63,1a9850',
                    fenixmap: '',
                    l: {
                        layer: {layertitle: 'test'}
                    }
                }
            ]
        };

        this.sql_growth_rate =
        {
            "selects": [
                {"aggregation": "NONE", "column": "DOM.DomainName_$lang", "alias": "Domain"},
                {"aggregation": "NONE", "column": "A1.AreaName_$lang", "alias": "Reporter_Country"},
                {"aggregation": "NONE", "column": "D.ReporterAreaCode", "alias": "Reporter_Country_Code"},
                {"aggregation": "NONE", "column": "A2.AreaName_$lang", "alias": "Partner_Country"},
                {"aggregation": "NONE", "column": "D.PartnerAreaCode", "alias": "Partner_Country_Code"},
                {"aggregation": "NONE", "column": "I.ItemName_$lang", "alias": "Item"},
                {"aggregation": "NONE", "column": "D.ItemCode", "alias": "Item_Code"},
                {"aggregation": "NONE", "column": "E.ElementName_$lang", "alias": "Element"},
                {"aggregation": "NONE", "column": "D.ElementCode", "alias": "Element_Code"},
                {"aggregation": "NONE", "column": "D.Year", "alias": "Year"},
                {"aggregation": "NONE", "column": "E.UnitName_$lang", "alias": "Unit"},
                {"aggregation": "NONE", "column": "D.Value", "alias": "Value"}],
            "froms": [{"column": "TradeMatrix", "alias": "D"}, {"column": "Item", "alias": "I"}, {
                "column": "Element",
                "alias": "E"
            }, {"column": "Area", "alias": "A1"}, {"column": "Area", "alias": "A2"}, {"column": "Domain", "alias": "DOM"}],
            "wheres": [{"datatype": "TEXT", "column": "D.DomainCode", "operator": "=", "value": "TM", "ins": []},
                {"datatype": "TEXT", "column": "DOM.DomainCode", "operator": "=", "value": "TM", "ins": []},
                {"datatype": "DATE", "column": "D.ReporterAreaCode", "operator": "=", "value": "A1.AreaCode", "ins": []},
                {"datatype": "DATE", "column": "D.PartnerAreaCode", "operator": "=", "value": "A2.AreaCode", "ins": []},
                {"datatype": "DATE", "column": "D.DomainCode", "operator": "=", "value": "DOM.DomainCode", "ins": []},
                {"datatype": "DATE", "column": "D.ItemCode", "operator": "=", "value": "I.ItemCode", "ins": []},
                {"datatype": "DATE", "column": "D.ElementCode", "operator": "=", "value": "E.ElementCode", "ins": []},
                {
                    "datatype": "TEXT",
                    "column": "D.ElementCode",
                    "operator": "IN",
                    "value": "E.ElementCode",
                    "ins": ["_$elementcode"]
                },
                {
                    "datatype": "TEXT",
                    "column": "D.ReporterAreaCode",
                    "operator": "IN",
                    "value": "A1.AreaCode",
                    "ins": ["_$reporterareacode"]
                },
                {
                    "datatype": "TEXT",
                    "column": "D.ItemCode",
                    "operator": "IN",
                    "value": "I.ItemCode",
                    "ins": ["_$itemcode"]
                },
                {"datatype": "TEXT", "column": "D.Year", "operator": ">=", "value": "_$fromyear", "ins": []},
                {"datatype": "TEXT", "column": "D.Year", "operator": "<=", "value": "_$toyear", "ins": []},
                {"datatype": "TEXT", "column": "D.Value", "operator": ">", "value": "0.0", "ins": []}
            ],
            "orderBys": [
                {"column": "A2.AreaNameE", "direction": "ASC"},
                {"column": "D.Year", "direction": "ASC"}
            ],
            "limit": null, "query": null,
            "frequency": "NONE"
        }


        this.sql_average =
        {
            "selects": [
                {"aggregation": "NONE", "column": "DOM.DomainName_$lang", "alias": "Domain"},
                {"aggregation": "NONE", "column": "A1.AreaName_$lang", "alias": "Reporter_Country"},
                {"aggregation": "NONE", "column": "D.ReporterAreaCode", "alias": "Reporter_Country_Code"},
                {"aggregation": "NONE", "column": "A2.AreaName_$lang", "alias": "Partner_Country"},
                {"aggregation": "NONE", "column": "D.PartnerAreaCode", "alias": "Partner_Country_Code"},
                {"aggregation": "NONE", "column": "I.ItemName_$lang", "alias": "Item"},
                {"aggregation": "NONE", "column": "D.ItemCode", "alias": "Item_Code"},
                {"aggregation": "NONE", "column": "E.ElementName_$lang", "alias": "Element"},
                {"aggregation": "NONE", "column": "D.ElementCode", "alias": "Element_Code"},
                {"aggregation": "NONE", "column": "E.UnitName_$lang", "alias": "Unit"},
                {"aggregation": "AVG", "column": "D.Value", "alias": "Value"}],
            "froms": [{"column": "TradeMatrix", "alias": "D"}, {"column": "Item", "alias": "I"}, {
                "column": "Element",
                "alias": "E"
            }, {"column": "Area", "alias": "A1"}, {"column": "Area", "alias": "A2"}, {"column": "Domain", "alias": "DOM"}],
            "wheres": [{"datatype": "TEXT", "column": "D.DomainCode", "operator": "=", "value": "TM", "ins": []},
                {"datatype": "TEXT", "column": "DOM.DomainCode", "operator": "=", "value": "TM", "ins": []},
                {"datatype": "DATE", "column": "D.ReporterAreaCode", "operator": "=", "value": "A1.AreaCode", "ins": []},
                {"datatype": "DATE", "column": "D.PartnerAreaCode", "operator": "=", "value": "A2.AreaCode", "ins": []},
                {"datatype": "DATE", "column": "D.DomainCode", "operator": "=", "value": "DOM.DomainCode", "ins": []},
                {"datatype": "DATE", "column": "D.ItemCode", "operator": "=", "value": "I.ItemCode", "ins": []},
                {"datatype": "DATE", "column": "D.ElementCode", "operator": "=", "value": "E.ElementCode", "ins": []},
                {
                    "datatype": "TEXT",
                    "column": "D.ElementCode",
                    "operator": "IN",
                    "value": "E.ElementCode",
                    "ins": ["_$elementcode"]
                },
                {
                    "datatype": "TEXT",
                    "column": "D.ReporterAreaCode",
                    "operator": "IN",
                    "value": "A1.AreaCode",
                    "ins": ["_$reporterareacode"]
                },
                {
                    "datatype": "TEXT",
                    "column": "D.ItemCode",
                    "operator": "IN",
                    "value": "I.ItemCode",
                    "ins": ["_$itemcode"]
                },
                {"datatype": "TEXT", "column": "D.Year", "operator": ">=", "value": "_$fromyear", "ins": []},
                {"datatype": "TEXT", "column": "D.Year", "operator": "<=", "value": "_$toyear", "ins": []},
                {"datatype": "TEXT", "column": "D.Value", "operator": ">", "value": "0.0", "ins": []}
            ],
            "groupBys": [
                {"column": "DOM.DomainName_$lang", "alias": "Domain"},
                {"column": "A1.AreaName_$lang", "alias": "Reporter_Country"},
                {"column": "D.ReporterAreaCode", "alias": "Reporter_Country_Code"},
                {"column": "A2.AreaName_$lang", "alias": "Partner_Country"},
                {"column": "D.PartnerAreaCode", "alias": "Partner_Country_Code"},
                {"column": "I.ItemName_$lang", "alias": "Item"},
                {"column": "D.ItemCode", "alias": "Item_Code"},
                {"column": "E.ElementName_$lang", "alias": "Element"},
                {"column": "D.ElementCode", "alias": "Element_Code"},
                {"column": "E.UnitName_$lang", "alias": "Unit"}
            ],
            "limit": null, "query": null,
            "frequency": "NONE"
        }
    }

    FAOSTAT_TRADE.prototype.init = function(obj)  {
        this.o = $.extend(true, {}, this.o, obj);
        var source = $(template).filter('#template').html();
        var t = Handlebars.compile(source);
        var html = t();
        $('#' + this.o.placeholder).html(html);

        // load codes
        this.loadCode(this.o.item);
        this.loadCode(this.o.area);
        this.loadCode(this.o.year.fromyear)
        this.loadCode(this.o.year.toyear)

        // onclick
        var _this = this;
        $('#apply').click(function() {
            _this.fetchCodes();
        });

    };

    FAOSTAT_TRADE.prototype.applyJoin = function(m, joindata) {
        $('#' +m.id).empty();
        // Create Maps and layers
        if ( joindata.length <= 2 ) {  // because here it is a string TODO: make the test before to stringfy
            $('#' +m.id_container).show();
            $('#' +m.id).hide();
            $('#' +m.id_nodata).show();
        }
        else {
            m.fenixmap = this.createMap(m.id);
            m.l = this.createLayer(m.l.layer, m);
            m.l.layer.joindata = joindata;
            m.fenixmap.addLayer(m.l)
            $('#' +m.id_nodata).hide();
            $('#' +m.id_container).show();
            $('#' +m.id).show();
            m.fenixmap.map.invalidateSize();
            this.syncMaps();
        }
    }

    /** TODO: optimize the function **/
    FAOSTAT_TRADE.prototype.syncMaps = function() {
        var o = this.o;
        if (o.maps[0].fenixmap.map && o.maps[1].fenixmap.map && o.maps[2].fenixmap.map && o.maps[3].fenixmap.map) {
            for(var i=0; i< 4; i++) {
                for (var j=0; j<4; j++) {
                    if ( i != j )
                        o.maps[i].fenixmap.syncOnMove(o.maps[j].fenixmap);
                }
            }
        }
    }

    FAOSTAT_TRADE.prototype.loadCode = function(obj) {
        var url = this.o.wdsurl + obj.url;
        var _this = this;
        $.ajax({
            type : 'GET',
            url : url,
            success : function(response) {
                response = (typeof response == 'string')? $.parseJSON(response): response;
                _this.createDD(response, obj);
            },
            error : function(err, b, c) {}
        });
    };

    FAOSTAT_TRADE.prototype.loadYear = function() {
        var url = this.o.wdsurl + this.o[type].url;
        var _this = this;
        $.ajax({
            type : 'GET',
            url : url,
            success : function(response) {
                response = (typeof data == 'string')? $.parseJSON(response): response;
                createDDFromYear(response, type)
                createDDToYear(response, type)
            },
            error : function(err, b, c) {}
        });
    };


    FAOSTAT_TRADE.prototype.createDD = function(json, obj) {
        var html = '<select id="'+ obj.id +'-select" style="width:'+ obj.width +';" class="">';
        //html += '<option value=""></option>';
        for(var i=0; i < json.length; i++) {
            var selected = (json[i][0] == obj.defaultcode)? 'selected': '';
            html += '<option value='+  json[i][0] + ' '+ selected +'>'+json[i][1] +'</option>';
        }
        html += '</select>';

        $('#' + obj.id).empty();
        $('#' + obj.id).append(html);

        try {
            $('#' + obj.id + '-select').chosen(obj.chosenOptions);
        }  catch (e) {}
    };

    FAOSTAT_TRADE.prototype.fetchCodes = function() {
        var o = this.o;
        o.item.code = $("#" + o.item.id + '-select').val();
        o.area.code = $("#" + o.area.id + '-select').val();
        o.year.fromyear.code = $("#" + o.year.fromyear.id + '-select').val();
        o.year.toyear.code = $("#" + o.year.toyear.id+ '-select').val();
        //this.queryData(o.elements[0].code, o.maps[0], this.sql_growth_rate, true); // import
        this.queryData(o.elements[0].code, o.maps[1], this.sql_average, false); // import
        //this.queryData(o.elements[1].code, o.maps[2], this.sql_growth_rate, true); // export
        this.queryData(o.elements[1].code, o.maps[3], this.sql_average, false); // export
    }

    FAOSTAT_TRADE.prototype.queryData = function(elementcode, m, sql, isGrowthRate) {
        var o = this.o;

        var sqlString = JSON.stringify(sql);
        sqlString = this.replaceAll(sqlString, '_$lang', o.lang)
        sqlString = this.replaceAll(sqlString, '_$itemcode', o.item.code);
        sqlString = this.replaceAll(sqlString, '_$reporterareacode', o.area.code);
        sqlString = this.replaceAll(sqlString, '_$fromyear', o.year.fromyear.code);
        sqlString = this.replaceAll(sqlString, '_$toyear', o.year.toyear.code);
        sqlString = this.replaceAll(sqlString, '_$elementcode', elementcode);

        var data = {};
        data.datasource = 'faostat2';
        data.thousandSeparator = ',';
        data.decimalSeparator = '.';
        data.decimalNumbers = '2';
        data.json = sqlString

        var _this = this;
        $.ajax({
            type : 'POST',
            url : 'http://faostat3.fao.org/wds/rest/table/json',
            data: data,
            success : function(response) {
                var data = (typeof response == 'string')? $.parseJSON(response): response;
                if (data.length <= 0) {
                    _this.applyJoin(m, data)
                }

                if ( !isGrowthRate) {
                    var joindata = _this.parseJoindataResponseAverage(data)
                    _this.applyJoin(m, joindata);
                }
                else {
                    var label = data[0][4];
                    var labels = [];
                    labels.push(label);
                    var numbers = [];
                    var matrix = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][4] == label) {
                            if (data[i][11] != 0) numbers.push(data[i][11]);
                        } else {
                            label = data[i][4];

                            if (numbers.length > 0) {
                                labels.push(label);
                                matrix.push(numbers);
                            }
                            numbers = [];
                            if (data[i][11] != 0) numbers.push(data[i][11]);
                        }
                    }
                    if (numbers.length > 0)
                        matrix.push(numbers);
                    _this.createMultipleGrowthRate(labels, matrix, m)
                }

            },
            error : function(err, b, c) {}
        });
    };


    FAOSTAT_TRADE.prototype.createMultipleGrowthRate = function(labels, matrix, m) {
        var data = {};
        data.labels = JSON.stringify(labels);
        data.json = JSON.stringify(matrix);
        var _this = this;
        $.ajax({
            type: 'POST',
            url: 'http://faostat3.fao.org/r/rest/eval/multiplegrowthrate',
            data: data,
            success: function (response) {
                var data = (typeof response == 'string')? $.parseJSON(response): response;
                var joindata = _this.parseJoindataResponse(data)
                _this.applyJoin(m, joindata);
            },
            error: function (err, b, c) {
                // console.log(err.status + ", " + b + ", " + c);
            }
        });
    };

    FAOSTAT_TRADE.prototype.parseJoindataResponse = function(json) {
        var joindata = [];
        for(var i=0; i < json.length; i++) {
            if ( json[i][1] != "NaN") { //TODO make it nicer
                var o = {}
                o[json[i][0]] = json[i][1]
                joindata.push(o);
            }
        }
        return JSON.stringify(joindata);
    }

    FAOSTAT_TRADE.prototype.parseJoindataResponseAverage  = function(json) {
        var joindata = [];
        for(var i=0; i < json.length; i++) {
            if ( json[i][1] != "NaN") { //TODO make it nicer
                var o = {}
                o[json[i][4]] = json[i][10]
                joindata.push(o);
            }
        }
        return JSON.stringify(joindata);
    }

    FAOSTAT_TRADE.prototype.createMap = function(mapID) {
        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
                //,fullscreenID: 'content'
            }
        }

        var mapOptions = {
            zoomControl:false,
            attributionControl: false
        };

        var m = new FM.Map(mapID, options, mapOptions);
        m.createMap();

        return m;
    }

    FAOSTAT_TRADE.prototype.createLayer = function(o, m) {

        var layer = FMDEFAULTLAYER.getLayer('GAUL0_FAOSTAT', true, 'Growth Rate %');

        layer.layertitle = m.title;
        layer.measurementunit = m.measurementunit;
        layer.legendtitle=m.measurementunit;
        layer.mu = "";
        layer.opacity='0.9'

        layer.addborders='true'
        layer.borderscolor='FFFFFF'
        layer.bordersstroke='0.8'
        layer.bordersopacity='0.4'

        layer.visibility=true;

        layer.srs = 'EPSG:3857';
        layer.layertype = 'JOIN';
        layer.lang='en'; // dynamic
        layer.jointype='shaded';
        layer.defaultgfi = true;
        layer.openlegend = true;
        layer.decimalnumbers='0';

        layer.colorramp= m.colorramp;
        layer.intervals= '5';

        // layer.classification= 'custom';
        //layer.ranges='-30,-20,-10,0,10,20,30';
        //layer.colors= m.colors;
        // layer.colors='d73027,fc8d59,fee08b,ffffbf,d9ef8b,a6d96a,66bd63,1a9850';


        var l = new FM.layer(layer, m.fenixmap);
        return l;
    }

    FAOSTAT_TRADE.prototype.replaceAll = function(text, stringToFind, stringToReplace) {
        var temp = text;
        var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    }


    return FAOSTAT_TRADE;
});