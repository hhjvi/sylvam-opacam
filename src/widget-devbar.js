var devbarHeight = 26;
var devbarCircleRadius = 12;
var devbarCircleDist = 29;
var devbarEmptyColour = cc.color(192, 192, 192, 128);

so.DevBar = cc.Node.extend({
    _capacity: 0,
    _contents: [],
    _circles: [],
    ctor: function () {
        this._super();
        this.setContentSize(cc.size(so.width, devbarHeight));
    },
    bringCircles: function (num) {
        for (var i = this._circles.length; i < num; i++) {
            this._circles[i] = new so.ContentCircle(devbarCircleRadius, devbarEmptyColour);
            this._circles[i].setAnchorPoint(cc.p(0, 0));
            this._circles[i].setPosition(cc.p(devbarCircleDist * i, 0));
            this.addChild(this._circles[i]);
        }
    },
    setCapacity: function (cap) {
        this._capacity = cap;
        if (this._circles.length < cap) this.bringCircles(cap);
        this.refreshDisp();
    },
    setContents: function (c) {
        this._contents = c;
        this.refreshDisp();
    },
    refreshDisp: function () {
        var tot = 0;
        for (var i in this._contents) tot += this._contents[i].num;
        if (this._circles.length < tot) this.bringCircles(tot);
        tot = 0;
        for (var i in this._contents) {
            for (var j = tot; j < tot + this._contents[i].num; j++) {
                this._circles[j].setColor(this._contents[i].colour);
                this._circles[j].setVisible(true);
            }
            tot += this._contents[i].num;
        }
        if (tot < this._capacity) {
            for (var i = tot; i < this._capacity; i++)
                this._circles[i].setColor(devbarEmptyColour);
        }
        for (var i = Math.max(tot, this._capacity); i < this._circles.length; i++)
            this._circles[i].setVisible(false);
    }
});
