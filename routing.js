require(
    ['jquery',
    'backbone'], function($, Backbone) {

    var ApplicationRouter = Backbone.Router.extend({

        lang: "en",
        placeholder_container : "main_content",
        isRendered: false,

        initialize: function (options) {
            Backbone.history.start();
        },

        routes: {
            '(/)join_gaul0': 'join_gaul0',
            '(/)join_gaul1': 'join_gaul1',
            '(/)join_gaul2': 'join_gaul2',
            '(/)faostat_trade': 'faostat_trade'
        },

        join_gaul0: function() {
            require(['fm_join_gaul0_module'], function(MODULE) {
                new MODULE().init({});
            });
        },

        join_gaul1: function() {
            require(['fm_join_gaul1_module'], function(MODULE) {
                new MODULE().init({});
            });
        },

        join_gaul2: function() {
            require(['fm_join_gaul2_module'], function(MODULE) {
                new MODULE().init({});
            });
        },

        faostat_trade: function() {
            require(['fm_faostat_trade_module'], function(MODULE) {
                new MODULE().init({});
            });
        },

        _init: function (lang) {
            if (lang) {
                this._initLanguage(lang)
            }
        },

        _initLanguage: function (lang) {
            require.config({"locale": lang});
        }

    });

    new ApplicationRouter();

});