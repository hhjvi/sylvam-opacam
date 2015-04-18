so.MapLayer = cc.Layer.extend({
    _visCentX: 0, _visCentY: 0,
    _visScale: 1,
    _mapChildren: [],   // These don't scale with the map...
    _mapRegions: [],    // ... while these do.
    ctor: function () {
        this._super();
    },
    addMapPoint: function (child) {
        this._mapChildren.push(child);
        cc.Layer.prototype.addChild.apply(this, arguments);
    },
    addMapRegion: function (child) {
        this._mapRegions.push(child);
        this.addMapPoint(child);
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
        for (var i in this._mapRegions) {
            this._mapRegions[i].setScale(this._mapRegions[i].getScale() * diffScale);
        }
        this._visScale = scale;
    }
});
