var stbdTitleFontSize = 36;
var stbdTextFontSize = 26;
so.Storyboard = cc.LayerColor.extend({
    _curIndex: 0,
    _titles: [], _texts: [],
    _titleLbl: null,
    _textLbl: null,
    ctor: function (titles, texts, opacity) {
        cc.LayerColor.prototype.ctor.call(this, cc.color(0, 0, 0, opacity || 192));
        this.setCascadeOpacityEnabled(true);
        this._titles = titles; this._texts = texts;

        var titleLbl = new cc.LabelTTF(titles[0], 'Karla', stbdTitleFontSize);
        titleLbl.setAnchorPoint(cc.p(0, 0));
        titleLbl.setNormalizedPosition(cc.p(0.05, 0.8));
        this.addChild(titleLbl);
        this._titleLbl = titleLbl;
        var textLbl = new cc.LabelTTF(texts[0], 'Karla',
            stbdTextFontSize, cc.size(so.size.width * 0.9, 0));
        textLbl.setAnchorPoint(cc.p(0, 1));
        textLbl.setNormalizedPosition(cc.p(0.05, 0.8));
        this.addChild(textLbl);
        this._textLbl = textLbl;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () { return true; },
            onTouchEnded: function (a) { return function () {
                a._curIndex++;
                if (a._curIndex === a._titles.length) {
                    a.getParent().resume(); a.removeFromParent();
                } else {
                    a._titleLbl.setString(a._titles[a._curIndex]);
                    a._textLbl.setString(a._texts[a._curIndex]);
                }
            }; }(this)
        }, this);
    }
});
