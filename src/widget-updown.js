var updownSize = cc.size(40, 64);
so.UpDown = cc.Node.extend({
    _callback: null,
    _hibnd: 99, _lobnd: 0, _value: 0,
    ctor: function (callback, lobnd, hibnd) {
        this._super();
        this._callback = callback;
        this._hibnd = hibnd; this._lobnd = lobnd; this._value = 0;
        var upBtn = new cc.MenuItemSprite(
            new cc.Sprite(so.res.up_btn), new cc.Sprite(so.res.up_btn_sel), this.up, this);
        upBtn.setAnchorPoint(cc.p(0.5, 0));
        upBtn.setNormalizedPosition(cc.p(0.5, 0.5));
        upBtn.setScale(0.5);
        var downBtn = new cc.MenuItemSprite(
            new cc.Sprite(so.res.down_btn), new cc.Sprite(so.res.down_btn_sel), this.down, this);
        downBtn.setAnchorPoint(cc.p(0.5, 1));
        downBtn.setNormalizedPosition(cc.p(0.5, 0.5));
        downBtn.setScale(0.5);
        var menu = new cc.Menu(upBtn, downBtn);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 0);
        this.setContentSize(updownSize);
    },
    up: function () {
        if (this._value < this._hibnd) this._callback(++this._value);
    },
    down: function () {
        if (this._value > this._lobnd) this._callback(--this._value);
    }
});
