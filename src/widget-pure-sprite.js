so.PureSprite = cc.Sprite.extend({
    ctor: function (w, h) {
        cc.Sprite.prototype.ctor.call(this, so.res.white_px);
        this.setScaleX(w); this.setScaleY(h);
        //this.setOpacity(0);
    }
});
