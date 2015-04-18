so.Circle = cc.DrawNode.extend({
    _radius: 0,
    ctor: function (radius, colour) {
        cc.DrawNode.prototype.ctor.call(this);
        this._radius = radius;
        this.drawDot(cc.p(0, 0), radius, colour);
    },
    getBLCorner: function () {
        return cc.p(this._position.x - this._radius, this._position.y - this._radius);
    },
    getCircleSize: function () {
        return cc.size(this._radius * 2, this._radius * 2);
    }
});

// Circle with a content size and a fixed radius.
// Can still be zoomed/scaled though.
so.ContentCircle = cc.DrawNode.extend({
    ctor: function (radius, colour) {
        cc.DrawNode.prototype.ctor.call(this);
        this.drawDot(cc.p(radius, radius), radius, colour);
        this.setContentSize(cc.size(radius + radius, radius + radius));
    }
});
