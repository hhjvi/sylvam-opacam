so.StartupScene = cc.Scene.extend({
    _mapLayer: null,
    onEnter: function () {
        this._super();
        var size = cc.director.getVisibleSize();
        mapLayer = new so.MapLayer();
        mapLayer.setContentSize(cc.size(0, 0));
        mapLayer.setVisibleCentre(20, 50);
        this.addChild(mapLayer);
        so.enableTooltip(mapLayer);

        var player = new so.Circle(10, cc.color(128, 192, 255));
        player.setPosition(cc.p(0, 0));
        mapLayer.addMapChild(player);
        var playerTooltip = new so.Tooltip(['Cygnia', cc.color(128, 192, 255), 'Player', cc.color.BLACK]);
        so.putTooltip(mapLayer, player.getBLCorner(), player.getCircleSize(), playerTooltip);

        this._mapLayer = mapLayer;
    }
});
