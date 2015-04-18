so.StartupScene = cc.Scene.extend({
    _mapLayer: null,
    onEnter: function () {
        this._super();
        var size = cc.director.getVisibleSize();
        _mapLayer = new cc.Layer();
        _mapLayer.setContentSize(cc.size(0, 0));
        _mapLayer.setPosition(cc.p(size.width * 0.2, size.height * 0.2));
        this.addChild(_mapLayer);
        so.enableTooltip(_mapLayer);

        var player = new so.Circle(10, cc.color(128, 192, 255));
        player.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
        _mapLayer.addChild(player);
        var playerTooltip = new so.Tooltip(['Cygnia', cc.color(128, 192, 255), 'Player', cc.color.BLACK]);
        so.putTooltip(_mapLayer, player.getBLCorner(), player.getCircleSize(), playerTooltip);
    }
});
