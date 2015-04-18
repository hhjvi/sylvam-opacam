var dcpOffset = 60;
so.DevCtrlPanel = cc.Layer.extend({
    ctor: function () {
        this._super();
        var panel = new cc.LayerColor(cc.color(255, 255, 255, 192),
            so.size.width, so.size.height - dcpOffset);
        panel.setPosition(cc.p(0, 0));
        this.addChild(panel);
        // The menu to hide the panel
        console.log('');
        var menuHide = new cc.MenuItemSprite(
            new so.PureSprite(so.size.width, so.size.height),
            new so.PureSprite(so.size.width, so.size.height), this.hide, this);
        menuHide.setAnchorPoint(cc.p(0, 1));
        menuHide.setNormalizedPosition(cc.p(0, 1));
        var menu = new cc.Menu(menuHide);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
    },
    show: function () {
        this.setVisible(true);
    },
    hide: function () {
        this.setVisible(false);
    }
});
