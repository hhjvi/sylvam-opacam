var updownSize = cc.size(100, 64);
var updownFontSize = 32;
so.UpDown = cc.Node.extend({
    _callback: null, _target: null,
    _hibnd: 99, _lobnd: 0, _value: 0,
    _label: null,
    ctor: function (callback, target, lobnd, hibnd, value, lblcolour) {
        this._super();
        this._callback = callback; this._target = target;
        if (value == undefined || value < lobnd) value = lobnd;
        else if (value > hibnd) value = hibnd;
        this._hibnd = hibnd; this._lobnd = lobnd; this._value = value;
        this.setCascadeOpacityEnabled(true);
        var upBtn = new cc.MenuItemSprite(
            new cc.Sprite(so.res.up_btn), new cc.Sprite(so.res.up_btn_sel), this.up, this);
        upBtn.setAnchorPoint(cc.p(1, 0));
        upBtn.setNormalizedPosition(cc.p(1, 0.5));
        upBtn.setScale(0.5);
        var downBtn = new cc.MenuItemSprite(
            new cc.Sprite(so.res.down_btn), new cc.Sprite(so.res.down_btn_sel), this.down, this);
        downBtn.setAnchorPoint(cc.p(1, 1));
        downBtn.setNormalizedPosition(cc.p(1, 0.5));
        downBtn.setScale(0.5);
        var menu = new cc.Menu(upBtn, downBtn);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 0);
        menu.setContentSize(updownSize);
        this.setContentSize(updownSize);
        // The label
        this._label = new cc.LabelTTF(value.toString(), 'Arial', updownFontSize);
        this._label.setAnchorPoint(cc.p(0, 0.5));
        this._label.setNormalizedPosition(cc.p(0.04, 0.5));
        this._label.setColor(lblcolour || cc.color.WHITE);
        this.addChild(this._label);
    },
    up: function () {
        if (this._value < this._hibnd) this._callback.call(this._target, ++this._value);
        this._label.setString(this._value.toString());
    },
    down: function () {
        if (this._value > this._lobnd) this._callback.call(this._target, --this._value);
        this._label.setString(this._value.toString());
    }
});
