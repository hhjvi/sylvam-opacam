so.StartupScene = cc.Scene.extend({
    _mapLayer: null,
    onEnter: function () {
        this._super();
        var size = cc.director.getVisibleSize();
        mapLayer = new so.MapLayer();
        mapLayer.setContentSize(cc.size(0, 0));
        mapLayer.setVisibleCentre(0, 0);
        this.addChild(mapLayer);
        so.enableTooltip(mapLayer);
        this._mapLayer = mapLayer;

        this.initMap();
    },
    initMap: function () {
        var player = new so.Circle(10, cc.color(128, 192, 255));
        player.setPosition(cc.p(0, 0));
        this._mapLayer.addMapChild(player);
        var playerTooltip = new so.Tooltip(['Cygnia', cc.color(128, 192, 255), 'Player', cc.color.BLACK]);
        so.putTooltip(this._mapLayer, player.getBLCorner(), player.getCircleSize(), playerTooltip);
        for (var i = 0; i < 10; i++) {
            var s = new so.Circle(i, cc.color(255, 64, 0));
            s.setPosition(cc.p(40 * i - 140, 15 * i - 88));
            this._mapLayer.addMapChild(s);
            var tt = new so.Tooltip(['Solar #' + i, cc.color(255, 64, 0), 'Ordinary', cc.color.WHITE]);
            so.putTooltip(this._mapLayer, s.getBLCorner(), s.getCircleSize(), tt);
        }
    }
});
