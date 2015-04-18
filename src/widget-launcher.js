var lchrWidth = 108;
var lchrItemHeight = 54;
so.Launcher = cc.Node.extend({
    _callback: null, _target: null,
    _launchBtn: null,
    _items: [],
    ctor: function (launchCallback, target) {
        this._super();
        var size = cc.size(lchrWidth, so.size.height);
        this.setContentSize(size);
        var lchBtn = new cc.MenuItemSprite(
            new cc.Sprite(so.res.launch), new cc.Sprite(so.res.launch_sel), this.launch, this);
        lchBtn.setAnchorPoint(cc.p(1, 1));
        lchBtn.setPosition(cc.p(size.width, size.height));
        lchBtn.setScale(0.5);
        var menu = new cc.Menu(lchBtn);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
        this._launchBtn = lchBtn;
    },
    addItem: function (item) {
        this._items.push(item);
        item.setAnchorPoint(cc.p(1, 1));
        item.setPosition(cc.p(lchrWidth, this._launchBtn.getPositionY()));
        this.addChild(item);
        this._launchBtn.setPositionY(this._launchBtn.getPositionY() - lchrItemHeight);
    },
    removeItem: function (idx) {
        this._items[idx].removeFromParent();
        for (var i = idx + 1; i < this._items.length; i++) {
            this._items[i - 1] = this._items[i];
            this._items[i].setPositionY(this._items[i].getPositionY() + lchrItemHeight);
        }
        this._items.pop();
        this._launchBtn.setPositionY(this._launchBtn.getPositionY() + lchrItemHeight);
    },
    launch: function () {
    }
});
