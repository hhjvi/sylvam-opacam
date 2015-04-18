so.Circle = cc.DrawNode.extend({
    ctor: function (radius, colour) {
        cc.DrawNode.prototype.ctor.call(this);
        this.drawDot(cc.p(0, 0), radius, colour);
    }
});
