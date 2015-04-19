var ntfctFontSize = 24;
var ntfctLineHeight = 30;
var ntfctTransitionDur = 0.2;
var ntfctKeepDur = 5000;    // in milliseconds
so.Notificator = cc.Node.extend({
    ctor: function () {
        this._super();
    },
    addNotification: function (text, colour) {
        // Move up
        var c = this.getChildren();
        for (var i in c) c[i].runAction(cc.moveBy(ntfctTransitionDur, cc.p(0, ntfctLineHeight)));
        // Add the new comer
        colour = colour || cc.color.WHITE;
        var label = new cc.LabelTTF(text, 'Arial', ntfctFontSize);
        label.setAnchorPoint(cc.p(0, 0));
        label.setColor(colour);
        label.setOpacity(0);
        this.addChild(label);
        label.runAction(cc.fadeIn(ntfctTransitionDur));
        setTimeout(function (a) { return function () {
                a.runAction(cc.sequence(cc.fadeOut(ntfctTransitionDur), cc.removeSelf()));
            }; }(label), ntfctKeepDur);
    }
});
