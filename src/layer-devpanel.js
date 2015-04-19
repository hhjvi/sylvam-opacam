var dcpOffset = 80;
var dcpFadeInOffset = 20;
var dcpItems = [
    ['energy', 'Energy', cc.color.YELLOW],
    ['fire', 'Fire', cc.color.RED],
    ['bassci', 'Basic Science', cc.color.BLUE]
];
var dcpAnimationDur = 0.3;
//var dcpLevelLabelTagStart = 0xcafe;
so.DevCtrlPanel = cc.Layer.extend({
    _callback: null,
    _target: null,
    _values: {},
    _levelLabels: [],
    ctor: function (callback, target) {
        this._super();
        this._callback = callback; this._target = target;
        this.setCascadeOpacityEnabled(true);
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
        panel.setCascadeOpacityEnabled(true);
        this.addChild(panel);
        this.initPanel(panel);
    },
    show: function () {
        this.runAction(cc.sequence(
            cc.show(),
            cc.spawn(cc.fadeIn(dcpAnimationDur),
                cc.EaseSineOut.create(cc.moveBy(dcpAnimationDur, cc.p(0, dcpFadeInOffset))))
        ));
    },
    hide: function () {
        this.runAction(cc.sequence(
            cc.spawn(cc.fadeOut(dcpAnimationDur),
                cc.EaseSineIn.create(cc.moveBy(dcpAnimationDur, cc.p(0, -dcpFadeInOffset)))),
            cc.hide()
        ));
    },
    // Since this one is complicated, we move it out of the ctor() method.
    initPanel: function (panel) {
        // The title label
        var titleLbl = new cc.LabelTTF('Civilization Development', 'Karla', 40);
        titleLbl.setAnchorPoint(cc.p(0, 1));
        titleLbl.setNormalizedPosition(cc.p(0, 0.75));
        this.addChild(titleLbl);
        // The rest
        var modifier = function (x) {
            return function (val) {
                this._values[x] = val;
                this._callback.call(this._target, this._values);
            };
        };
        for (var i in dcpItems) {
            this._values[dcpItems[i][0]] = 0;
            var nameLbl = new cc.LabelTTF(dcpItems[i][1], 'Karla', updownFontSize);
            nameLbl.setAnchorPoint(cc.p(1, 0.5));
            nameLbl.setNormalizedPosition(cc.p(0.468, 0.68 - 0.27 * i));
            nameLbl.setColor(dcpItems[i][2]);
            panel.addChild(nameLbl);
            var levelLbl = new cc.LabelTTF('Level 0\n0%', 'Karla', updownFontSize * 0.4);
            levelLbl.setNormalizedPosition(cc.p(0.538, 0.68 - 0.27 * i));
            levelLbl.setColor(dcpItems[i][2]);
            panel.addChild(levelLbl);
            this._levelLabels[i] = levelLbl;
            var ud = new so.UpDown(modifier(dcpItems[i][0]), this, 0, 15, 0, dcpItems[i][2]);
            ud.setAnchorPoint(cc.p(0, 0.5));
            ud.setNormalizedPosition(cc.p(0.618, 0.68 - 0.27 * i));
            panel.addChild(ud);
        }
    },
    updateLevelLabel: function (i, lv, progress) {
        this._levelLabels[i].setString(
            'Level ' + lv.toString() + '\n' +
            Math.round(progress * 100).toString() + '%');
    }
});
