so.StartupScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var size = cc.director.getVisibleSize();
        var player = new so.Circle(10, cc.color(128, 192, 255));
        player.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
        this.addChild(player);
        var playerTooltip = new so.Tooltip(['a', cc.color.BLACK, 'b', cc.color.GREEN]);
        this.addChild(playerTooltip);
    }
});
