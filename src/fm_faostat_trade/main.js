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

        this.sql_import = "select a1.areanamee, a2.areanamee, i.itemnamee, e.elementnamee, avg(d.value) as value, e.unitnamee from TradeMatrix as d, Area a1, Area a2, Item i, Element e where domaincode IN ('TM') and d.reporterareacode IN ('1') and a1.areacode = d.reporterareacode and a2.areacode = d.PartnerAreaCode  and i.itemcode = d.itemcode and e.elementcode = d.elementcode and e.elementcode IN ('5622') and i.itemcode IN ('886') and d.year between 2009 and 2010 group by a1.areanamee, a2.areanamee, i.itemnamee, e.elementnamee, e.unitnamee order by value DESC"
        this.sql_export = "select a1.areanamee, a2.areanamee, i.itemnamee, e.elementnamee, avg(d.value) as value, e.unitnamee from TradeMatrix as d, Area a1, Area a2, Item i, Element e where domaincode IN ('TM') and d.reporterareacode IN ('1') and a1.areacode = d.reporterareacode and a2.areacode = d.PartnerAreaCode  and i.itemcode = d.itemcode and e.elementcode = d.elementcode and e.elementcode IN ('5922') and i.itemcode IN ('886') and d.year between 2009 and 2010 group by a1.areanamee, a2.areanamee, i.itemnamee, e.elementnamee, e.unitnamee order by value DESC"

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
        this.queryData(o.elements[0].code, o.maps[1], this.sql_import, this.sql_export, false); // import
        //this.queryData(o.elements[1].code, o.maps[2], this.sql_growth_rate, true); // export
        //this.queryData(o.elements[1].code, o.maps[3], this.sql_export, false); // export
    }

    FAOSTAT_TRADE.prototype.queryData = function(elementcode, m, sql1, sql2, isGrowthRate) {
        var o = this.o;

        var sqlExport = sql1;
        sqlExport = this.replaceAll(sqlExport, '_$lang', o.lang)
        sqlExport = this.replaceAll(sqlExport, '{{itemcode}}', o.item.code);
        sqlExport = this.replaceAll(sqlExport, '{{areacode}}', o.area.code);
        sqlExport = this.replaceAll(sqlExport, '{{fromyear}}', o.year.fromyear.code);
        sqlExport = this.replaceAll(sqlExport, '{{toyear}}', o.year.toyear.code);
        sqlExport = this.replaceAll(sqlExport, '{{elementcode}}', elementcode);

        var sqlImport = sql2;
        sqlImport = this.replaceAll(sqlImport, '_$lang', o.lang)
        sqlImport = this.replaceAll(sqlImport, '{{itemcode}}', o.item.code);
        sqlImport = this.replaceAll(sqlImport, '{{areacode}}', o.area.code);
        sqlImport = this.replaceAll(sqlImport, '{{fromyear}}', o.year.fromyear.code);
        sqlImport = this.replaceAll(sqlImport, '{{toyear}}', o.year.toyear.code);
        sqlImport = this.replaceAll(sqlImport, '{{elementcode}}', elementcode);

        var objExport = {
            "query": sqlExport
        }
        var dataExport = {};
        dataExport.datasource = 'faostatdb';
        dataExport.json = JSON.stringify(objExport);



        var objImport = {
            "query": sqlImport
        }
        var dataImport = {};
        dataImport.datasource = 'faostatdb';
        dataImport.json = JSON.stringify(objImport);


        var _this = this;
        $.ajax({
            type: 'POST',
            url: 'http://faostat3.fao.org/wds/rest/table/json',
            data: dataExport,
            success : function(response) {
                var dexport = (typeof response == 'string')? $.parseJSON(response): response;

                $.ajax({
                    type: 'POST',
                    url: 'http://faostat3.fao.org/wds/rest/table/json',
                    data: dataImport,
                    success : function(response) {
                        var dimport = (typeof response == 'string')? $.parseJSON(response): response;

                    },
                    error : function(err, b, c) {}
                });
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