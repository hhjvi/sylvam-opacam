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
