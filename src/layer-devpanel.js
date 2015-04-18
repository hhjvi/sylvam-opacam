var dcpOffset = 60;
so.DevCtrlPanel = cc.Layer.extend({
    ctor: function () {
        this._super();
        // The menu to hide the panel
        var menuHide = new cc.MenuItemSprite(
            new so.PureSprite(so.size.width, so.size.height),
            new so.PureSprite(so.size.width, so.size.height), this.hide, this);
        menuHide.setAnchorPoint(cc.p(0, 1));
        menuHide.setNormalizedPosition(cc.p(0, 1));
        var menu = new cc.Menu(menuHide);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
        // The main part of the panel
        var panel = new cc.LayerColor(cc.color(255, 255, 255, 192),
            so.size.width, so.size.height - dcpOffset);
        panel.setPosition(cc.p(0, 0));
        this.addChild(panel);
        this.initPanel(panel);
    },
    show: function () {
        this.setVisible(true);
    },
    hide: function () {
        this.setVisible(false);
    },
    // Since this one is complicated, we move it out of the ctor() method.
    initPanel: function (panel) {
        var ud = new so.UpDown(
            function (val) { console.log(val); }, 0, 99);
        ud.setAnchorPoint(cc.p(1, 0));
        ud.setNormalizedPosition(cc.p(0.3, 0.3));
        panel.addChild(ud);
    }
});
