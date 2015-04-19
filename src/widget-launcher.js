var lchrWidth = 108;
var lchrItemHeight = 54;
var lchrBtnWidth = 48;
var lchrButtons = so.res.launch;
so.Launcher = cc.Node.extend({
    _callback: null, _target: null,
    _launchBtns: [],
    _launchMenu: null,
    _items: [],
    ctor: function (launchCallback, target) {
        this._super();
        this._callback = launchCallback;
        this._target = target;
        var size = cc.size(lchrWidth, so.size.height);
        this.setContentSize(size);

        var menu = new cc.Menu();
        menu.setPosition(cc.p(0, 0));
        for (var i in lchrButtons) {
            var lchBtn = new cc.MenuItemSprite(
                new cc.Sprite(so.res.launch[i][0]),
                new cc.Sprite(so.res.launch[i][1]), this.launch, this);
            lchBtn.setAnchorPoint(cc.p(1, 1));
            lchBtn.setPosition(cc.p(size.width - lchrBtnWidth * i, size.height));
            lchBtn.setScale(0.5);
            menu.addChild(lchBtn, 0, parseInt(i));
            this._launchBtns[i] = lchBtn;
        }
        this.addChild(menu);
        this._launchMenu = menu;
        console.log(this._launchBtns[0].getPosition());
        console.log(this._launchBtns[0].convertToWorldSpace(this._launchBtns[0].getPosition()));
    },
    addItem: function (item) {
        this._items.push(item);
        item.setAnchorPoint(cc.p(1, 1));
        item.setPosition(cc.p(lchrWidth, (this._items.length - 1) * lchrItemHeight));
        this.addChild(item);
        this._launchMenu.setPositionY(-this._items.length * lchrItemHeight);
    },
    removeItem: function (idx) {
        this._items[idx].removeFromParent();
        for (var i = idx + 1; i < this._items.length; i++) {
            this._items[i - 1] = this._items[i];
            this._items[i].setPositionY(i * lchrItemHeight);
        }
        this._items.pop();
        this._launchBtn.setPositionY(-this._items.length * lchrItemHeight);
    },
    launch: function (sender) {
        if (this._callback) this._callback.call(this._target, sender.getTag());
    }
});
