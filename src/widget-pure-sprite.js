so.PureSprite = cc.Sprite.extend({
    ctor: function (w, h, colour, opacity) {
        cc.Sprite.prototype.ctor.call(this, so.res.white_px);
        this.setScaleX(w); this.setScaleY(h);
        this.setContentSize(cc.size(w, h));
        this.setColor(colour || cc.color(0, 0, 0));
        this.setOpacity(opacity || 0);
        this.setAnchorPoint(cc.p(0, 0));
    }
});
