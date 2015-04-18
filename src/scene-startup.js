so.StartupScene = cc.Scene.extend({
    _mapLayer: null,
    onEnter: function () {
        this._super();
        var size = cc.director.getVisibleSize();
        _mapLayer = new cc.Layer();
        _mapLayer.setContentSize(cc.size(0, 0));
        _mapLayer.setPosition(cc.p(size.width * 0.2, size.height * 0.2));
        this.addChild(_mapLayer);
        var player = new so.Circle(10, cc.color(128, 192, 255));
        player.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
        _mapLayer.addChild(player);
        _mapLayer.runAction(cc.moveBy(4, cc.p(100, -50)));
        so.enableTooltip(_mapLayer);
        var playerTooltip = new so.Tooltip(['Cygnia', cc.color(128, 192, 255), 'Player', cc.color.BLACK]);
        so.putTooltip(_mapLayer, player.getBLCorner(), player.getCircleSize(), playerTooltip);
        var tt2 = new so.Tooltip(['Blasca', cc.color(68, 192, 77), 'Ordinary', cc.color.WHITE]);
        so.putTooltip(_mapLayer, cc.p(0, 0), cc.size(60, 30), tt2);
    }
});
