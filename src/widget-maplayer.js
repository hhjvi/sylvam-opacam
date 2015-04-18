so.MapLayer = cc.Layer.extend({
    _visCentX: 0, _visCentY: 0,
    _visScale: 1,
    _mapChildren: [],
    ctor: function () {
        this._super();
    },
    addMapChild: function (child) {
        this._mapChildren.push(child);
        cc.Layer.prototype.addChild.apply(this, arguments);
    },
    getVisibleCentre: function () {
        return cc.p(this._visCentX, this._visCentY);
    },
    getVisibleCentreX: function () { return this._visCentX; },
    getVisibleCentreY: function () { return this._visCentY; },
    setVisibleCentre: function (x, y) {
        this.setPosition(cc.p(-x + so.size.width * 0.5, -y + so.size.height * 0.5));
        this._visCentX = x; this._visCentY = y;
    },
    setVisibleScale: function (scale) {
        var diffScale = scale / this._visScale;
        var centre = cc.p(this._visCentX, this._visCentY);
        for (var i in this._mapChildren) {
            var p = this._mapChildren[i].getPosition();
            this._mapChildren[i].setPosition(cc.pAdd(p, cc.pMult(cc.pSub(centre, p), 1 - diffScale)));
        }
        this._visScale = scale;
    }
});
